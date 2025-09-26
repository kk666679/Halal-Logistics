import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Check if auth is enabled
  if (process.env.AUTH_ENABLED !== 'true') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;

  // Check API Key first (for service-to-service communication)
  if (apiKey && apiKey === process.env.API_KEY) {
    req.user = { type: 'service', key: apiKey };
    return next();
  }

  // Check JWT token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Missing or invalid authorization header');
    res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
    return;
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

export const optionalAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Check if auth is enabled
  if (process.env.AUTH_ENABLED !== 'true') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;

  // Check API Key first (for service-to-service communication)
  if (apiKey && apiKey === process.env.API_KEY) {
    req.user = { type: 'service', key: apiKey };
    return next();
  }

  // Check JWT token (optional)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continue without authentication
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token in optional auth:', error);
    next(); // Continue without authentication even if token is invalid
  }
};

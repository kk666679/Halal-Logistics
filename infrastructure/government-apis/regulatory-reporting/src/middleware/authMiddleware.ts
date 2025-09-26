import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// JWT Authentication middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn('Access attempt without token', {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    res.status(401).json({
      success: false,
      error: 'Access denied. No token provided.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token provided', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      error: (error as Error).message
    });
    res.status(403).json({
      success: false,
      error: 'Invalid token.'
    });
  }
};

// API Key authentication middleware
export const authenticateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    logger.warn('Access attempt without API key', {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    res.status(401).json({
      success: false,
      error: 'Access denied. No API key provided.'
    });
    return;
  }

  const expectedApiKey = process.env.API_KEY;
  if (apiKey !== expectedApiKey) {
    logger.warn('Invalid API key provided', {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    res.status(403).json({
      success: false,
      error: 'Invalid API key.'
    });
    return;
  }

  next();
};

// Combined authentication middleware (try JWT first, then API key)
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];

  // If no authentication provided
  if (!authHeader && !apiKey) {
    logger.warn('Access attempt without authentication', {
      ip: req.ip,
      url: req.url,
      method: req.method
    });
    res.status(401).json({
      success: false,
      error: 'Access denied. Authentication required.'
    });
    return;
  }

  // Try JWT authentication first
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateToken(req, res, next);
  }

  // Try API key authentication
  if (apiKey) {
    return authenticateApiKey(req, res, next);
  }

  // No valid authentication method found
  logger.warn('Invalid authentication method', {
    ip: req.ip,
    url: req.url,
    method: req.method
  });
  res.status(401).json({
    success: false,
    error: 'Invalid authentication method.'
  });
};

// Optional authentication middleware (doesn't fail if no auth)
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const apiKey = req.headers['x-api-key'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'your-secret-key');
      req.user = decoded;
    } catch (error) {
      // Ignore JWT errors for optional auth
    }
  }

  next();
};

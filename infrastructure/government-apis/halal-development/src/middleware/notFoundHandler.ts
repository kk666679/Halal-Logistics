import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  logger.warn(`404 Error - Route not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: [
      'GET /health',
      'GET /api/v1/status/health',
      'POST /api/v1/halal-dev/validate',
      'GET /api/v1/halal-dev/standards',
      'POST /api/v1/compliance/check',
      'GET /api/v1/compliance/reports',
      'POST /api/v1/audit/log'
    ]
  });
};

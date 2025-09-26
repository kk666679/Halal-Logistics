import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`);

  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    availableRoutes: [
      'GET /api/v1/status/health',
      'GET /api/v1/status/status',
      'GET /api/v1/status/metrics',
      'POST /api/v1/reports/generate',
      'GET /api/v1/reports/:id',
      'GET /api/v1/reports',
      'POST /api/v1/schedules',
      'GET /api/v1/schedules',
      'POST /api/v1/templates',
      'GET /api/v1/templates'
    ]
  });
};

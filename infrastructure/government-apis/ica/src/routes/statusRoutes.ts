import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'ICA Validation Service is healthy',
    timestamp: new Date().toISOString(),
    service: 'ica-validation-service',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

router.get('/status', (req: Request, res: Response) => {
  const status = {
    success: true,
    message: 'ICA Validation Service status',
    timestamp: new Date().toISOString(),
    service: 'ica-validation-service',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/status/health',
      ica: '/api/v1/ica',
      validation: '/api/v1/validation',
      compliance: '/api/v1/compliance'
    },
    features: {
      productValidation: true,
      standardCompliance: true,
      certificateVerification: true,
      realTimeValidation: true
    },
    connections: {
      icaApi: process.env.ICA_API_URL ? 'configured' : 'not configured',
      database: 'redis',
      websocket: true
    }
  };

  logger.info('Status check requested');
  res.status(200).json(status);
});

router.get('/metrics', (req: Request, res: Response) => {
  const metrics = {
    success: true,
    message: 'Service metrics',
    timestamp: new Date().toISOString(),
    metrics: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      requests: {
        total: 0, // This would be tracked in a real implementation
        successful: 0,
        failed: 0
      },
      responseTimes: {
        average: 0,
        min: 0,
        max: 0
      }
    }
  };

  res.status(200).json(metrics);
});

export { router as statusRoutes };

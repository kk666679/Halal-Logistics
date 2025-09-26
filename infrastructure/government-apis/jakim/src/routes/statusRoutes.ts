import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'JAKIM Integration Service is healthy',
    timestamp: new Date().toISOString(),
    service: 'jakim-integration',
    version: '1.0.0'
  });
});

router.get('/status', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'JAKIM Integration Service is operational',
    timestamp: new Date().toISOString(),
    service: 'jakim-integration',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    endpoints: {
      jakim: '/api/v1/jakim',
      certificates: '/api/v1/certificates',
      validation: '/api/v1/validation'
    }
  });
});

export { router as statusRoutes };

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import os from 'os';

const router = Router();

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Regulatory Reporting Service',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100
    },
    system: {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      cpus: os.cpus().length,
      loadAverage: os.loadavg()
    }
  };

  res.status(200).json(healthCheck);
});

// Service status endpoint
router.get('/status', (req: Request, res: Response) => {
  const status = {
    status: 'operational',
    timestamp: new Date().toISOString(),
    service: 'Regulatory Reporting Service',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    configuration: {
      port: process.env.PORT || 3021,
      authEnabled: process.env.AUTH_ENABLED === 'true',
      logLevel: process.env.LOG_LEVEL || 'info',
      databaseConnected: false, // Will be updated when DB is connected
      cacheConnected: false, // Will be updated when Redis is connected
      features: {
        reportGeneration: true,
        scheduledReporting: true,
        templateManagement: true,
        complianceTracking: true,
        multiFormatExport: true
      }
    },
    endpoints: {
      public: [
        'GET /api/v1/status/health',
        'GET /api/v1/status/status',
        'GET /api/v1/status/metrics'
      ],
      protected: [
        'POST /api/v1/reports/generate',
        'GET /api/v1/reports/:id',
        'GET /api/v1/reports',
        'POST /api/v1/schedules',
        'GET /api/v1/schedules',
        'POST /api/v1/templates',
        'GET /api/v1/templates',
        'POST /api/v1/compliance/assess'
      ]
    }
  };

  res.status(200).json(status);
});

// Service metrics endpoint
router.get('/metrics', (req: Request, res: Response) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    service: 'Regulatory Reporting Service',
    version: '1.0.0',
    performance: {
      uptime: process.uptime(),
      memory: {
        rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
        heapTotal: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
        heapUsed: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
        external: Math.round((process.memoryUsage().external / 1024 / 1024) * 100) / 100
      },
      cpu: {
        usage: process.cpuUsage(),
        system: os.loadavg()
      }
    },
    reports: {
      totalGenerated: 0, // Will be updated from database
      pending: 0,
      failed: 0,
      scheduled: 0
    },
    schedules: {
      active: 0,
      pending: 0,
      completed: 0
    },
    templates: {
      available: 0, // Will be updated from database
      active: 0
    },
    compliance: {
      assessments: 0,
      violations: 0,
      resolved: 0
    }
  };

  res.status(200).json(metrics);
});

// API documentation endpoint
router.get('/docs', (req: Request, res: Response) => {
  const docs = {
    service: 'Regulatory Reporting Service',
    version: '1.0.0',
    description: 'Automated regulatory reporting and compliance management service',
    baseUrl: `${req.protocol}://${req.get('host')}`,
    endpoints: {
      health: {
        method: 'GET',
        path: '/api/v1/status/health',
        description: 'Service health check',
        response: 'Health status object'
      },
      status: {
        method: 'GET',
        path: '/api/v1/status/status',
        description: 'Service status and configuration',
        response: 'Service status object'
      },
      metrics: {
        method: 'GET',
        path: '/api/v1/status/metrics',
        description: 'Service performance metrics',
        response: 'Performance metrics object'
      },
      generateReport: {
        method: 'POST',
        path: '/api/v1/reports/generate',
        description: 'Generate a new regulatory report',
        auth: 'Required',
        body: {
          reportType: 'string (required)',
          templateId: 'string (optional)',
          dateRange: 'object (optional)',
          format: 'string (optional)',
          recipients: 'array (optional)'
        }
      },
      getReports: {
        method: 'GET',
        path: '/api/v1/reports',
        description: 'Get list of generated reports',
        auth: 'Required',
        query: {
          page: 'number (optional)',
          limit: 'number (optional)',
          status: 'string (optional)',
          reportType: 'string (optional)'
        }
      },
      getReport: {
        method: 'GET',
        path: '/api/v1/reports/:id',
        description: 'Get specific report details',
        auth: 'Required'
      },
      createSchedule: {
        method: 'POST',
        path: '/api/v1/schedules',
        description: 'Create scheduled report',
        auth: 'Required',
        body: {
          name: 'string (required)',
          reportType: 'string (required)',
          schedule: 'cron expression (required)',
          templateId: 'string (optional)',
          format: 'string (optional)',
          recipients: 'array (optional)'
        }
      },
      getSchedules: {
        method: 'GET',
        path: '/api/v1/schedules',
        description: 'Get scheduled reports',
        auth: 'Required'
      },
      createTemplate: {
        method: 'POST',
        path: '/api/v1/templates',
        description: 'Create report template',
        auth: 'Required',
        body: {
          name: 'string (required)',
          description: 'string (optional)',
          reportType: 'string (required)',
          template: 'object (required)',
          fields: 'array (required)'
        }
      },
      getTemplates: {
        method: 'GET',
        path: '/api/v1/templates',
        description: 'Get available templates',
        auth: 'Required'
      }
    },
    authentication: {
      jwt: {
        header: 'Authorization: Bearer <token>',
        description: 'JWT token authentication'
      },
      apiKey: {
        header: 'X-API-Key: <api-key>',
        description: 'API key authentication for service-to-service communication'
      }
    },
    reportTypes: [
      'halal-compliance',
      'food-safety',
      'quality-control',
      'supply-chain',
      'financial',
      'environmental',
      'custom'
    ],
    exportFormats: [
      'pdf',
      'excel',
      'csv',
      'json',
      'xml'
    ]
  };

  res.status(200).json(docs);
});

export { router as statusRoutes };

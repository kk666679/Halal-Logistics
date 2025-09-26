import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { authMiddleware } from './middleware/authMiddleware.js';

// Import routes
import { statusRoutes } from './routes/statusRoutes.js';
import { reportRoutes } from './routes/reportRoutes.js';
import { scheduleRoutes } from './routes/scheduleRoutes.js';
import { templateRoutes } from './routes/templateRoutes.js';
import { complianceRoutes } from './routes/complianceRoutes.js';
import { customsRoutes } from './routes/customsRoutes.js';

class RegulatoryReportingService {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3021');
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW || '15')) * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      next();
    });
  }

  private initializeRoutes(): void {
    // Public routes
    this.app.use('/api/v1/status', statusRoutes);

    // Protected routes
    this.app.use('/api/v1/reports', authMiddleware, reportRoutes);
    this.app.use('/api/v1/schedules', authMiddleware, scheduleRoutes);
    this.app.use('/api/v1/templates', authMiddleware, templateRoutes);
    this.app.use('/api/v1/compliance', authMiddleware, complianceRoutes);
    this.app.use('/api/v1/customs', authMiddleware, customsRoutes);

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        service: 'Regulatory Reporting Service',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize scheduled tasks
      await this.initializeScheduledTasks();

      // Start the server
      this.app.listen(this.port, () => {
        logger.info(`🚀 Regulatory Reporting Service started successfully`, {
          port: this.port,
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString()
        });

        console.log(`📊 Regulatory Reporting Service is running on port ${this.port}`);
        console.log(`🔗 Health check: http://localhost:${this.port}/health`);
        console.log(`📋 API Documentation: http://localhost:${this.port}/api/v1/status/docs`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      logger.error('Failed to start Regulatory Reporting Service', error);
      process.exit(1);
    }
  }

  private async initializeScheduledTasks(): Promise<void> {
    // Import and initialize scheduled reporting tasks
    try {
      const { ScheduledReportingService } = await import('./services/scheduledReportingService.js');
      const scheduler = new ScheduledReportingService();
      await scheduler.initialize();

      logger.info('✅ Scheduled reporting tasks initialized');
    } catch (error) {
      logger.error('Failed to initialize scheduled tasks', error);
    }
  }
}

// Start the service
const service = new RegulatoryReportingService();
service.start().catch((error) => {
  logger.error('Unhandled error during service startup', error);
  process.exit(1);
});

export default RegulatoryReportingService;

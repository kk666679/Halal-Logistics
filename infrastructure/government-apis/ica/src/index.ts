import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { authMiddleware } from './middleware/authMiddleware';

import { icaRoutes } from './routes/icaRoutes';
import { validationRoutes } from './routes/validationRoutes';
import { complianceRoutes } from './routes/complianceRoutes';
import { statusRoutes } from './routes/statusRoutes';

class ICAValidationService {
  private app: express.Application = express();
  private server: any;
  private port: number;

  constructor() {
    this.port = parseInt(process.env.PORT || '3020', 10);
    this.initializeMiddleware();
    this.setupRoutes();
    this.startServer();
  }

  private initializeMiddleware() {
    this.app = express();

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
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-API-Key'],
    }));

    // Compression
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private setupRoutes() {
    // Public routes
    this.app.use('/api/v1/status', statusRoutes);

    // Protected routes
    this.app.use('/api/v1/ica', authMiddleware, icaRoutes);
    this.app.use('/api/v1/validation', authMiddleware, validationRoutes);
    this.app.use('/api/v1/compliance', authMiddleware, complianceRoutes);

    // Error handling
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private startServer() {
    this.server = createServer(this.app);

    this.server.listen(this.port, () => {
      logger.info(`🚀 ICA Validation Service running on port ${this.port}`);
      logger.info(`📊 Status: http://localhost:${this.port}/api/v1/status`);
      logger.info(`🔗 ICA API: http://localhost:${this.port}/api/v1/ica`);
      logger.info(`✅ Validation: http://localhost:${this.port}/api/v1/validation`);
      logger.info(`📋 Compliance: http://localhost:${this.port}/api/v1/compliance`);
      logger.info(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());
  }

  private gracefulShutdown() {
    logger.info('Received shutdown signal, gracefully shutting down...');

    this.server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  }
}

// Start the service
const icaService = new ICAValidationService();

// Export for testing
export default icaService;

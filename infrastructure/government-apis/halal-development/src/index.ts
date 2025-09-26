import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { authMiddleware } from './middleware/authMiddleware';

// Import routes
import { statusRoutes } from './routes/statusRoutes';
import { halalDevRoutes } from './routes/halalDevRoutes';
import { complianceRoutes } from './routes/complianceRoutes';
import { auditRoutes } from './routes/auditRoutes';

// Import logger
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

class HalalDevelopmentService {
  public app!: express.Application;
  private server: any;
  private io!: Server;
  private port: number;

  constructor() {
    this.port = parseInt(process.env.PORT || '3019', 10);
    this.initializeApp();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
    this.initializeServer();
  }

  private initializeApp(): void {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      },
    });
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    }));

    // Compression
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // limit each IP to 1000 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'HALAL DEVELOPMENT Integration Service is healthy',
        timestamp: new Date().toISOString(),
        service: 'halal-development-integration',
        version: '1.0.0'
      });
    });

    // API routes
    this.app.use('/api/v1/status', statusRoutes);
    this.app.use('/api/v1/halal-dev', authMiddleware, halalDevRoutes);
    this.app.use('/api/v1/compliance', authMiddleware, complianceRoutes);
    this.app.use('/api/v1/audit', authMiddleware, auditRoutes);

    // WebSocket connection handling
    this.io.on('connection', (socket: any) => {
      logger.info(`Client connected: ${socket.id}`);

      socket.on('subscribe-compliance', (data: any) => {
        socket.join('compliance-updates');
        logger.info(`Client ${socket.id} subscribed to compliance updates`);
      });

      socket.on('unsubscribe-compliance', () => {
        socket.leave('compliance-updates');
        logger.info(`Client ${socket.id} unsubscribed from compliance updates`);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private initializeServer(): void {
    this.server.listen(this.port, () => {
      logger.info(`🚀 HALAL DEVELOPMENT Integration Service started successfully!`);
      logger.info(`📡 Server running on port ${this.port}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      logger.info(`📊 HALAL DEV API URL: ${process.env.HALAL_DEV_API_URL || 'https://api.halaldevelopment.gov.my'}`);
      logger.info(`🔐 Auth enabled: ${process.env.AUTH_ENABLED === 'true' ? 'Yes' : 'No'}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
  }

  private gracefulShutdown(signal: string): void {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    this.server.close((err: any) => {
      if (err) {
        logger.error('Error during server shutdown:', err);
        process.exit(1);
      }

      logger.info('Server closed successfully');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  }

  public getServer(): any {
    return this.server;
  }

  public getIO(): Server {
    return this.io;
  }
}

// Start the service
const halalDevService = new HalalDevelopmentService();

export default halalDevService;

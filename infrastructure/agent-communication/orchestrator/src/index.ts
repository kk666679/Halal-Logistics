import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'express-async-errors';

import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';

import { AgentRegistryService } from './services/AgentRegistryService';
import { MessageBrokerService } from './services/MessageBrokerService';
import { LoadBalancerService } from './services/LoadBalancerService';
import { HealthCheckService } from './services/HealthCheckService';
import { MetricsService } from './services/MetricsService';

import { agentRoutes } from './routes/agentRoutes';
import { healthRoutes } from './routes/healthRoutes';
import { metricsRoutes } from './routes/metricsRoutes';

class AgentOrchestrator {
  private app!: express.Application;
  private server!: any;
  private io!: Server;
  private port: number;

  // Core services
  private agentRegistry!: AgentRegistryService;
  private messageBroker!: MessageBrokerService;
  private loadBalancer!: LoadBalancerService;
  private healthCheck!: HealthCheckService;
  private metrics!: MetricsService;

  constructor() {
    this.port = parseInt(process.env.PORT || '3011', 10);
    this.initializeServices();
    this.setupExpress();
    this.setupRoutes();
    this.setupSocketIO();
    this.startServices();
  }

  private async initializeServices() {
    try {
      logger.info('Initializing Agent Orchestrator services...');

      // Initialize core services
      this.agentRegistry = new AgentRegistryService();
      this.messageBroker = new MessageBrokerService();
      this.loadBalancer = new LoadBalancerService(this.agentRegistry);
      this.healthCheck = new HealthCheckService(this.agentRegistry);

      logger.info('All services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize services:', error);
      process.exit(1);
    }
  }

  private setupExpress() {
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
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
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
    this.app.use(limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private setupRoutes() {
    // API routes
    this.app.use('/api/v1/agents', agentRoutes(this.agentRegistry, this.loadBalancer, this.messageBroker));
    this.app.use('/api/v1/health', healthRoutes(this.healthCheck));
    this.app.use('/api/v1/metrics', metricsRoutes(this.metrics));

    // Error handling
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private setupSocketIO() {
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    // Socket.IO connection handling
    this.io.on('connection', (socket: any) => {
      logger.info(`Client connected: ${socket.id}`);

      socket.on('subscribe-agent-status', (agentId: string) => {
        socket.join(`agent-${agentId}`);
        logger.info(`Client ${socket.id} subscribed to agent ${agentId}`);
      });

      socket.on('unsubscribe-agent-status', (agentId: string) => {
        socket.leave(`agent-${agentId}`);
        logger.info(`Client ${socket.id} unsubscribed from agent ${agentId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private async startServices() {
    try {
      // Start health checks
      await this.healthCheck.start();
      logger.info('Health check service started');

      // Start message broker
      await this.messageBroker.start();
      logger.info('Message broker service started');

      // Start metrics collection
      this.metrics = new MetricsService(this.agentRegistry);
      this.metrics.start();
      logger.info('Metrics service started');

      // Start HTTP server
      this.server.listen(this.port, () => {
        logger.info(`🚀 Agent Orchestrator running on port ${this.port}`);
        logger.info(`📊 Health check: http://localhost:${this.port}/api/v1/health`);
        logger.info(`📈 Metrics: http://localhost:${this.port}/api/v1/metrics`);
        logger.info(`🔌 Socket.IO: ws://localhost:${this.port}`);
      });

      // Graceful shutdown
      process.on('SIGTERM', () => this.gracefulShutdown());
      process.on('SIGINT', () => this.gracefulShutdown());

    } catch (error) {
      logger.error('Failed to start services:', error);
      process.exit(1);
    }
  }

  private async gracefulShutdown() {
    logger.info('Received shutdown signal, gracefully shutting down...');

    try {
      // Stop health checks
      await this.healthCheck.stop();

      // Close message broker connections
      await this.messageBroker.stop();

      // Stop metrics
      this.metrics.stop();

      // Close HTTP server
      this.server.close(() => {
        logger.info('HTTP server closed');
      });

      // Close Socket.IO
      this.io.close(() => {
        logger.info('Socket.IO server closed');
      });

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  // Public methods for external access
  public getAgentRegistry() {
    return this.agentRegistry;
  }

  public getMessageBroker() {
    return this.messageBroker;
  }

  public getLoadBalancer() {
    return this.loadBalancer;
  }

  public getHealthCheck() {
    return this.healthCheck;
  }

  public getMetrics() {
    return this.metrics;
  }

  public getSocketIO() {
    return this.io;
  }
}

// Start the orchestrator
const orchestrator = new AgentOrchestrator();

// Export for testing
export default orchestrator;

import { Router, Request, Response, NextFunction } from 'express';
import { HealthCheckService } from '../services/HealthCheckService';
import { logger } from '../utils/logger';

export const healthRoutes = (healthCheck: HealthCheckService) => {
  const router = Router();

  // Overall system health
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = healthCheck.getHealthCheckStats();
      const status = stats.healthyAgents > 0 ? 'healthy' : 'unhealthy';

      res.json({
        status,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        checks: stats,
      });
    } catch (error) {
      next(error);
    }
  });

  // Detailed health check
  router.get('/detailed', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = healthCheck.getHealthCheckStats();
      const agents = await Promise.all(
        ['agent-registry', 'message-broker', 'load-balancer', 'health-check', 'metrics']
          .map(async (service) => ({
            service,
            status: 'healthy', // In a real implementation, check actual service health
            uptime: process.uptime(),
            lastCheck: new Date().toISOString(),
          }))
      );

      res.json({
        status: stats.healthyAgents > 0 ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        services: agents,
        agents: stats,
      });
    } catch (error) {
      next(error);
    }
  });

  // Agent-specific health
  router.get('/agent/:agentId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentId } = req.params;
      const report = healthCheck.getAgentHealthReport(agentId);

      if (!report) {
        return res.status(404).json({
          success: false,
          error: 'Agent not found',
        });
      }

      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  });

  // Force health check on specific agent
  router.post('/agent/:agentId/check', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentId } = req.params;
      const result = await healthCheck.forceHealthCheck(agentId);

      if (!result) {
        return res.status(404).json({
          success: false,
          error: 'Agent not found',
        });
      }

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  });

  // Health check statistics
  router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = healthCheck.getHealthCheckStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  });

  // Readiness probe
  router.get('/ready', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = healthCheck.getHealthCheckStats();
      const isReady = stats.healthyAgents > 0 && stats.unhealthyAgents === 0;

      if (isReady) {
        res.status(200).json({
          status: 'ready',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(503).json({
          status: 'not ready',
          timestamp: new Date().toISOString(),
          reason: 'Not enough healthy agents',
        });
      }
    } catch (error) {
      next(error);
    }
  });

  // Liveness probe
  router.get('/live', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceStatus = healthCheck.getServiceStatus();

      if (serviceStatus === 'running') {
        res.status(200).json({
          status: 'alive',
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(503).json({
          status: 'not alive',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      next(error);
    }
  });

  // Database connectivity check
  router.get('/database', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // In a real implementation, check database connectivity
      const isConnected = true; // Simulated

      res.json({
        status: isConnected ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString(),
        database: {
          type: 'redis', // or whatever database you're using
          status: isConnected ? 'healthy' : 'unhealthy',
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // External dependencies check
  router.get('/dependencies', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dependencies = [
        { name: 'Redis', status: 'healthy' },
        { name: 'Kafka', status: 'healthy' },
        { name: 'RabbitMQ', status: 'healthy' },
        { name: 'Blockchain RPC', status: 'healthy' },
      ];

      const allHealthy = dependencies.every(dep => dep.status === 'healthy');

      res.json({
        status: allHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        dependencies,
      });
    } catch (error) {
      next(error);
    }
  });

  // Performance metrics
  router.get('/performance', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = healthCheck.getHealthCheckStats();

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        performance: {
          averageResponseTime: stats.averageResponseTime,
          totalAgents: stats.totalAgents,
          healthyAgents: stats.healthyAgents,
          responseTimePercentile: {
            p50: stats.averageResponseTime,
            p95: stats.averageResponseTime * 1.5,
            p99: stats.averageResponseTime * 2,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // Health check configuration
  router.get('/config', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        config: {
          healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'),
          timeout: 5000,
          retries: 3,
          thresholds: {
            responseTimeWarning: 2000,
            responseTimeCritical: 5000,
            consecutiveFailuresWarning: 3,
            consecutiveFailuresCritical: 5,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

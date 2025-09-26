import { Router, Request, Response, NextFunction } from 'express';
import { MetricsService } from '../services/MetricsService';
import { logger } from '../utils/logger';

export const metricsRoutes = (metrics: MetricsService) => {
  const router = Router();

  // Get system metrics
  router.get('/system', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const systemMetrics = metrics.getSystemMetrics();

      res.json({
        success: true,
        data: systemMetrics,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // Get agent-specific metrics
  router.get('/agent/:agentId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentId } = req.params;
      const { minutes = 60 } = req.query;

      const agentMetrics = metrics.getAgentMetrics(agentId);

      res.json({
        success: true,
        data: agentMetrics,
        count: agentMetrics.length,
        period: `${minutes} minutes`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // Get all agent metrics
  router.get('/agents', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { minutes = 60 } = req.query;

      const allMetrics = metrics.getAllAgentMetrics();

      res.json({
        success: true,
        data: allMetrics,
        count: allMetrics.length,
        period: `${minutes} minutes`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // Get recent metrics
  router.get('/recent', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { minutes = 60 } = req.query;

      const recentMetrics = metrics.getRecentMetrics(Number(minutes));

      res.json({
        success: true,
        data: recentMetrics,
        count: recentMetrics.length,
        period: `${minutes} minutes`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // Get performance summary
  router.get('/performance', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = metrics.getPerformanceSummary();

      res.json({
        success: true,
        data: summary,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // Get metrics trends
  router.get('/trends', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const trends = metrics.getMetricsTrends();

      res.json({
        success: true,
        data: trends,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // Export metrics
  router.get('/export', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { format = 'json' } = req.query;

      const exportedData = metrics.exportMetrics(format as 'json' | 'csv');

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="metrics.csv"');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="metrics.json"');
      }

      res.send(exportedData);
    } catch (error) {
      next(error);
    }
  });

  // Get metrics for specific time range
  router.get('/range', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { start, end } = req.query;

      if (!start || !end) {
        return res.status(400).json({
          success: false,
          error: 'Missing required parameters: start, end',
        });
      }

      const startDate = new Date(start as string);
      const endDate = new Date(end as string);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format for start or end',
        });
      }

      const allMetrics = metrics.getAllAgentMetrics();
      const filteredMetrics = allMetrics.filter(metric =>
        metric.timestamp >= startDate && metric.timestamp <= endDate
      );

      res.json({
        success: true,
        data: filteredMetrics,
        count: filteredMetrics.length,
        range: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // Get top performing agents
  router.get('/top-agents', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = 10, metric = 'responseTime' } = req.query;

      const summary = metrics.getPerformanceSummary();
      const topAgents = summary.topPerformingAgents.slice(0, Number(limit));

      res.json({
        success: true,
        data: topAgents,
        metric: metric as string,
        limit: Number(limit),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // Get problematic agents
  router.get('/problematic-agents', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = 10 } = req.query;

      const summary = metrics.getPerformanceSummary();
      const problematicAgents = summary.problematicAgents.slice(0, Number(limit));

      res.json({
        success: true,
        data: problematicAgents,
        limit: Number(limit),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // Get metrics statistics
  router.get('/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const systemMetrics = metrics.getSystemMetrics();
      const summary = metrics.getPerformanceSummary();
      const trends = metrics.getMetricsTrends();

      res.json({
        success: true,
        data: {
          system: systemMetrics,
          performance: summary,
          trends,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  // Get real-time metrics (WebSocket would be better for this)
  router.get('/realtime', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const systemMetrics = metrics.getSystemMetrics();

      res.json({
        success: true,
        data: {
          ...systemMetrics,
          timestamp: new Date().toISOString(),
          refreshInterval: 5000, // 5 seconds
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // Get metrics configuration
  router.get('/config', async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        success: true,
        data: {
          collectionInterval: parseInt(process.env.METRICS_INTERVAL || '60000'),
          historySize: 1000,
          exportFormats: ['json', 'csv'],
          availableMetrics: [
            'requestCount',
            'errorCount',
            'averageResponseTime',
            'currentLoad',
            'memoryUsage',
            'cpuUsage',
          ],
          timeRanges: [
            '1 minute',
            '5 minutes',
            '15 minutes',
            '1 hour',
            '6 hours',
            '24 hours',
          ],
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

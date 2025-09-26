import { Router, Request, Response, NextFunction } from 'express';
import { AgentRegistryService } from '../services/AgentRegistryService';
import { LoadBalancerService } from '../services/LoadBalancerService';
import { MessageBrokerService } from '../services/MessageBrokerService';
import { AgentRequest, AgentResponse, RequestRoutingResult } from '../types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export const agentRoutes = (
  agentRegistry: AgentRegistryService,
  loadBalancer: LoadBalancerService,
  messageBroker: MessageBrokerService
) => {
  const router = Router();

  // Register a new agent
  router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentInfo, registrationToken } = req.body;

      if (!agentInfo || !agentInfo.name || !agentInfo.type) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, type',
        });
      }

      // Validate registration token if provided
      if (registrationToken) {
        const agentId = agentRegistry.validateRegistrationToken(registrationToken);
        if (!agentId) {
          return res.status(401).json({
            success: false,
            error: 'Invalid registration token',
          });
        }
        agentInfo.id = agentId;
      }

      const result = await agentRegistry.registerAgent({ agentInfo });

      if (result.success) {
        logger.info(`Agent registered: ${agentInfo.name} (${result.agentId})`);
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      next(error);
    }
  });

  // Unregister an agent
  router.delete('/:agentId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentId } = req.params;

      const success = await agentRegistry.unregisterAgent(agentId);

      if (success) {
        logger.info(`Agent unregistered: ${agentId}`);
        res.json({ success: true });
      } else {
        res.status(404).json({
          success: false,
          error: 'Agent not found',
        });
      }
    } catch (error) {
      next(error);
    }
  });

  // Get all agents
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, status, capability } = req.query;

      let agents = agentRegistry.getAllAgents();

      // Filter by type
      if (type) {
        agents = agents.filter(agent => agent.type === type);
      }

      // Filter by status
      if (status) {
        agents = agents.filter(agent => agent.status.state === status);
      }

      // Filter by capability
      if (capability) {
        agents = agents.filter(agent => agent.capabilities.includes(capability as string));
      }

      res.json({
        success: true,
        data: agents,
        count: agents.length,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get specific agent
  router.get('/:agentId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentId } = req.params;
      const agent = agentRegistry.getAgent(agentId);

      if (!agent) {
        return res.status(404).json({
          success: false,
          error: 'Agent not found',
        });
      }

      res.json({
        success: true,
        data: agent,
      });
    } catch (error) {
      next(error);
    }
  });

  // Update agent status
  router.put('/:agentId/status', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentId } = req.params;
      const statusUpdate = req.body;

      const success = agentRegistry.updateAgentStatus(agentId, statusUpdate);

      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({
          success: false,
          error: 'Agent not found',
        });
      }
    } catch (error) {
      next(error);
    }
  });

  // Route request to agent
  router.post('/request', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, payload, priority = 1, timeout = 30000, metadata } = req.body;

      if (!type || !payload) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: type, payload',
        });
      }

      // Create agent request
      const agentRequest: AgentRequest = {
        id: uuidv4(),
        agentId: '', // Will be set by load balancer
        type,
        priority,
        payload,
        metadata,
        timestamp: new Date(),
        timeout,
        retryCount: 0,
        maxRetries: 3,
      };

      // Route to appropriate agent
      const routingResult: RequestRoutingResult = await loadBalancer.routeRequest(agentRequest);

      // Update request with selected agent
      agentRequest.agentId = routingResult.agentId;

      // Send request to agent
      const response: AgentResponse = await messageBroker.sendRequest(
        routingResult.agentId,
        agentRequest
      );

      res.json({
        success: true,
        data: {
          requestId: agentRequest.id,
          agentId: routingResult.agentId,
          endpoint: routingResult.endpoint,
          response,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // Get agent statistics
  router.get('/:agentId/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentId } = req.params;
      const stats = agentRegistry.getAgentStats(agentId);

      if (!stats) {
        return res.status(404).json({
          success: false,
          error: 'Agent not found',
        });
      }

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get system overview
  router.get('/system/overview', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const overview = agentRegistry.getSystemOverview();

      res.json({
        success: true,
        data: overview,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get load balancer statistics
  router.get('/loadbalancer/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = loadBalancer.getLoadBalancerStats();
      const performance = loadBalancer.getAgentPerformanceMetrics();

      res.json({
        success: true,
        data: {
          ...stats,
          agentPerformance: performance,
        },
      });
    } catch (error) {
      next(error);
    }
  });

  // Update load balancer configuration
  router.put('/loadbalancer/config', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const config = req.body;
      loadBalancer.updateConfig(config);

      res.json({
        success: true,
        message: 'Load balancer configuration updated',
      });
    } catch (error) {
      next(error);
    }
  });

  // Get message broker statistics
  router.get('/messagebroker/stats', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await messageBroker.getMessageStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  });

  // Publish event
  router.post('/events', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topic, event } = req.body;

      if (!topic || !event) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: topic, event',
        });
      }

      await messageBroker.publishEvent(topic, event);

      res.json({
        success: true,
        message: 'Event published successfully',
      });
    } catch (error) {
      next(error);
    }
  });

  // Subscribe to events
  router.post('/events/subscribe', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topic, handler } = req.body;

      if (!topic || !handler) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: topic, handler',
        });
      }

      await messageBroker.subscribe(topic, handler);

      res.json({
        success: true,
        message: `Subscribed to topic: ${topic}`,
      });
    } catch (error) {
      next(error);
    }
  });

  // Get agent health check history
  router.get('/:agentId/health', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { agentId } = req.params;
      const history = agentRegistry.getHealthCheckHistory(agentId);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

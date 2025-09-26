import axios from 'axios';
import { AgentInfo, HealthCheck } from '../types';
import { AgentRegistryService } from './AgentRegistryService';
import { logger } from '../utils/logger';

export class HealthCheckService {
  private agentRegistry: AgentRegistryService;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(agentRegistry: AgentRegistryService) {
    this.agentRegistry = agentRegistry;
  }

  /**
   * Start health check service
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Health check service is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting health check service');

    // Run initial health check
    await this.performHealthChecks();

    // Set up periodic health checks
    const interval = parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'); // 30 seconds default
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, interval);

    logger.info(`Health check service started with ${interval}ms interval`);
  }

  /**
   * Stop health check service
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    logger.info('Health check service stopped');
  }

  /**
   * Perform health checks on all registered agents
   */
  async performHealthChecks(): Promise<void> {
    const agents = this.agentRegistry.getAllAgents();

    logger.debug(`Performing health checks on ${agents.length} agents`);

    const healthCheckPromises = agents.map(agent => this.checkAgentHealth(agent));

    await Promise.allSettled(healthCheckPromises);
  }

  /**
   * Check health of a specific agent
   */
  async checkAgentHealth(agent: AgentInfo): Promise<void> {
    const startTime = Date.now();

    try {
      const healthCheck = await this.performSingleHealthCheck(agent);
      const responseTime = Date.now() - startTime;

      // Record the health check result
      this.agentRegistry.recordHealthCheck(agent.id, {
        ...healthCheck,
        responseTime,
      });

      // Update agent status based on health check
      if (healthCheck.status === 'healthy') {
        this.agentRegistry.updateAgentStatus(agent.id, {
          state: 'online',
          load: Math.min(100, agent.status.load + 1), // Increment load slightly
        });
      } else {
        this.agentRegistry.updateAgentStatus(agent.id, {
          state: 'error',
          errorCount: agent.status.errorCount + 1,
        });
      }

      logger.debug(`Health check completed for ${agent.name}: ${healthCheck.status} (${responseTime}ms)`);
    } catch (error) {
      const responseTime = Date.now() - startTime;

      // Record failed health check
      this.agentRegistry.recordHealthCheck(agent.id, {
        agentId: agent.id,
        status: 'unhealthy',
        responseTime,
        lastCheck: new Date(),
        consecutiveFailures: (agent.status.errorCount || 0) + 1,
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      });

      this.agentRegistry.updateAgentStatus(agent.id, {
        state: 'error',
        errorCount: agent.status.errorCount + 1,
      });

      logger.warn(`Health check failed for ${agent.name}:`, error);
    }
  }

  /**
   * Perform a single health check on an agent
   */
  private async performSingleHealthCheck(agent: AgentInfo): Promise<Omit<HealthCheck, 'responseTime'>> {
    // Check if agent has health endpoint
    if (!agent.endpoints.health) {
      return {
        agentId: agent.id,
        status: 'unhealthy',
        lastCheck: new Date(),
        consecutiveFailures: 1,
        details: { error: 'No health endpoint configured' },
      };
    }

    try {
      const response = await axios.get(agent.endpoints.health, {
        timeout: 5000, // 5 second timeout
        headers: {
          'User-Agent': 'HalalChain-Orchestrator/1.0',
          'Content-Type': 'application/json',
        },
      });

      // Check response status and content
      if (response.status === 200) {
        const healthData = response.data;

        // Basic health check validation
        if (this.isHealthyResponse(healthData)) {
          return {
            agentId: agent.id,
            status: 'healthy',
            lastCheck: new Date(),
            consecutiveFailures: 0,
            details: {
              statusCode: response.status,
              responseTime: response.headers['x-response-time'] || 'unknown',
              version: healthData.version || 'unknown',
              uptime: healthData.uptime || 'unknown',
            },
          };
        } else {
          return {
            agentId: agent.id,
            status: 'degraded',
            lastCheck: new Date(),
            consecutiveFailures: 1,
            details: {
              statusCode: response.status,
              error: 'Health check returned unhealthy status',
              healthData,
            },
          };
        }
      } else {
        return {
          agentId: agent.id,
          status: 'unhealthy',
          lastCheck: new Date(),
          consecutiveFailures: 1,
          details: {
            statusCode: response.status,
            error: `HTTP ${response.status}: ${response.statusText}`,
          },
        };
      }
    } catch (error) {
      let errorMessage = 'Unknown error';
      let consecutiveFailures = 1;

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          errorMessage = 'Connection refused';
        } else if (error.code === 'ETIMEDOUT') {
          errorMessage = 'Connection timeout';
        } else if (error.response) {
          errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        agentId: agent.id,
        status: 'unhealthy',
        lastCheck: new Date(),
        consecutiveFailures,
        details: { error: errorMessage },
      };
    }
  }

  /**
   * Validate if health check response indicates healthy status
   */
  private isHealthyResponse(healthData: any): boolean {
    // Check for explicit status field
    if (healthData.status) {
      return healthData.status === 'healthy' ||
             healthData.status === 'ok' ||
             healthData.status === 'up';
    }

    // Check for common health check response patterns
    if (healthData.healthy !== undefined) {
      return healthData.healthy === true;
    }

    if (healthData.ok !== undefined) {
      return healthData.ok === true;
    }

    // If no explicit status, assume healthy if we got a 200 response
    return true;
  }

  /**
   * Get health check statistics
   */
  getHealthCheckStats(): {
    totalAgents: number;
    healthyAgents: number;
    unhealthyAgents: number;
    degradedAgents: number;
    averageResponseTime: number;
    recentFailures: number;
  } {
    const agents = this.agentRegistry.getAllAgents();
    const healthHistory = agents.flatMap(agent =>
      this.agentRegistry.getHealthCheckHistory(agent.id)
    );

    const healthyAgents = agents.filter(agent => agent.status.state === 'online').length;
    const unhealthyAgents = agents.filter(agent => agent.status.state === 'error').length;
    const degradedAgents = agents.filter(agent => agent.status.state === 'busy').length;

    const averageResponseTime = healthHistory.length > 0
      ? healthHistory.reduce((sum, check) => sum + check.responseTime, 0) / healthHistory.length
      : 0;

    const recentFailures = healthHistory.filter(check =>
      check.status === 'unhealthy' &&
      Date.now() - check.lastCheck.getTime() < 60000 // Last minute
    ).length;

    return {
      totalAgents: agents.length,
      healthyAgents,
      unhealthyAgents,
      degradedAgents,
      averageResponseTime,
      recentFailures,
    };
  }

  /**
   * Get detailed health report for an agent
   */
  getAgentHealthReport(agentId: string): {
    agent: AgentInfo;
    healthHistory: HealthCheck[];
    status: 'healthy' | 'unhealthy' | 'degraded';
    recommendations: string[];
  } | null {
    const agent = this.agentRegistry.getAgent(agentId);
    if (!agent) {
      return null;
    }

    const healthHistory = this.agentRegistry.getHealthCheckHistory(agentId);
    const recentChecks = healthHistory.slice(-10); // Last 10 checks

    let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
    const recommendations: string[] = [];

    if (recentChecks.length === 0) {
      status = 'unhealthy';
      recommendations.push('No health check history available');
    } else {
      const failureRate = recentChecks.filter(check => check.status === 'unhealthy').length / recentChecks.length;

      if (failureRate > 0.5) {
        status = 'unhealthy';
        recommendations.push('High failure rate detected');
      } else if (failureRate > 0.2) {
        status = 'degraded';
        recommendations.push('Moderate failure rate detected');
      }

      const avgResponseTime = recentChecks.reduce((sum, check) => sum + check.responseTime, 0) / recentChecks.length;
      if (avgResponseTime > 5000) {
        recommendations.push('High response time detected');
      }
    }

    return {
      agent,
      healthHistory: recentChecks,
      status,
      recommendations,
    };
  }

  /**
   * Force health check on specific agent
   */
  async forceHealthCheck(agentId: string): Promise<HealthCheck | null> {
    const agent = this.agentRegistry.getAgent(agentId);
    if (!agent) {
      return null;
    }

    logger.info(`Forcing health check on agent ${agent.name}`);
    await this.checkAgentHealth(agent);

    const healthHistory = this.agentRegistry.getHealthCheckHistory(agentId);
    return healthHistory[healthHistory.length - 1] || null;
  }

  /**
   * Get service status
   */
  getServiceStatus(): 'running' | 'stopped' {
    return this.isRunning ? 'running' : 'stopped';
  }
}

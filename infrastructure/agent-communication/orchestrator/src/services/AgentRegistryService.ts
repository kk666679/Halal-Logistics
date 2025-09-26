import { AgentInfo, AgentStatus, HealthCheck, AgentRegistrationRequest, AgentRegistrationResponse } from '../types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class AgentRegistryService {
  private agents: Map<string, AgentInfo> = new Map();
  private healthChecks: Map<string, HealthCheck[]> = new Map();

  /**
   * Register a new agent with the orchestrator
   */
  async registerAgent(request: AgentRegistrationRequest): Promise<AgentRegistrationResponse> {
    try {
      const agentId = request.agentInfo.id || uuidv4();

      // Check if agent already exists
      if (this.agents.has(agentId)) {
        return {
          success: false,
          error: 'Agent already registered with this ID',
        };
      }

      // Create agent info
      const agentInfo: AgentInfo = {
        ...request.agentInfo,
        id: agentId,
        status: {
          state: 'offline',
          load: 0,
          activeRequests: 0,
          totalRequests: 0,
          errorCount: 0,
          uptime: 0,
        },
        lastHealthCheck: new Date(),
      };

      // Store agent
      this.agents.set(agentId, agentInfo);

      // Initialize health check history
      this.healthChecks.set(agentId, []);

      logger.info(`Agent registered: ${agentInfo.name} (${agentId})`, {
        type: agentInfo.type,
        capabilities: agentInfo.capabilities,
        endpoints: agentInfo.endpoints,
      });

      return {
        success: true,
        agentId,
        token: this.generateRegistrationToken(agentId),
      };
    } catch (error) {
      logger.error('Failed to register agent:', error);
      return {
        success: false,
        error: 'Registration failed due to internal error',
      };
    }
  }

  /**
   * Unregister an agent
   */
  async unregisterAgent(agentId: string): Promise<boolean> {
    try {
      const agent = this.agents.get(agentId);
      if (!agent) {
        return false;
      }

      this.agents.delete(agentId);
      this.healthChecks.delete(agentId);

      logger.info(`Agent unregistered: ${agent.name} (${agentId})`);
      return true;
    } catch (error) {
      logger.error(`Failed to unregister agent ${agentId}:`, error);
      return false;
    }
  }

  /**
   * Update agent status
   */
  updateAgentStatus(agentId: string, status: Partial<AgentStatus>): boolean {
    try {
      const agent = this.agents.get(agentId);
      if (!agent) {
        return false;
      }

      agent.status = { ...agent.status, ...status };
      agent.lastHealthCheck = new Date();

      logger.debug(`Updated status for agent ${agentId}:`, status);
      return true;
    } catch (error) {
      logger.error(`Failed to update status for agent ${agentId}:`, error);
      return false;
    }
  }

  /**
   * Record health check result
   */
  recordHealthCheck(agentId: string, healthCheck: HealthCheck): void {
    try {
      const agent = this.agents.get(agentId);
      if (!agent) {
        return;
      }

      // Update agent status based on health check
      agent.status.state = healthCheck.status === 'healthy' ? 'online' : 'error';
      agent.lastHealthCheck = new Date();

      // Store health check history (keep last 100 checks)
      const history = this.healthChecks.get(agentId) || [];
      history.push(healthCheck);

      if (history.length > 100) {
        history.shift();
      }

      this.healthChecks.set(agentId, history);

      logger.debug(`Health check recorded for agent ${agentId}: ${healthCheck.status}`);
    } catch (error) {
      logger.error(`Failed to record health check for agent ${agentId}:`, error);
    }
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): AgentInfo | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all agents
   */
  getAllAgents(): AgentInfo[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agents by type
   */
  getAgentsByType(type: string): AgentInfo[] {
    return Array.from(this.agents.values()).filter(agent => agent.type === type);
  }

  /**
   * Get agents by capability
   */
  getAgentsByCapability(capability: string): AgentInfo[] {
    return Array.from(this.agents.values()).filter(agent =>
      agent.capabilities.includes(capability)
    );
  }

  /**
   * Get online agents
   */
  getOnlineAgents(): AgentInfo[] {
    return Array.from(this.agents.values()).filter(agent =>
      agent.status.state === 'online'
    );
  }

  /**
   * Get agent health check history
   */
  getHealthCheckHistory(agentId: string): HealthCheck[] {
    return this.healthChecks.get(agentId) || [];
  }

  /**
   * Get agent statistics
   */
  getAgentStats(agentId: string): {
    agent: AgentInfo;
    healthHistory: HealthCheck[];
    averageResponseTime: number;
    uptime: number;
  } | null {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return null;
    }

    const healthHistory = this.getHealthCheckHistory(agentId);
    const averageResponseTime = healthHistory.length > 0
      ? healthHistory.reduce((sum, check) => sum + check.responseTime, 0) / healthHistory.length
      : 0;

    return {
      agent,
      healthHistory,
      averageResponseTime,
      uptime: agent.status.uptime,
    };
  }

  /**
   * Get system overview
   */
  getSystemOverview(): {
    totalAgents: number;
    onlineAgents: number;
    offlineAgents: number;
    busyAgents: number;
    errorAgents: number;
    agentsByType: Record<string, number>;
    agentsByCapability: Record<string, number>;
  } {
    const agents = this.getAllAgents();
    const onlineAgents = this.getOnlineAgents();

    const agentsByType: Record<string, number> = {};
    const agentsByCapability: Record<string, number> = {};

    agents.forEach(agent => {
      // Count by type
      agentsByType[agent.type] = (agentsByType[agent.type] || 0) + 1;

      // Count by capability
      agent.capabilities.forEach(capability => {
        agentsByCapability[capability] = (agentsByCapability[capability] || 0) + 1;
      });
    });

    return {
      totalAgents: agents.length,
      onlineAgents: onlineAgents.length,
      offlineAgents: agents.length - onlineAgents.length,
      busyAgents: agents.filter(a => a.status.state === 'busy').length,
      errorAgents: agents.filter(a => a.status.state === 'error').length,
      agentsByType,
      agentsByCapability,
    };
  }

  /**
   * Check if agent is available for requests
   */
  isAgentAvailable(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return false;
    }

    return (
      agent.status.state === 'online' &&
      agent.status.load < 80 && // Less than 80% load
      agent.status.activeRequests < agent.maxConcurrency
    );
  }

  /**
   * Get available agents for a specific capability
   */
  getAvailableAgentsForCapability(capability: string): AgentInfo[] {
    return this.getAgentsByCapability(capability).filter(agent =>
      this.isAgentAvailable(agent.id)
    );
  }

  /**
   * Generate registration token
   */
  private generateRegistrationToken(agentId: string): string {
    // In production, use a proper JWT or secure token generation
    return Buffer.from(`${agentId}:${Date.now()}:${process.env.ORCHESTRATOR_SECRET || 'default-secret'}`)
      .toString('base64');
  }

  /**
   * Validate registration token
   */
  validateRegistrationToken(token: string): string | null {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [agentId, timestamp, secret] = decoded.split(':');

      // Check if token is older than 24 hours
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      if (now - tokenTime > 24 * 60 * 60 * 1000) {
        return null;
      }

      // Verify secret
      if (secret !== (process.env.ORCHESTRATOR_SECRET || 'default-secret')) {
        return null;
      }

      return agentId;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear all agents (for testing or reset)
   */
  clearAllAgents(): void {
    this.agents.clear();
    this.healthChecks.clear();
    logger.info('All agents cleared from registry');
  }
}

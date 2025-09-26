import { AgentInfo, AgentRequest, RequestRoutingResult, LoadBalancerConfig } from '../types';
import { AgentRegistryService } from './AgentRegistryService';
import { logger } from '../utils/logger';

export class LoadBalancerService {
  private config: LoadBalancerConfig;
  private agentRegistry: AgentRegistryService;
  private roundRobinIndex: Map<string, number> = new Map();

  constructor(agentRegistry: AgentRegistryService) {
    this.agentRegistry = agentRegistry;
    this.config = {
      algorithm: 'round-robin',
      healthCheckInterval: 30000, // 30 seconds
      failoverThreshold: 3,
      maxRetries: 3,
      timeout: 30000,
    };

    // Override with environment variables
    if (process.env.LOAD_BALANCER_ALGORITHM) {
      this.config.algorithm = process.env.LOAD_BALANCER_ALGORITHM as any;
    }
    if (process.env.HEALTH_CHECK_INTERVAL) {
      this.config.healthCheckInterval = parseInt(process.env.HEALTH_CHECK_INTERVAL);
    }
    if (process.env.FAILOVER_THRESHOLD) {
      this.config.failoverThreshold = parseInt(process.env.FAILOVER_THRESHOLD);
    }
    if (process.env.MAX_RETRIES) {
      this.config.maxRetries = parseInt(process.env.MAX_RETRIES);
    }
    if (process.env.AGENT_TIMEOUT) {
      this.config.timeout = parseInt(process.env.AGENT_TIMEOUT);
    }
  }

  /**
   * Route request to appropriate agent
   */
  async routeRequest(request: AgentRequest): Promise<RequestRoutingResult> {
    const availableAgents = this.getAvailableAgentsForRequest(request);

    if (availableAgents.length === 0) {
      throw new Error('No available agents for request');
    }

    const selectedAgent = this.selectAgent(availableAgents, request);
    const estimatedWaitTime = this.calculateEstimatedWaitTime(selectedAgent);

    return {
      agentId: selectedAgent.id,
      endpoint: selectedAgent.endpoints.api,
      estimatedWaitTime,
      priority: request.priority,
    };
  }

  /**
   * Get available agents for a specific request
   */
  private getAvailableAgentsForRequest(request: AgentRequest): AgentInfo[] {
    // Get agents by capability
    let availableAgents: AgentInfo[] = [];

    if (request.metadata && request.metadata.requiredCapabilities) {
      const capabilities = Array.isArray(request.metadata.requiredCapabilities)
        ? request.metadata.requiredCapabilities
        : [request.metadata.requiredCapabilities];

      for (const capability of capabilities) {
        const agents = this.agentRegistry.getAvailableAgentsForCapability(capability);
        availableAgents.push(...agents);
      }
    } else {
      // Get all available agents
      availableAgents = this.agentRegistry.getOnlineAgents();
    }

    // Filter by type if specified
    if (request.metadata && request.metadata.agentType) {
      availableAgents = availableAgents.filter(agent => agent.type === request.metadata!.agentType);
    }

    // Remove duplicates
    const uniqueAgents = availableAgents.filter((agent, index, self) =>
      index === self.findIndex(a => a.id === agent.id)
    );

    return uniqueAgents;
  }

  /**
   * Select agent using configured algorithm
   */
  private selectAgent(agents: AgentInfo[], request: AgentRequest): AgentInfo {
    switch (this.config.algorithm) {
      case 'round-robin':
        return this.selectRoundRobin(agents, request.type);
      case 'least-connections':
        return this.selectLeastConnections(agents);
      case 'weighted':
        return this.selectWeighted(agents);
      case 'random':
        return this.selectRandom(agents);
      default:
        return this.selectRoundRobin(agents, request.type);
    }
  }

  /**
   * Round-robin selection
   */
  private selectRoundRobin(agents: AgentInfo[], requestType: string): AgentInfo {
    const key = requestType;
    const currentIndex = this.roundRobinIndex.get(key) || 0;
    const selectedAgent = agents[currentIndex % agents.length];

    this.roundRobinIndex.set(key, (currentIndex + 1) % agents.length);
    return selectedAgent;
  }

  /**
   * Least connections selection
   */
  private selectLeastConnections(agents: AgentInfo[]): AgentInfo {
    let selectedAgent = agents[0];
    let minConnections = selectedAgent.status.activeRequests;

    for (const agent of agents) {
      if (agent.status.activeRequests < minConnections) {
        minConnections = agent.status.activeRequests;
        selectedAgent = agent;
      }
    }

    return selectedAgent;
  }

  /**
   * Weighted selection based on agent priority
   */
  private selectWeighted(agents: AgentInfo[]): AgentInfo {
    const totalWeight = agents.reduce((sum, agent) => sum + agent.priority, 0);
    let random = Math.random() * totalWeight;

    for (const agent of agents) {
      random -= agent.priority;
      if (random <= 0) {
        return agent;
      }
    }

    return agents[agents.length - 1];
  }

  /**
   * Random selection
   */
  private selectRandom(agents: AgentInfo[]): AgentInfo {
    const randomIndex = Math.floor(Math.random() * agents.length);
    return agents[randomIndex];
  }

  /**
   * Calculate estimated wait time for an agent
   */
  private calculateEstimatedWaitTime(agent: AgentInfo): number {
    const baseProcessingTime = 1000; // 1 second base processing time
    const loadFactor = agent.status.load / 100;
    const queueFactor = agent.status.activeRequests * 0.1; // 100ms per active request

    return Math.ceil(baseProcessingTime * loadFactor + queueFactor);
  }

  /**
   * Handle agent failure and failover
   */
  async handleAgentFailure(agentId: string, error: Error): Promise<string | null> {
    logger.warn(`Agent ${agentId} failed: ${error.message}`);

    const agent = this.agentRegistry.getAgent(agentId);
    if (!agent) {
      return null;
    }

    // Update agent status
    this.agentRegistry.updateAgentStatus(agentId, {
      state: 'error',
      errorCount: agent.status.errorCount + 1,
    });

    // Check if we should failover
    if (agent.status.errorCount >= this.config.failoverThreshold) {
      logger.info(`Agent ${agentId} reached failover threshold, attempting failover`);

      // Find backup agent
      const backupAgent = this.findBackupAgent(agent);
      if (backupAgent) {
        logger.info(`Failing over from ${agentId} to ${backupAgent.id}`);
        return backupAgent.id;
      }
    }

    return null;
  }

  /**
   * Find backup agent for failover
   */
  private findBackupAgent(failedAgent: AgentInfo): AgentInfo | null {
    // Find agents of the same type
    const sameTypeAgents = this.agentRegistry.getAgentsByType(failedAgent.type)
      .filter(agent => agent.id !== failedAgent.id && agent.status.state === 'online');

    if (sameTypeAgents.length === 0) {
      return null;
    }

    // Return the agent with least connections
    return this.selectLeastConnections(sameTypeAgents);
  }

  /**
   * Update agent load
   */
  updateAgentLoad(agentId: string, load: number): void {
    this.agentRegistry.updateAgentStatus(agentId, { load });
  }

  /**
   * Get load balancer statistics
   */
  getLoadBalancerStats(): {
    algorithm: string;
    totalAgents: number;
    availableAgents: number;
    averageLoad: number;
    requestsPerSecond: number;
  } {
    const agents = this.agentRegistry.getAllAgents();
    const availableAgents = this.agentRegistry.getOnlineAgents();

    const averageLoad = agents.length > 0
      ? agents.reduce((sum, agent) => sum + agent.status.load, 0) / agents.length
      : 0;

    // Calculate requests per second (simplified)
    const totalRequests = agents.reduce((sum, agent) => sum + agent.status.totalRequests, 0);
    const requestsPerSecond = totalRequests / Math.max(1, agents.length);

    return {
      algorithm: this.config.algorithm,
      totalAgents: agents.length,
      availableAgents: availableAgents.length,
      averageLoad,
      requestsPerSecond,
    };
  }

  /**
   * Get agent performance metrics
   */
  getAgentPerformanceMetrics(): Array<{
    agentId: string;
    name: string;
    load: number;
    activeRequests: number;
    totalRequests: number;
    errorRate: number;
    averageResponseTime: number;
  }> {
    const agents = this.agentRegistry.getAllAgents();

    return agents.map(agent => {
      const errorRate = agent.status.totalRequests > 0
        ? (agent.status.errorCount / agent.status.totalRequests) * 100
        : 0;

      const stats = this.agentRegistry.getAgentStats(agent.id);
      const averageResponseTime = stats?.averageResponseTime || 0;

      return {
        agentId: agent.id,
        name: agent.name,
        load: agent.status.load,
        activeRequests: agent.status.activeRequests,
        totalRequests: agent.status.totalRequests,
        errorRate,
        averageResponseTime,
      };
    });
  }

  /**
   * Rebalance agents (for maintenance or scaling)
   */
  async rebalanceAgents(): Promise<void> {
    const agents = this.agentRegistry.getOnlineAgents();

    // Reset round-robin indices
    this.roundRobinIndex.clear();

    // Update agent loads
    for (const agent of agents) {
      const load = Math.min(100, agent.status.activeRequests * 10);
      this.updateAgentLoad(agent.id, load);
    }

    logger.info('Agent rebalancing completed');
  }

  /**
   * Get configuration
   */
  getConfig(): LoadBalancerConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<LoadBalancerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info('Load balancer configuration updated:', newConfig);
  }
}

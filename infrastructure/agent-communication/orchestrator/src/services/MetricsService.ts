import { AgentInfo, Metrics, SystemMetrics } from '../types';
import { AgentRegistryService } from './AgentRegistryService';
import { logger } from '../utils/logger';

export class MetricsService {
  private agentRegistry: AgentRegistryService;
  private metricsInterval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private metricsHistory: Metrics[] = [];
  private maxHistorySize: number = 1000;

  constructor(agentRegistry: AgentRegistryService) {
    this.agentRegistry = agentRegistry;
  }

  /**
   * Start metrics collection
   */
  start(): void {
    if (this.isRunning) {
      logger.warn('Metrics service is already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting metrics service');

    // Collect initial metrics
    this.collectMetrics();

    // Set up periodic collection
    const interval = parseInt(process.env.METRICS_INTERVAL || '60000'); // 1 minute default
    this.metricsInterval = setInterval(() => {
      this.collectMetrics();
    }, interval);

    logger.info(`Metrics service started with ${interval}ms interval`);
  }

  /**
   * Stop metrics collection
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }

    logger.info('Metrics service stopped');
  }

  /**
   * Collect metrics from all agents
   */
  private collectMetrics(): void {
    const agents = this.agentRegistry.getAllAgents();
    const timestamp = new Date();

    for (const agent of agents) {
      const metrics: Metrics = {
        timestamp,
        agentId: agent.id,
        requestCount: agent.status.totalRequests,
        errorCount: agent.status.errorCount,
        averageResponseTime: this.calculateAverageResponseTime(agent),
        currentLoad: agent.status.load,
        memoryUsage: this.getMemoryUsage(),
        cpuUsage: this.getCpuUsage(),
      };

      this.metricsHistory.push(metrics);

      // Keep only recent metrics
      if (this.metricsHistory.length > this.maxHistorySize) {
        this.metricsHistory = this.metricsHistory.slice(-this.maxHistorySize);
      }
    }

    logger.debug(`Collected metrics for ${agents.length} agents`);
  }

  /**
   * Calculate average response time for an agent
   */
  private calculateAverageResponseTime(agent: AgentInfo): number {
    const healthHistory = this.agentRegistry.getHealthCheckHistory(agent.id);
    if (healthHistory.length === 0) {
      return 0;
    }

    const totalResponseTime = healthHistory.reduce((sum, check) => sum + check.responseTime, 0);
    return totalResponseTime / healthHistory.length;
  }

  /**
   * Get memory usage (simplified)
   */
  private getMemoryUsage(): number {
    // In a real implementation, this would get actual memory usage
    // For now, return a simulated value
    return Math.random() * 100;
  }

  /**
   * Get CPU usage (simplified)
   */
  private getCpuUsage(): number {
    // In a real implementation, this would get actual CPU usage
    // For now, return a simulated value
    return Math.random() * 100;
  }

  /**
   * Get system metrics
   */
  getSystemMetrics(): SystemMetrics {
    const agents = this.agentRegistry.getAllAgents();
    const onlineAgents = this.agentRegistry.getOnlineAgents();

    const totalRequests = agents.reduce((sum, agent) => sum + agent.status.totalRequests, 0);
    const totalErrors = agents.reduce((sum, agent) => sum + agent.status.errorCount, 0);
    const averageResponseTime = this.getAverageResponseTime();
    const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
    const throughput = this.calculateThroughput();
    const memoryUsage = this.getMemoryUsage();
    const cpuUsage = this.getCpuUsage();

    return {
      totalAgents: agents.length,
      activeAgents: onlineAgents.length,
      totalRequests,
      pendingRequests: this.getPendingRequests(),
      averageResponseTime,
      errorRate,
      throughput,
      memoryUsage,
      cpuUsage,
    };
  }

  /**
   * Get agent-specific metrics
   */
  getAgentMetrics(agentId: string): Metrics[] {
    return this.metricsHistory.filter(metrics => metrics.agentId === agentId);
  }

  /**
   * Get metrics for all agents
   */
  getAllAgentMetrics(): Metrics[] {
    return [...this.metricsHistory];
  }

  /**
   * Get recent metrics (last N minutes)
   */
  getRecentMetrics(minutes: number = 60): Metrics[] {
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return this.metricsHistory.filter(metrics => metrics.timestamp >= cutoffTime);
  }

  /**
   * Get average response time across all agents
   */
  private getAverageResponseTime(): number {
    if (this.metricsHistory.length === 0) {
      return 0;
    }

    const totalResponseTime = this.metricsHistory.reduce((sum, metrics) => sum + metrics.averageResponseTime, 0);
    return totalResponseTime / this.metricsHistory.length;
  }

  /**
   * Get pending requests count
   */
  private getPendingRequests(): number {
    // This would typically come from a request queue
    // For now, return a simulated value
    return Math.floor(Math.random() * 100);
  }

  /**
   * Calculate throughput (requests per second)
   */
  private calculateThroughput(): number {
    const recentMetrics = this.getRecentMetrics(1); // Last minute
    if (recentMetrics.length === 0) {
      return 0;
    }

    const totalRequests = recentMetrics.reduce((sum, metrics) => sum + metrics.requestCount, 0);
    return totalRequests / 60; // requests per second
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    totalRequests: number;
    totalErrors: number;
    averageResponseTime: number;
    errorRate: number;
    throughput: number;
    topPerformingAgents: Array<{ agentId: string; responseTime: number; requests: number }>;
    problematicAgents: Array<{ agentId: string; errorRate: number; errors: number }>;
  } {
    const agents = this.agentRegistry.getAllAgents();
    const recentMetrics = this.getRecentMetrics(60); // Last hour

    const totalRequests = agents.reduce((sum, agent) => sum + agent.status.totalRequests, 0);
    const totalErrors = agents.reduce((sum, agent) => sum + agent.status.errorCount, 0);
    const averageResponseTime = this.getAverageResponseTime();
    const errorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
    const throughput = this.calculateThroughput();

    // Find top performing agents
    const agentMetrics = agents.map(agent => {
      const agentRecentMetrics = recentMetrics.filter(m => m.agentId === agent.id);
      const avgResponseTime = agentRecentMetrics.length > 0
        ? agentRecentMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / agentRecentMetrics.length
        : 0;

      const errorCount = agentRecentMetrics.reduce((sum, m) => sum + m.errorCount, 0);
      const requestCount = agentRecentMetrics.reduce((sum, m) => sum + m.requestCount, 0);
      const errorRate = requestCount > 0 ? (errorCount / requestCount) * 100 : 0;

      return {
        agentId: agent.id,
        responseTime: avgResponseTime,
        requests: agent.status.totalRequests,
        errorRate,
        errors: errorCount,
      };
    });

    const topPerformingAgents = agentMetrics
      .filter(agent => agent.requests > 0)
      .sort((a, b) => a.responseTime - b.responseTime)
      .slice(0, 5);

    // Find problematic agents
    const problematicAgents = agentMetrics
      .filter(agent => agent.errorRate > 10) // More than 10% error rate
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 5);

    return {
      totalRequests,
      totalErrors,
      averageResponseTime,
      errorRate,
      throughput,
      topPerformingAgents,
      problematicAgents,
    };
  }

  /**
   * Get metrics trends
   */
  getMetricsTrends(): {
    responseTimeTrend: 'increasing' | 'decreasing' | 'stable';
    errorRateTrend: 'increasing' | 'decreasing' | 'stable';
    throughputTrend: 'increasing' | 'decreasing' | 'stable';
    predictions: {
      expectedResponseTime: number;
      expectedErrorRate: number;
      expectedThroughput: number;
    };
  } {
    const recentMetrics = this.getRecentMetrics(60); // Last hour
    const olderMetrics = this.getRecentMetrics(120).slice(0, 60); // Previous hour

    if (recentMetrics.length === 0 || olderMetrics.length === 0) {
      return {
        responseTimeTrend: 'stable',
        errorRateTrend: 'stable',
        throughputTrend: 'stable',
        predictions: {
          expectedResponseTime: 0,
          expectedErrorRate: 0,
          expectedThroughput: 0,
        },
      };
    }

    const recentAvgResponseTime = recentMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / recentMetrics.length;
    const olderAvgResponseTime = olderMetrics.reduce((sum, m) => sum + m.averageResponseTime, 0) / olderMetrics.length;

    const recentErrorRate = recentMetrics.reduce((sum, m) => sum + m.errorCount, 0) /
                           Math.max(1, recentMetrics.reduce((sum, m) => sum + m.requestCount, 0));
    const olderErrorRate = olderMetrics.reduce((sum, m) => sum + m.errorCount, 0) /
                          Math.max(1, olderMetrics.reduce((sum, m) => sum + m.requestCount, 0));

    const recentThroughput = recentMetrics.reduce((sum, m) => sum + m.requestCount, 0) / 60;
    const olderThroughput = olderMetrics.reduce((sum, m) => sum + m.requestCount, 0) / 60;

    const getTrend = (recent: number, older: number): 'increasing' | 'decreasing' | 'stable' => {
      const change = ((recent - older) / older) * 100;
      if (Math.abs(change) < 5) return 'stable';
      return change > 0 ? 'increasing' : 'decreasing';
    };

    return {
      responseTimeTrend: getTrend(recentAvgResponseTime, olderAvgResponseTime),
      errorRateTrend: getTrend(recentErrorRate, olderErrorRate),
      throughputTrend: getTrend(recentThroughput, olderThroughput),
      predictions: {
        expectedResponseTime: recentAvgResponseTime,
        expectedErrorRate: recentErrorRate * 100,
        expectedThroughput: recentThroughput,
      },
    };
  }

  /**
   * Export metrics data
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = 'timestamp,agentId,requestCount,errorCount,averageResponseTime,currentLoad,memoryUsage,cpuUsage';
      const rows = this.metricsHistory.map(metrics =>
        `${metrics.timestamp.toISOString()},${metrics.agentId},${metrics.requestCount},${metrics.errorCount},${metrics.averageResponseTime},${metrics.currentLoad},${metrics.memoryUsage || 0},${metrics.cpuUsage || 0}`
      ).join('\n');

      return `${headers}\n${rows}`;
    }

    return JSON.stringify(this.metricsHistory, null, 2);
  }

  /**
   * Get service status
   */
  getServiceStatus(): 'running' | 'stopped' {
    return this.isRunning ? 'running' : 'stopped';
  }
}

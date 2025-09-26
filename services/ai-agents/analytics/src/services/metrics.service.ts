import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  async getMetrics(period: string) {
    // Simulate metrics data collection
    const hours = period === '24h' ? 24 : period === '7d' ? 168 : 24;
    const interval = period === '24h' ? 60 : period === '7d' ? 1440 : 60; // minutes

    const metrics = [];
    for (let i = 0; i < hours; i++) {
      const timestamp = new Date(Date.now() - (hours - i) * interval * 60 * 1000);
      metrics.push({
        timestamp,
        requests: Math.floor(Math.random() * 100) + 50,
        responseTime: Math.floor(Math.random() * 200) + 100,
        errors: Math.floor(Math.random() * 5),
        throughput: Math.floor(Math.random() * 50) + 25,
      });
    }

    return metrics;
  }

  async getAgentMetrics(agentId: string, period: string) {
    // Simulate agent-specific metrics
    return {
      agentId,
      period,
      totalRequests: Math.floor(Math.random() * 10000) + 5000,
      averageResponseTime: Math.floor(Math.random() * 300) + 100,
      errorRate: Math.random() * 0.05,
      uptime: 99 + Math.random() * 0.9,
      lastActivity: new Date(),
    };
  }

  async getSystemMetrics() {
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
      network: {
        inbound: Math.floor(Math.random() * 1000),
        outbound: Math.floor(Math.random() * 1000),
      },
    };
  }

  async getKPIMetrics(period: string) {
    return {
      period,
      kpis: [
        {
          name: 'System Availability',
          value: 99.8 + Math.random() * 0.2,
          target: 99.9,
          status: 'good',
        },
        {
          name: 'Average Response Time',
          value: Math.floor(Math.random() * 200) + 150,
          target: 200,
          status: 'warning',
        },
        {
          name: 'Error Rate',
          value: Math.random() * 0.1,
          target: 0.05,
          status: 'critical',
        },
        {
          name: 'Throughput',
          value: Math.floor(Math.random() * 1000) + 500,
          target: 800,
          status: 'good',
        },
      ],
    };
  }
}

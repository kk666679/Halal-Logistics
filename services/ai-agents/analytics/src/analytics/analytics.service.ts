import { Injectable } from '@nestjs/common';
import { MessageBrokerService } from '../services/message-broker.service';
import { MetricsService } from '../services/metrics.service';
import * as _ from 'lodash';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly messageBroker: MessageBrokerService,
    private readonly metricsService: MetricsService,
  ) {}

  async getDashboardData(query: any) {
    const { period = '7d', agentType } = query;

    // Get metrics from all agents
    const agentMetrics = await this.getAgentMetrics(period, agentType);
    const performanceData = await this.getPerformanceData(period);
    const predictions = await this.getPredictions({ period, type: 'overview' });
    const alerts = await this.getActiveAlerts();

    return {
      summary: {
        totalAgents: agentMetrics.length,
        activeAgents: agentMetrics.filter(m => m.status === 'active').length,
        totalRequests: _.sumBy(agentMetrics, 'totalRequests'),
        averageResponseTime: _.meanBy(agentMetrics, 'avgResponseTime'),
        uptime: this.calculateOverallUptime(agentMetrics),
      },
      agentMetrics,
      performanceData,
      predictions,
      alerts: alerts.slice(0, 5), // Top 5 alerts
      lastUpdated: new Date(),
    };
  }

  async getPerformanceMetrics(query: any) {
    const { period = '24h', metricType = 'all' } = query;

    const metrics = await this.metricsService.getMetrics(period);

    return {
      period,
      metricType,
      data: metrics,
      summary: {
        totalRequests: _.sumBy(metrics, 'requests'),
        averageResponseTime: _.meanBy(metrics, 'responseTime'),
        errorRate: this.calculateErrorRate(metrics),
        throughput: this.calculateThroughput(metrics),
      },
    };
  }

  async getPredictions(query: any) {
    const { period = '7d', type = 'demand' } = query;

    // Simulate ML predictions
    const predictions = {
      demand: this.generateDemandPredictions(period),
      performance: this.generatePerformancePredictions(period),
      compliance: this.generateCompliancePredictions(period),
      risk: this.generateRiskPredictions(period),
    };

    return {
      type,
      period,
      predictions: predictions[type] || predictions.demand,
      confidence: 0.85,
      modelVersion: 'v2.1.0',
      generatedAt: new Date(),
    };
  }

  async getReports(query: any) {
    const { type = 'all', period = '30d', format = 'json' } = query;

    const reports = [
      {
        id: 'RPT-001',
        type: 'performance',
        title: 'Weekly Performance Report',
        period: '2024-01-01 to 2024-01-07',
        status: 'completed',
        generatedAt: new Date('2024-01-07T10:00:00Z'),
        size: '2.4 MB',
      },
      {
        id: 'RPT-002',
        type: 'compliance',
        title: 'Monthly Compliance Audit',
        period: '2024-01-01 to 2024-01-31',
        status: 'completed',
        generatedAt: new Date('2024-01-31T15:30:00Z'),
        size: '1.8 MB',
      },
      {
        id: 'RPT-003',
        type: 'predictive',
        title: 'Q1 2024 Demand Forecast',
        period: '2024-01-01 to 2024-03-31',
        status: 'processing',
        generatedAt: new Date(),
        size: '3.2 MB',
      },
    ];

    return {
      type,
      period,
      format,
      reports: reports.filter(r => type === 'all' || r.type === type),
      total: reports.length,
    };
  }

  async generateReport(reportConfig: any) {
    const { type, period, format = 'json', includeCharts = true } = reportConfig;

    const reportId = `RPT-${Date.now()}`;

    // Simulate report generation
    const report = {
      id: reportId,
      type,
      period,
      format,
      status: 'generating',
      progress: 0,
      estimatedTime: '5-10 minutes',
      startedAt: new Date(),
    };

    // Publish report generation event
    await this.messageBroker.publish('analytics.report.generating', {
      reportId,
      type,
      period,
    });

    // Simulate async report generation
    setTimeout(async () => {
      report.status = 'completed';
      report.progress = 100;
      report.completedAt = new Date();
      report.downloadUrl = `/api/v1/analytics/reports/${reportId}/download`;

      await this.messageBroker.publish('analytics.report.completed', {
        reportId,
        type,
        downloadUrl: report.downloadUrl,
      });
    }, 5000);

    return report;
  }

  async getTrends(query: any) {
    const { period = '30d', metric = 'requests' } = query;

    const trends = {
      requests: this.generateTrendData(period, 'requests'),
      responseTime: this.generateTrendData(period, 'responseTime'),
      errorRate: this.generateTrendData(period, 'errorRate'),
      throughput: this.generateTrendData(period, 'throughput'),
    };

    return {
      period,
      metric,
      trends: trends[metric] || trends.requests,
      analysis: this.analyzeTrends(trends[metric]),
    };
  }

  async getInsights(query: any) {
    const { period = '7d', type = 'all' } = query;

    const insights = [
      {
        id: 'INS-001',
        type: 'performance',
        title: 'Response Time Optimization',
        description: 'Blockchain agent response times can be improved by 15% with caching optimization',
        impact: 'high',
        confidence: 0.92,
        actionable: true,
        category: 'optimization',
      },
      {
        id: 'INS-002',
        type: 'predictive',
        title: 'Demand Spike Expected',
        description: 'Expected 25% increase in certification requests next week',
        impact: 'medium',
        confidence: 0.78,
        actionable: true,
        category: 'forecasting',
      },
      {
        id: 'INS-003',
        type: 'compliance',
        title: 'Compliance Risk Alert',
        description: '3 suppliers have expiring halal certifications within 30 days',
        impact: 'high',
        confidence: 0.95,
        actionable: true,
        category: 'risk',
      },
    ];

    return {
      period,
      type,
      insights: type === 'all' ? insights : insights.filter(i => i.type === type),
      total: insights.length,
    };
  }

  async getKPIs(query: any) {
    const { period = '30d' } = query;

    return {
      period,
      kpis: [
        {
          name: 'System Availability',
          value: 99.8,
          target: 99.9,
          unit: '%',
          trend: 'stable',
          status: 'good',
        },
        {
          name: 'Average Response Time',
          value: 245,
          target: 200,
          unit: 'ms',
          trend: 'improving',
          status: 'warning',
        },
        {
          name: 'Compliance Score',
          value: 95.5,
          target: 95.0,
          unit: '%',
          trend: 'improving',
          status: 'excellent',
        },
        {
          name: 'Agent Efficiency',
          value: 87.3,
          target: 85.0,
          unit: '%',
          trend: 'stable',
          status: 'good',
        },
      ],
    };
  }

  async getAlerts(query: any) {
    const { status = 'active', priority = 'all' } = query;

    const alerts = [
      {
        id: 'ALT-001',
        type: 'performance',
        title: 'High Response Time',
        description: 'Blockchain agent response time exceeded 500ms threshold',
        priority: 'high',
        status: 'active',
        createdAt: new Date('2024-01-15T10:30:00Z'),
        agent: 'blockchain-agent',
      },
      {
        id: 'ALT-002',
        type: 'compliance',
        title: 'Certification Expiring',
        description: 'Supplier ABC-123 halal certification expires in 15 days',
        priority: 'medium',
        status: 'active',
        createdAt: new Date('2024-01-14T14:20:00Z'),
        agent: 'compliance-agent',
      },
      {
        id: 'ALT-003',
        type: 'system',
        title: 'Memory Usage High',
        description: 'Orchestrator memory usage at 85%',
        priority: 'low',
        status: 'acknowledged',
        createdAt: new Date('2024-01-13T09:15:00Z'),
        agent: 'orchestrator',
      },
    ];

    return {
      status,
      priority,
      alerts: alerts.filter(alert => {
        if (status !== 'all' && alert.status !== status) return false;
        if (priority !== 'all' && alert.priority !== priority) return false;
        return true;
      }),
      total: alerts.length,
    };
  }

  async configureAlert(alertConfig: any) {
    const { alertType, threshold, enabled, notificationChannels } = alertConfig;

    const config = {
      id: `CFG-${Date.now()}`,
      alertType,
      threshold,
      enabled,
      notificationChannels,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Publish configuration change event
    await this.messageBroker.publish('analytics.alert.configured', {
      configId: config.id,
      alertType,
      enabled,
    });

    return {
      success: true,
      message: 'Alert configuration updated successfully',
      config,
    };
  }

  // Helper methods
  private async getAgentMetrics(period: string, agentType?: string) {
    // Simulate getting metrics from all agents
    return [
      {
        agentId: 'blockchain-agent',
        agentType: 'blockchain',
        status: 'active',
        totalRequests: 1250,
        avgResponseTime: 245,
        uptime: 99.8,
        lastActivity: new Date(),
      },
      {
        agentId: 'compliance-agent',
        agentType: 'compliance',
        status: 'active',
        totalRequests: 890,
        avgResponseTime: 180,
        uptime: 99.9,
        lastActivity: new Date(),
      },
      {
        agentId: 'orchestrator',
        agentType: 'orchestrator',
        status: 'active',
        totalRequests: 2100,
        avgResponseTime: 95,
        uptime: 99.95,
        lastActivity: new Date(),
      },
    ].filter(agent => !agentType || agent.agentType === agentType);
  }

  private async getPerformanceData(period: string) {
    // Simulate performance data
    return {
      labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
      datasets: [
        {
          label: 'Response Time (ms)',
          data: [220, 210, 240, 280, 260, 230],
        },
        {
          label: 'Requests per Minute',
          data: [45, 52, 78, 95, 88, 65],
        },
      ],
    };
  }

  private async getActiveAlerts() {
    return [
      {
        id: 'ALT-001',
        type: 'performance',
        title: 'High Response Time',
        priority: 'high',
        status: 'active',
        createdAt: new Date(),
      },
    ];
  }

  private generateDemandPredictions(period: string) {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 14;
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      predicted: Math.floor(Math.random() * 100) + 50,
      confidence: 0.85,
    }));
  }

  private generatePerformancePredictions(period: string) {
    return {
      responseTime: { trend: 'decreasing', confidence: 0.78 },
      throughput: { trend: 'increasing', confidence: 0.82 },
      errorRate: { trend: 'stable', confidence: 0.91 },
    };
  }

  private generateCompliancePredictions(period: string) {
    return {
      overall: 96.2,
      byCategory: {
        documentation: 98.5,
        certification: 94.8,
        audit: 95.3,
      },
    };
  }

  private generateRiskPredictions(period: string) {
    return {
      level: 'medium',
      factors: ['certification_expiry', 'supplier_changes'],
      mitigation: ['automated_renewals', 'diversification'],
    };
  }

  private generateTrendData(period: string, metric: string) {
    const points = period === '7d' ? 7 : 14;
    return Array.from({ length: points }, (_, i) => ({
      timestamp: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000),
      value: Math.floor(Math.random() * 100) + 50,
    }));
  }

  private analyzeTrends(data: any[]) {
    if (data.length < 2) return { trend: 'insufficient_data' };

    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));

    const firstAvg = _.meanBy(firstHalf, 'value');
    const secondAvg = _.meanBy(secondHalf, 'value');

    let trend = 'stable';
    if (secondAvg > firstAvg * 1.05) trend = 'increasing';
    if (secondAvg < firstAvg * 0.95) trend = 'decreasing';

    return {
      trend,
      change: ((secondAvg - firstAvg) / firstAvg) * 100,
      confidence: 0.85,
    };
  }

  private calculateOverallUptime(agentMetrics: any[]) {
    const totalUptime = _.sumBy(agentMetrics, 'uptime');
    return totalUptime / agentMetrics.length;
  }

  private calculateErrorRate(metrics: any[]) {
    const totalRequests = _.sumBy(metrics, 'requests');
    const totalErrors = _.sumBy(metrics, 'errors');
    return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
  }

  private calculateThroughput(metrics: any[]) {
    const totalRequests = _.sumBy(metrics, 'requests');
    const timeSpan = metrics.length * 5; // Assuming 5-minute intervals
    return totalRequests / timeSpan;
  }
}

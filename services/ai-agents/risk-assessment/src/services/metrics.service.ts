import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageBrokerService } from './message-broker.service';

export interface RiskMetrics {
  assessmentCount: number;
  averageRiskScore: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  alertsGenerated: number;
  mitigationsApplied: number;
  modelAccuracy: number;
  processingTime: number;
  systemUptime: number;
}

export interface RiskKPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  category: string;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
  status: 'on_track' | 'at_risk' | 'off_track';
  lastUpdated: Date;
}

@Injectable()
export class MetricsService {
  private readonly logger = new Logger(MetricsService.name);
  private readonly metrics: Map<string, any> = new Map();
  private readonly kpis: Map<string, RiskKPI> = new Map();
  private startTime: Date;

  constructor(
    private readonly configService: ConfigService,
    private readonly messageBroker: MessageBrokerService,
  ) {
    this.startTime = new Date();
    this.initializeMetrics();
    this.startMetricsCollection();
  }

  /**
   * Initialize default metrics
   */
  private initializeMetrics(): void {
    const defaultMetrics: RiskMetrics = {
      assessmentCount: 0,
      averageRiskScore: 0,
      highRiskCount: 0,
      mediumRiskCount: 0,
      lowRiskCount: 0,
      alertsGenerated: 0,
      mitigationsApplied: 0,
      modelAccuracy: 0.85,
      processingTime: 0,
      systemUptime: 0,
    };

    this.metrics.set('risk', defaultMetrics);
    this.initializeKPIs();
  }

  /**
   * Initialize default KPIs
   */
  private initializeKPIs(): void {
    const defaultKPIs: RiskKPI[] = [
      {
        id: 'overall_risk_score',
        name: 'Overall Risk Score',
        value: 0.3,
        target: 0.25,
        unit: 'score',
        category: 'risk',
        timeframe: '30d',
        trend: 'stable',
        status: 'on_track',
        lastUpdated: new Date(),
      },
      {
        id: 'assessment_completion_rate',
        name: 'Assessment Completion Rate',
        value: 95,
        target: 98,
        unit: 'percentage',
        category: 'efficiency',
        timeframe: '7d',
        trend: 'up',
        status: 'on_track',
        lastUpdated: new Date(),
      },
      {
        id: 'alert_resolution_time',
        name: 'Alert Resolution Time',
        value: 2.5,
        target: 2.0,
        unit: 'hours',
        category: 'response',
        timeframe: '24h',
        trend: 'down',
        status: 'at_risk',
        lastUpdated: new Date(),
      },
      {
        id: 'mitigation_effectiveness',
        name: 'Mitigation Effectiveness',
        value: 87,
        target: 90,
        unit: 'percentage',
        category: 'effectiveness',
        timeframe: '30d',
        trend: 'up',
        status: 'on_track',
        lastUpdated: new Date(),
      },
      {
        id: 'model_accuracy',
        name: 'Model Accuracy',
        value: 92,
        target: 95,
        unit: 'percentage',
        category: 'accuracy',
        timeframe: '7d',
        trend: 'up',
        status: 'on_track',
        lastUpdated: new Date(),
      },
    ];

    defaultKPIs.forEach(kpi => this.kpis.set(kpi.id, kpi));
  }

  /**
   * Start metrics collection interval
   */
  private startMetricsCollection(): void {
    const interval = this.configService.get<number>('ANALYTICS_AGGREGATION_INTERVAL', 300000);

    setInterval(() => {
      this.collectMetrics();
      this.updateKPIs();
      this.publishMetrics();
    }, interval);
  }

  /**
   * Collect current metrics
   */
  private async collectMetrics(): Promise<void> {
    try {
      const currentMetrics = this.metrics.get('risk') || {};

      // Update system uptime
      const uptime = Date.now() - this.startTime.getTime();
      currentMetrics.systemUptime = uptime;

      // Collect assessment metrics
      currentMetrics.assessmentCount = await this.getAssessmentCount();
      currentMetrics.averageRiskScore = await this.getAverageRiskScore();

      // Collect risk level counts
      currentMetrics.highRiskCount = await this.getRiskLevelCount('high');
      currentMetrics.mediumRiskCount = await this.getRiskLevelCount('medium');
      currentMetrics.lowRiskCount = await this.getRiskLevelCount('low');

      // Collect alert and mitigation metrics
      currentMetrics.alertsGenerated = await this.getAlertsGenerated();
      currentMetrics.mitigationsApplied = await this.getMitigationsApplied();

      // Update processing time
      currentMetrics.processingTime = await this.getAverageProcessingTime();

      this.metrics.set('risk', currentMetrics);

      this.logger.debug('Metrics collected successfully');
    } catch (error) {
      this.logger.error('Failed to collect metrics', error);
    }
  }

  /**
   * Update KPI values based on current metrics
   */
  private async updateKPIs(): Promise<void> {
    try {
      const metrics = this.metrics.get('risk');

      if (!metrics) return;

      // Update overall risk score KPI
      const riskScoreKPI = this.kpis.get('overall_risk_score');
      if (riskScoreKPI) {
        riskScoreKPI.value = metrics.averageRiskScore;
        riskScoreKPI.status = metrics.averageRiskScore <= riskScoreKPI.target ? 'on_track' : 'at_risk';
        riskScoreKPI.trend = this.calculateTrend(riskScoreKPI.value, riskScoreKPI.target);
        riskScoreKPI.lastUpdated = new Date();
      }

      // Update assessment completion rate KPI
      const completionRateKPI = this.kpis.get('assessment_completion_rate');
      if (completionRateKPI) {
        completionRateKPI.value = await this.calculateCompletionRate();
        completionRateKPI.status = completionRateKPI.value >= completionRateKPI.target ? 'on_track' : 'at_risk';
        completionRateKPI.trend = this.calculateTrend(completionRateKPI.value, completionRateKPI.target);
        completionRateKPI.lastUpdated = new Date();
      }

      // Update alert resolution time KPI
      const resolutionTimeKPI = this.kpis.get('alert_resolution_time');
      if (resolutionTimeKPI) {
        resolutionTimeKPI.value = await this.getAverageAlertResolutionTime();
        resolutionTimeKPI.status = resolutionTimeKPI.value <= resolutionTimeKPI.target ? 'on_track' : 'at_risk';
        resolutionTimeKPI.trend = this.calculateTrend(resolutionTimeKPI.value, resolutionTimeKPI.target);
        resolutionTimeKPI.lastUpdated = new Date();
      }

      // Update mitigation effectiveness KPI
      const effectivenessKPI = this.kpis.get('mitigation_effectiveness');
      if (effectivenessKPI) {
        effectivenessKPI.value = await this.calculateMitigationEffectiveness();
        effectivenessKPI.status = effectivenessKPI.value >= effectivenessKPI.target ? 'on_track' : 'at_risk';
        effectivenessKPI.trend = this.calculateTrend(effectivenessKPI.value, effectivenessKPI.target);
        effectivenessKPI.lastUpdated = new Date();
      }

      // Update model accuracy KPI
      const accuracyKPI = this.kpis.get('model_accuracy');
      if (accuracyKPI) {
        accuracyKPI.value = await this.getModelAccuracy();
        accuracyKPI.status = accuracyKPI.value >= accuracyKPI.target ? 'on_track' : 'at_risk';
        accuracyKPI.trend = this.calculateTrend(accuracyKPI.value, accuracyKPI.target);
        accuracyKPI.lastUpdated = new Date();
      }

      this.logger.debug('KPIs updated successfully');
    } catch (error) {
      this.logger.error('Failed to update KPIs', error);
    }
  }

  /**
   * Publish metrics to message broker
   */
  private async publishMetrics(): Promise<void> {
    try {
      const metrics = this.metrics.get('risk');
      const kpis = Array.from(this.kpis.values());

      await this.messageBroker.publish('risk.metrics.updated', {
        timestamp: new Date().toISOString(),
        metrics,
        kpis,
        agent: 'risk-assessment',
      });

      this.logger.debug('Metrics published to message broker');
    } catch (error) {
      this.logger.error('Failed to publish metrics', error);
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): RiskMetrics {
    return this.metrics.get('risk') || {} as RiskMetrics;
  }

  /**
   * Get current KPIs
   */
  getKPIs(): RiskKPI[] {
    return Array.from(this.kpis.values());
  }

  /**
   * Get specific KPI by ID
   */
  getKPI(id: string): RiskKPI | undefined {
    return this.kpis.get(id);
  }

  /**
   * Update KPI target
   */
  updateKPITarget(id: string, target: number): boolean {
    const kpi = this.kpis.get(id);
    if (!kpi) return false;

    kpi.target = target;
    kpi.lastUpdated = new Date();
    return true;
  }

  /**
   * Record risk assessment completion
   */
  recordAssessment(riskScore: number, processingTime: number): void {
    const metrics = this.metrics.get('risk');
    if (!metrics) return;

    metrics.assessmentCount++;
    metrics.averageRiskScore = (metrics.averageRiskScore * (metrics.assessmentCount - 1) + riskScore) / metrics.assessmentCount;
    metrics.processingTime = (metrics.processingTime * (metrics.assessmentCount - 1) + processingTime) / metrics.assessmentCount;

    // Update risk level counts
    if (riskScore >= 0.8) metrics.highRiskCount++;
    else if (riskScore >= 0.5) metrics.mediumRiskCount++;
    else metrics.lowRiskCount++;

    this.logger.debug(`Assessment recorded: score=${riskScore}, time=${processingTime}ms`);
  }

  /**
   * Record alert generation
   */
  recordAlert(): void {
    const metrics = this.metrics.get('risk');
    if (metrics) {
      metrics.alertsGenerated++;
    }
  }

  /**
   * Record mitigation application
   */
  recordMitigation(): void {
    const metrics = this.metrics.get('risk');
    if (metrics) {
      metrics.mitigationsApplied++;
    }
  }

  /**
   * Get dashboard data
   */
  getDashboardData(timeframe: string = '24h'): any {
    const metrics = this.getMetrics();
    const kpis = this.getKPIs();

    return {
      summary: {
        totalAssessments: metrics.assessmentCount,
        averageRiskScore: metrics.averageRiskScore,
        activeAlerts: metrics.alertsGenerated,
        appliedMitigations: metrics.mitigationsApplied,
        systemUptime: metrics.systemUptime,
      },
      riskDistribution: {
        high: metrics.highRiskCount,
        medium: metrics.mediumRiskCount,
        low: metrics.lowRiskCount,
      },
      kpis: kpis.filter(kpi => kpi.status !== 'on_track'),
      trends: this.getTrendsData(timeframe),
      performance: {
        averageProcessingTime: metrics.processingTime,
        modelAccuracy: metrics.modelAccuracy,
      },
    };
  }

  /**
   * Get trends data for specified timeframe
   */
  private getTrendsData(timeframe: string): any {
    // Mock trends data - in real implementation, this would query historical data
    return {
      riskScore: [
        { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), value: 0.32 },
        { timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), value: 0.28 },
        { timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), value: 0.31 },
        { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), value: 0.29 },
        { timestamp: new Date().toISOString(), value: 0.30 },
      ],
      assessmentVolume: [
        { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), value: 45 },
        { timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), value: 52 },
        { timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), value: 38 },
        { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), value: 61 },
        { timestamp: new Date().toISOString(), value: 47 },
      ],
    };
  }

  /**
   * Calculate trend direction
   */
  private calculateTrend(current: number, target: number): 'up' | 'down' | 'stable' {
    const diff = current - target;
    const threshold = Math.abs(target) * 0.05; // 5% threshold

    if (Math.abs(diff) <= threshold) return 'stable';
    return diff > 0 ? 'up' : 'down';
  }

  /**
   * Mock data retrieval methods - replace with actual database queries
   */
  private async getAssessmentCount(): Promise<number> {
    return Math.floor(Math.random() * 1000) + 500;
  }

  private async getAverageRiskScore(): Promise<number> {
    return Math.random() * 0.5 + 0.2; // Random between 0.2 and 0.7
  }

  private async getRiskLevelCount(level: string): Promise<number> {
    return Math.floor(Math.random() * 100) + 50;
  }

  private async getAlertsGenerated(): Promise<number> {
    return Math.floor(Math.random() * 50) + 10;
  }

  private async getMitigationsApplied(): Promise<number> {
    return Math.floor(Math.random() * 30) + 5;
  }

  private async getAverageProcessingTime(): Promise<number> {
    return Math.random() * 2000 + 500; // Random between 500ms and 2500ms
  }

  private async calculateCompletionRate(): Promise<number> {
    return Math.random() * 10 + 90; // Random between 90% and 100%
  }

  private async getAverageAlertResolutionTime(): Promise<number> {
    return Math.random() * 4 + 1; // Random between 1 and 5 hours
  }

  private async calculateMitigationEffectiveness(): Promise<number> {
    return Math.random() * 15 + 80; // Random between 80% and 95%
  }

  private async getModelAccuracy(): Promise<number> {
    return Math.random() * 8 + 87; // Random between 87% and 95%
  }
}

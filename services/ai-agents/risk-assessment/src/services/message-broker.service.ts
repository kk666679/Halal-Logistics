import { Injectable } from '@nestjs/common';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class MessageBrokerService {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private isConnected = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'risk-assessment-agent',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'risk-assessment-group' });
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      this.isConnected = true;
      console.log('✅ Risk Assessment Agent connected to Kafka');
    } catch (error) {
      console.error('❌ Failed to connect to Kafka:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      this.isConnected = false;
      console.log('✅ Risk Assessment Agent disconnected from Kafka');
    } catch (error) {
      console.error('❌ Error disconnecting from Kafka:', error);
    }
  }

  async publish(topic: string, message: any): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: message.id || `risk_${Date.now()}`,
            value: JSON.stringify({
              ...message,
              source: 'risk-assessment-agent',
              timestamp: new Date().toISOString(),
            }),
          },
        ],
      });

      console.log(`📤 Published message to topic ${topic}:`, message);
    } catch (error) {
      console.error(`❌ Failed to publish message to ${topic}:`, error);
      throw error;
    }
  }

  async subscribe(topic: string, handler: (message: any) => Promise<void>): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }

    try {
      await this.consumer.subscribe({ topic, fromBeginning: false });

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          try {
            const message = JSON.parse(payload.message.value?.toString() || '{}');
            await handler(message);
          } catch (error) {
            console.error('❌ Error processing message:', error);
          }
        },
      });

      console.log(`📥 Subscribed to topic ${topic}`);
    } catch (error) {
      console.error(`❌ Failed to subscribe to ${topic}:`, error);
      throw error;
    }
  }

  async publishRiskAssessment(assessment: any): Promise<void> {
    await this.publish('risk.assessment.completed', {
      id: assessment.id,
      type: assessment.type,
      riskLevel: assessment.overallRisk,
      factors: assessment.factors,
      recommendations: assessment.recommendations,
      assessedAt: assessment.assessedAt,
    });
  }

  async publishRiskAlert(alert: any): Promise<void> {
    await this.publish('risk.alert.generated', {
      id: alert.id,
      type: alert.type,
      priority: alert.priority,
      message: alert.message,
      riskLevel: alert.riskLevel,
      generatedAt: new Date().toISOString(),
    });
  }

  async publishRiskReport(report: any): Promise<void> {
    await this.publish('risk.report.generated', {
      id: report.id,
      type: report.type,
      format: report.format,
      size: report.size,
      downloadUrl: report.downloadUrl,
      generatedAt: report.generatedAt,
    });
  }

  async publishMitigationPlan(plan: any): Promise<void> {
    await this.publish('risk.mitigation.created', {
      id: plan.id,
      riskId: plan.riskId,
      strategies: plan.strategies,
      timeline: plan.timeline,
      estimatedCost: plan.estimatedCost,
      createdAt: plan.createdAt,
    });
  }

  async subscribeToAgentEvents(): Promise<void> {
    await this.subscribe('agent.health.changed', async (message) => {
      console.log('Agent health changed:', message);
      // Handle agent health changes
    });

    await this.subscribe('agent.metrics.updated', async (message) => {
      console.log('Agent metrics updated:', message);
      // Handle agent metrics updates
    });
  }

  async subscribeToCertificationEvents(): Promise<void> {
    await this.subscribe('certification.status.changed', async (message) => {
      console.log('Certification status changed:', message);
      // Trigger risk assessment for certification changes
      await this.triggerCertificationRiskAssessment(message);
    });

    await this.subscribe('certification.expired', async (message) => {
      console.log('Certification expired:', message);
      // Generate high-priority risk alert
      await this.generateCertificationExpiryAlert(message);
    });
  }

  async subscribeToLogisticsEvents(): Promise<void> {
    await this.subscribe('logistics.delay.occurred', async (message) => {
      console.log('Logistics delay occurred:', message);
      // Assess operational risk due to delays
      await this.assessLogisticsDelayRisk(message);
    });

    await this.subscribe('logistics.quality.issue', async (message) => {
      console.log('Logistics quality issue:', message);
      // Assess quality-related risks
      await this.assessQualityRisk(message);
    });
  }

  async subscribeToComplianceEvents(): Promise<void> {
    await this.subscribe('compliance.violation.detected', async (message) => {
      console.log('Compliance violation detected:', message);
      // Generate immediate risk alert
      await this.generateComplianceViolationAlert(message);
    });

    await this.subscribe('compliance.audit.scheduled', async (message) => {
      console.log('Compliance audit scheduled:', message);
      // Prepare risk assessment for audit
      await this.prepareAuditRiskAssessment(message);
    });
  }

  async subscribeToDocumentEvents(): Promise<void> {
    await this.subscribe('document.processed', async (message) => {
      console.log('Document processed:', message);
      // Assess document-related risks
      await this.assessDocumentRisk(message);
    });

    await this.subscribe('document.validation.failed', async (message) => {
      console.log('Document validation failed:', message);
      // Generate document validation risk alert
      await this.generateDocumentValidationAlert(message);
    });
  }

  private async triggerCertificationRiskAssessment(message: any): Promise<void> {
    // Trigger risk assessment when certification status changes
    await this.publish('risk.assessment.triggered', {
      type: 'certification',
      context: message,
      priority: 'medium',
      triggeredAt: new Date().toISOString(),
    });
  }

  private async generateCertificationExpiryAlert(message: any): Promise<void> {
    await this.publishRiskAlert({
      id: `alert_${Date.now()}`,
      type: 'certification_expiry',
      priority: 'high',
      message: `Certification ${message.certificationId} has expired`,
      riskLevel: 'high',
    });
  }

  private async assessLogisticsDelayRisk(message: any): Promise<void> {
    // Assess risk due to logistics delays
    await this.publish('risk.assessment.triggered', {
      type: 'operational',
      context: { delay: message, impact: 'supply_chain' },
      priority: 'medium',
      triggeredAt: new Date().toISOString(),
    });
  }

  private async assessQualityRisk(message: any): Promise<void> {
    // Assess quality-related risks
    await this.publish('risk.assessment.triggered', {
      type: 'quality',
      context: message,
      priority: 'high',
      triggeredAt: new Date().toISOString(),
    });
  }

  private async generateComplianceViolationAlert(message: any): Promise<void> {
    await this.publishRiskAlert({
      id: `alert_${Date.now()}`,
      type: 'compliance_violation',
      priority: 'high',
      message: `Compliance violation detected: ${message.violation}`,
      riskLevel: 'high',
    });
  }

  private async prepareAuditRiskAssessment(message: any): Promise<void> {
    // Prepare risk assessment for upcoming audit
    await this.publish('risk.assessment.scheduled', {
      type: 'audit_preparation',
      context: message,
      scheduledFor: message.auditDate,
      priority: 'high',
    });
  }

  private async assessDocumentRisk(message: any): Promise<void> {
    // Assess document-related risks
    await this.publish('risk.assessment.triggered', {
      type: 'document',
      context: message,
      priority: 'low',
      triggeredAt: new Date().toISOString(),
    });
  }

  private async generateDocumentValidationAlert(message: any): Promise<void> {
    await this.publishRiskAlert({
      id: `alert_${Date.now()}`,
      type: 'document_validation',
      priority: 'medium',
      message: `Document validation failed: ${message.documentId}`,
      riskLevel: 'medium',
    });
  }

  async getConnectionStatus(): Promise<boolean> {
    return this.isConnected;
  }

  async getTopicStats(topic: string): Promise<any> {
    try {
      const admin = this.kafka.admin();
      await admin.connect();

      const topicMetadata = await admin.fetchTopicMetadata({ topics: [topic] });

      await admin.disconnect();

      return {
        topic,
        partitions: topicMetadata.topics[0]?.partitions?.length || 0,
        available: true,
      };
    } catch (error) {
      return {
        topic,
        available: false,
        error: error.message,
      };
    }
  }
}

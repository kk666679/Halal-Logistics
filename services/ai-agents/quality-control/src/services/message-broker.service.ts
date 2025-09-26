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
      clientId: 'quality-control-agent',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'quality-control-group' });
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      this.isConnected = true;
      console.log('✅ Quality Control Agent connected to Kafka');
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
      console.log('✅ Quality Control Agent disconnected from Kafka');
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
            key: message.id || `quality_${Date.now()}`,
            value: JSON.stringify({
              ...message,
              source: 'quality-control-agent',
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

  async publishQualityInspection(inspection: any): Promise<void> {
    await this.publish('quality.inspection.completed', {
      id: inspection.id,
      productId: inspection.productId,
      qualityScore: inspection.overallQuality.score,
      defects: inspection.defects,
      recommendations: inspection.recommendations,
      inspectedAt: inspection.inspectedAt,
    });
  }

  async publishQualityAlert(alert: any): Promise<void> {
    await this.publish('quality.alert.generated', {
      id: alert.id,
      type: alert.type,
      priority: alert.priority,
      message: alert.message,
      qualityScore: alert.qualityScore,
      generatedAt: new Date().toISOString(),
    });
  }

  async publishQualityReport(report: any): Promise<void> {
    await this.publish('quality.report.generated', {
      id: report.id,
      type: report.type,
      format: report.format,
      size: report.size,
      downloadUrl: report.downloadUrl,
      generatedAt: report.generatedAt,
    });
  }

  async publishDefectDetection(defect: any): Promise<void> {
    await this.publish('quality.defect.detected', {
      id: defect.id,
      type: defect.type,
      severity: defect.severity,
      location: defect.location,
      confidence: defect.confidence,
      detectedAt: new Date().toISOString(),
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

  async subscribeToProductionEvents(): Promise<void> {
    await this.subscribe('production.batch.completed', async (message) => {
      console.log('Production batch completed:', message);
      // Trigger quality inspection for completed batch
      await this.triggerBatchQualityInspection(message);
    });

    await this.subscribe('production.quality.issue', async (message) => {
      console.log('Production quality issue:', message);
      // Handle production quality issues
      await this.handleProductionQualityIssue(message);
    });
  }

  async subscribeToInventoryEvents(): Promise<void> {
    await this.subscribe('inventory.received', async (message) => {
      console.log('Inventory received:', message);
      // Trigger incoming quality inspection
      await this.triggerIncomingInspection(message);
    });

    await this.subscribe('inventory.shipment.ready', async (message) => {
      console.log('Shipment ready:', message);
      // Trigger pre-shipment quality inspection
      await this.triggerPreShipmentInspection(message);
    });
  }

  async subscribeToCustomerEvents(): Promise<void> {
    await this.subscribe('customer.complaint.received', async (message) => {
      console.log('Customer complaint received:', message);
      // Analyze customer complaint for quality issues
      await this.analyzeCustomerComplaint(message);
    });

    await this.subscribe('customer.return.requested', async (message) => {
      console.log('Customer return requested:', message);
      // Process return request and analyze quality issues
      await this.processReturnRequest(message);
    });
  }

  async subscribeToSupplierEvents(): Promise<void> {
    await this.subscribe('supplier.delivery.received', async (message) => {
      console.log('Supplier delivery received:', message);
      // Inspect supplier delivery quality
      await this.inspectSupplierDelivery(message);
    });

    await this.subscribe('supplier.quality.issue', async (message) => {
      console.log('Supplier quality issue:', message);
      // Handle supplier quality issues
      await this.handleSupplierQualityIssue(message);
    });
  }

  async subscribeToCertificationEvents(): Promise<void> {
    await this.subscribe('certification.status.changed', async (message) => {
      console.log('Certification status changed:', message);
      // Update quality standards based on certification changes
      await this.updateQualityStandards(message);
    });

    await this.subscribe('certification.audit.scheduled', async (message) => {
      console.log('Certification audit scheduled:', message);
      // Prepare for certification audit
      await this.prepareForCertificationAudit(message);
    });
  }

  private async triggerBatchQualityInspection(message: any): Promise<void> {
    // Trigger quality inspection for completed production batch
    await this.publish('quality.inspection.triggered', {
      type: 'batch_inspection',
      batchId: message.batchId,
      priority: 'high',
      triggeredAt: new Date().toISOString(),
    });
  }

  private async handleProductionQualityIssue(message: any): Promise<void> {
    // Handle production quality issues
    await this.publishQualityAlert({
      id: `alert_${Date.now()}`,
      type: 'production_issue',
      priority: 'high',
      message: `Production quality issue: ${message.issue}`,
      qualityScore: message.qualityScore,
    });
  }

  private async triggerIncomingInspection(message: any): Promise<void> {
    // Trigger incoming quality inspection
    await this.publish('quality.inspection.triggered', {
      type: 'incoming_inspection',
      productId: message.productId,
      supplierId: message.supplierId,
      priority: 'medium',
      triggeredAt: new Date().toISOString(),
    });
  }

  private async triggerPreShipmentInspection(message: any): Promise<void> {
    // Trigger pre-shipment quality inspection
    await this.publish('quality.inspection.triggered', {
      type: 'pre_shipment_inspection',
      shipmentId: message.shipmentId,
      priority: 'high',
      triggeredAt: new Date().toISOString(),
    });
  }

  private async analyzeCustomerComplaint(message: any): Promise<void> {
    // Analyze customer complaint for quality issues
    await this.publish('quality.analysis.requested', {
      type: 'complaint_analysis',
      complaintId: message.complaintId,
      priority: 'medium',
      analysisRequired: ['root_cause', 'quality_impact', 'recommendations'],
    });
  }

  private async processReturnRequest(message: any): Promise<void> {
    // Process return request and analyze quality issues
    await this.publish('quality.return.analysis', {
      returnId: message.returnId,
      productId: message.productId,
      reason: message.reason,
      priority: 'medium',
    });
  }

  private async inspectSupplierDelivery(message: any): Promise<void> {
    // Inspect supplier delivery quality
    await this.publish('quality.inspection.triggered', {
      type: 'supplier_inspection',
      deliveryId: message.deliveryId,
      supplierId: message.supplierId,
      priority: 'medium',
      triggeredAt: new Date().toISOString(),
    });
  }

  private async handleSupplierQualityIssue(message: any): Promise<void> {
    // Handle supplier quality issues
    await this.publishQualityAlert({
      id: `alert_${Date.now()}`,
      type: 'supplier_issue',
      priority: 'high',
      message: `Supplier quality issue: ${message.issue}`,
      supplierId: message.supplierId,
    });
  }

  private async updateQualityStandards(message: any): Promise<void> {
    // Update quality standards based on certification changes
    await this.publish('quality.standards.update', {
      certificationId: message.certificationId,
      changes: message.changes,
      effectiveDate: message.effectiveDate,
    });
  }

  private async prepareForCertificationAudit(message: any): Promise<void> {
    // Prepare for certification audit
    await this.publish('quality.audit.preparation', {
      auditId: message.auditId,
      scheduledDate: message.scheduledDate,
      requirements: message.requirements,
      priority: 'high',
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

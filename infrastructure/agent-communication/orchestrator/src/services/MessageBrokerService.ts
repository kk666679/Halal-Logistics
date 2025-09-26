import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';
import { Redis } from 'ioredis';
import * as amqp from 'amqplib';
import { logger } from '../utils/logger';
import { Message, AgentRequest, AgentResponse, EventData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class MessageBrokerService {
  private kafka!: Kafka;
  private producer!: Producer;
  private consumer!: Consumer;
  private redis!: Redis;
  private rabbitConnection!: any;
  private rabbitChannel!: any;

  private requestQueue: string = 'agent-requests';
  private responseQueue: string = 'agent-responses';
  private eventExchange: string = 'agent-events';

  private messageHandlers: Map<string, (message: Message) => Promise<void>> = new Map();
  private pendingRequests: Map<string, { resolve: Function; reject: Function; timeout: NodeJS.Timeout }> = new Map();

  constructor() {
    this.initializeServices();
  }

  private async initializeServices() {
    try {
      // Initialize Kafka
      await this.initializeKafka();

      // Initialize Redis
      await this.initializeRedis();

      // Initialize RabbitMQ
      await this.initializeRabbitMQ();

      logger.info('Message broker services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize message broker services:', error);
      throw error;
    }
  }

  private async initializeKafka() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || 'agent-orchestrator',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID || 'agent-orchestrator-group'
    });

    await this.producer.connect();
    await this.consumer.connect();

    // Subscribe to response topics
    await this.consumer.subscribe({ topic: 'agent-responses', fromBeginning: false });
    await this.consumer.subscribe({ topic: 'agent-events', fromBeginning: false });

    // Set up message handler
    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        await this.handleKafkaMessage(payload);
      },
    });

    logger.info('Kafka initialized successfully');
  }

  private async initializeRedis() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
    });

    this.redis.on('connect', () => logger.info('Redis connected'));
    this.redis.on('error', (error) => logger.error('Redis error:', error));

    logger.info('Redis initialized successfully');
  }

  private async initializeRabbitMQ() {
    const connection = await amqp.connect({
      hostname: process.env.RABBITMQ_HOST || 'localhost',
      port: parseInt(process.env.RABBITMQ_PORT || '5672'),
      username: process.env.RABBITMQ_USERNAME || 'guest',
      password: process.env.RABBITMQ_PASSWORD || 'guest',
      vhost: process.env.RABBITMQ_VHOST || '/',
    });

    this.rabbitConnection = connection;
    this.rabbitChannel = await connection.createChannel();

    // Declare queues and exchange
    await this.rabbitChannel.assertQueue(this.requestQueue, { durable: true });
    await this.rabbitChannel.assertQueue(this.responseQueue, { durable: true });
    await this.rabbitChannel.assertExchange(this.eventExchange, 'topic', { durable: true });

    // Set up consumer
    await this.rabbitChannel.consume(this.responseQueue, async (msg: any) => {
      if (msg) {
        await this.handleRabbitMQMessage(msg);
        this.rabbitChannel.ack(msg);
      }
    });

    logger.info('RabbitMQ initialized successfully');
  }

  private async handleKafkaMessage(payload: EachMessagePayload) {
    try {
      const message: Message = JSON.parse(payload.message.value?.toString() || '{}');
      await this.processMessage(message);
    } catch (error) {
      logger.error('Error handling Kafka message:', error);
    }
  }

  private async handleRabbitMQMessage(msg: any) {
    try {
      const message: Message = JSON.parse(msg.content.toString());
      await this.processMessage(message);
    } catch (error) {
      logger.error('Error handling RabbitMQ message:', error);
    }
  }

  private async processMessage(message: Message) {
    logger.debug('Processing message:', { id: message.id, type: message.type, topic: message.topic });

    // Handle different message types
    switch (message.type) {
      case 'response':
        await this.handleResponse(message.payload as AgentResponse);
        break;
      case 'event':
        await this.handleEvent(message.payload as EventData);
        break;
      case 'heartbeat':
        await this.handleHeartbeat(message);
        break;
      default:
        logger.warn('Unknown message type:', message.type);
    }
  }

  private async handleResponse(response: AgentResponse) {
    const pendingRequest = this.pendingRequests.get(response.requestId);
    if (pendingRequest) {
      clearTimeout(pendingRequest.timeout);
      this.pendingRequests.delete(response.requestId);

      if (response.success) {
        pendingRequest.resolve(response);
      } else {
        pendingRequest.reject(new Error(response.error || 'Unknown error'));
      }
    }
  }

  private async handleEvent(event: EventData) {
    // Store event in Redis for analytics
    await this.redis.lpush('agent-events', JSON.stringify(event));
    await this.redis.ltrim('agent-events', 0, 999); // Keep last 1000 events

    // Emit to WebSocket clients if needed
    // This would be handled by the main orchestrator
  }

  private async handleHeartbeat(message: Message) {
    // Update agent heartbeat in Redis
    await this.redis.setex(`agent-heartbeat:${message.source}`, 60, JSON.stringify({
      timestamp: message.timestamp,
      payload: message.payload,
    }));
  }

  /**
   * Send request to agent
   */
  async sendRequest(agentId: string, request: AgentRequest): Promise<AgentResponse> {
    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(request.id);
        reject(new Error(`Request timeout after ${request.timeout}ms`));
      }, request.timeout);

      this.pendingRequests.set(request.id, { resolve, reject, timeout });

      try {
        const message: Message = {
          id: request.id,
          topic: `agent-request-${agentId}`,
          type: 'request',
          source: 'orchestrator',
          destination: agentId,
          payload: request,
          priority: request.priority,
          timestamp: new Date(),
          ttl: request.timeout,
        };

        // Send via Kafka
        await this.producer.send({
          topic: `agent-request-${agentId}`,
          messages: [{ value: JSON.stringify(message) }],
        });

        // Also send via RabbitMQ for redundancy
        await this.rabbitChannel.publish(
          '',
          this.requestQueue,
          Buffer.from(JSON.stringify(message)),
          { messageId: request.id }
        );

        logger.debug('Request sent to agent:', { agentId, requestId: request.id });
      } catch (error) {
        clearTimeout(timeout);
        this.pendingRequests.delete(request.id);
        reject(error);
      }
    });
  }

  /**
   * Publish event
   */
  async publishEvent(topic: string, event: EventData): Promise<void> {
    try {
      const message: Message = {
        id: uuidv4(),
        topic,
        type: 'event',
        source: 'orchestrator',
        payload: event,
        priority: 1,
        timestamp: new Date(),
      };

      // Publish via Kafka
      await this.producer.send({
        topic: 'agent-events',
        messages: [{ value: JSON.stringify(message) }],
      });

      // Publish via RabbitMQ
      await this.rabbitChannel.publish(
        this.eventExchange,
        topic,
        Buffer.from(JSON.stringify(message))
      );

      logger.debug('Event published:', { topic, eventType: event.type });
    } catch (error) {
      logger.error('Failed to publish event:', error);
    }
  }

  /**
   * Subscribe to messages
   */
  async subscribe(topic: string, handler: (message: Message) => Promise<void>): Promise<void> {
    this.messageHandlers.set(topic, handler);

    // Subscribe to Kafka topic
    await this.consumer.subscribe({ topic, fromBeginning: false });

    logger.info('Subscribed to topic:', topic);
  }

  /**
   * Unsubscribe from messages
   */
  async unsubscribe(topic: string): Promise<void> {
    this.messageHandlers.delete(topic);
    logger.info('Unsubscribed from topic:', topic);
  }

  /**
   * Get agent heartbeat
   */
  async getAgentHeartbeat(agentId: string): Promise<any | null> {
    try {
      const heartbeat = await this.redis.get(`agent-heartbeat:${agentId}`);
      return heartbeat ? JSON.parse(heartbeat) : null;
    } catch (error) {
      logger.error('Failed to get agent heartbeat:', error);
      return null;
    }
  }

  /**
   * Get recent events
   */
  async getRecentEvents(limit: number = 100): Promise<EventData[]> {
    try {
      const events = await this.redis.lrange('agent-events', 0, limit - 1);
      return events.map(event => JSON.parse(event));
    } catch (error) {
      logger.error('Failed to get recent events:', error);
      return [];
    }
  }

  /**
   * Store message in Redis for debugging
   */
  async storeMessage(message: Message): Promise<void> {
    try {
      await this.redis.lpush('message-log', JSON.stringify(message));
      await this.redis.ltrim('message-log', 0, 9999); // Keep last 10000 messages
    } catch (error) {
      logger.error('Failed to store message:', error);
    }
  }

  /**
   * Get message statistics
   */
  async getMessageStats(): Promise<{
    pendingRequests: number;
    totalEvents: number;
    kafkaMessages: number;
    rabbitMessages: number;
  }> {
    try {
      const [pendingRequests, totalEvents, kafkaMessages, rabbitMessages] = await Promise.all([
        this.redis.llen('agent-requests'),
        this.redis.llen('agent-events'),
        this.redis.llen('kafka-messages'),
        this.redis.llen('rabbit-messages'),
      ]);

      return {
        pendingRequests,
        totalEvents,
        kafkaMessages,
        rabbitMessages,
      };
    } catch (error) {
      logger.error('Failed to get message stats:', error);
      return {
        pendingRequests: 0,
        totalEvents: 0,
        kafkaMessages: 0,
        rabbitMessages: 0,
      };
    }
  }

  /**
   * Start the message broker service
   */
  async start(): Promise<void> {
    // Services are already initialized in constructor
    logger.info('Message broker service started');
  }

  /**
   * Stop the message broker service
   */
  async stop(): Promise<void> {
    try {
      // Close Kafka connections
      await this.producer.disconnect();
      await this.consumer.disconnect();

      // Close Redis connection
      await this.redis.quit();

      // Close RabbitMQ connection
      await this.rabbitChannel.close();
      await this.rabbitConnection.close();

      logger.info('Message broker service stopped');
    } catch (error) {
      logger.error('Error stopping message broker service:', error);
    }
  }
}

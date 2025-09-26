# Agent Communication Infrastructure

This directory contains the infrastructure components for inter-agent communication in the Halal Logistics Multi AI Agent System.

## Components

### 1. Message Queue (Kafka/RabbitMQ)
- **Purpose**: Enables asynchronous communication between AI agents
- **Features**:
  - Event-driven architecture
  - Message persistence and reliability
  - Scalable message routing
  - Dead letter queues for failed messages

### 2. Agent Orchestration System
- **Purpose**: Coordinates interactions between different AI agents
- **Features**:
  - Request routing and load balancing
  - Agent discovery and registration
  - Priority-based task distribution
  - Conflict resolution mechanisms

### 3. Shared Memory (Redis)
- **Purpose**: Provides fast, in-memory data sharing between agents
- **Features**:
  - Session management
  - Caching of frequently accessed data
  - Pub/sub messaging for real-time updates
  - Distributed locking for resource management

### 4. Load Balancer
- **Purpose**: Distributes workload across multiple agent instances
- **Features**:
  - Health checks and failover
  - Dynamic agent scaling
  - Request prioritization
  - Geographic load distribution

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   AI Agents     │    │   Orchestrator   │    │  Message Queue  │
│                 │    │                  │    │                 │
│ • Certification │◄──►│ • Route requests │◄──►│ • Kafka        │
│ • Logistics     │    │ • Load balance   │    │ • RabbitMQ      │
│ • Blockchain    │    │ • Monitor health │    │                 │
│ • Compliance    │    │ • Handle failures│    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌──────────────────┐
                    │   Shared Memory  │
                    │                  │
                    │ • Redis Cluster  │
                    │ • Session store  │
                    │ • Cache layer    │
                    │ • Pub/Sub        │
                    └──────────────────┘
```

## Setup Instructions

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for management scripts)
- kubectl (for Kubernetes deployment)

### Quick Start with Docker Compose

1. **Navigate to infrastructure directory:**
```bash
cd infrastructure/agent-communication
```

2. **Start all services:**
```bash
docker-compose up -d
```

3. **Check service status:**
```bash
docker-compose ps
```

4. **View logs:**
```bash
docker-compose logs -f kafka
docker-compose logs -f redis
```

### Individual Service Setup

#### Kafka Setup
```bash
# Start Zookeeper
docker run -d --name zookeeper -p 2181:2181 confluentinc/cp-zookeeper:7.4.0 \
  -e ZOOKEEPER_CLIENT_PORT=2181 \
  -e ZOOKEEPER_TICK_TIME=2000

# Start Kafka
docker run -d --name kafka -p 9092:9092 \
  --link zookeeper:zookeeper \
  confluentinc/cp-kafka:7.4.0 \
  -e KAFKA_BROKER_ID=1 \
  -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT \
  -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
```

#### Redis Setup
```bash
# Start Redis
docker run -d --name redis -p 6379:6379 redis:7.2-alpine

# Or with clustering
docker run -d --name redis-cluster \
  -p 7000-7005:7000-7005 \
  grokzen/redis-cluster:7.2.0
```

#### RabbitMQ Setup
```bash
# Start RabbitMQ
docker run -d --name rabbitmq \
  -p 5672:5672 -p 15672:15672 \
  rabbitmq:3.12-management-alpine
```

## Configuration

### Environment Variables

Create a `.env` file in the infrastructure directory:

```env
# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=halal-logistics-agent
KAFKA_GROUP_ID=agent-consumers

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_DB=0

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=admin
RABBITMQ_PASSWORD=admin123
RABBITMQ_VHOST=/

# Orchestrator Configuration
ORCHESTRATOR_PORT=3011
ORCHESTRATOR_HOST=localhost
AGENT_TIMEOUT=30000
MAX_RETRIES=3

# Load Balancer Configuration
LOAD_BALANCER_ALGORITHM=round-robin
HEALTH_CHECK_INTERVAL=10000
FAILOVER_THRESHOLD=3
```

### Agent Registration

Agents must register with the orchestrator to participate in the system:

```typescript
// Example agent registration
const agentInfo = {
  id: 'blockchain-agent',
  name: 'Blockchain Agent',
  type: 'blockchain',
  capabilities: ['smart-contracts', 'ipfs', 'oracles'],
  endpoints: {
    health: 'http://localhost:3026/health',
    api: 'http://localhost:3026/api/v1'
  },
  priority: 1,
  maxConcurrency: 10
};

await orchestrator.registerAgent(agentInfo);
```

## Usage Examples

### Publishing Messages to Kafka

```typescript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'halal-logistics',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

await producer.connect();
await producer.send({
  topic: 'agent-requests',
  messages: [
    {
      key: 'certification-request',
      value: JSON.stringify({
        agentId: 'certification-agent',
        requestId: 'req-123',
        data: { productId: 'PROD-001' }
      })
    }
  ]
});
```

### Consuming Messages from RabbitMQ

```typescript
import * as amqp from 'amqplib';

const connection = await amqp.connect('amqp://localhost');
const channel = await connection.createChannel();

await channel.assertQueue('agent-responses', { durable: true });

channel.consume('agent-responses', (msg) => {
  if (msg) {
    const response = JSON.parse(msg.content.toString());
    console.log('Received response:', response);
    channel.ack(msg);
  }
});
```

### Using Redis for Caching

```typescript
import { Redis } from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379
});

// Set cache with expiration
await redis.setex('cert:HALAL-2024-001', 3600, JSON.stringify(certificateData));

// Get from cache
const cachedData = await redis.get('cert:HALAL-2024-001');
```

## Monitoring and Management

### Health Checks
- Kafka: Check broker status and topic partitions
- Redis: Monitor memory usage and connection count
- RabbitMQ: Check queue lengths and consumer status
- Orchestrator: Monitor agent health and response times

### Management Scripts

```bash
# Create Kafka topics
node scripts/create-topics.js

# Register agents
node scripts/register-agents.js

# Health check all services
node scripts/health-check.js

# Scale agents
node scripts/scale-agents.js
```

## Security Considerations

1. **Network Security**: Use TLS for all inter-service communication
2. **Authentication**: Implement API keys or JWT for agent registration
3. **Authorization**: Role-based access control for different agent types
4. **Encryption**: Encrypt sensitive data in messages and cache
5. **Auditing**: Log all inter-agent communications for compliance

## Troubleshooting

### Common Issues

1. **Message Loss**: Check Kafka retention settings and consumer group offsets
2. **High Latency**: Monitor Redis performance and network latency
3. **Agent Failures**: Check orchestrator logs and agent health endpoints
4. **Memory Issues**: Monitor Redis memory usage and set appropriate limits

### Debug Commands

```bash
# Kafka
kafka-console-consumer --bootstrap-server localhost:9092 --topic agent-requests --from-beginning

# Redis
redis-cli monitor

# RabbitMQ
rabbitmqctl list_queues

# Docker logs
docker-compose logs -f orchestrator
```

## Scaling

### Horizontal Scaling
- Add more Kafka brokers for higher throughput
- Deploy Redis cluster for better performance
- Run multiple instances of each agent type
- Use load balancer for request distribution

### Vertical Scaling
- Increase memory and CPU for individual services
- Optimize message batch sizes
- Tune Redis configuration for workload

## Integration with AI Agents

Each AI agent should:

1. **Register** with the orchestrator on startup
2. **Subscribe** to relevant message topics
3. **Publish** responses and events to appropriate queues
4. **Use Redis** for caching and session management
5. **Implement health checks** for monitoring

## Next Steps

1. Set up monitoring and alerting for all services
2. Implement automated failover mechanisms
3. Add rate limiting and throttling
4. Set up backup and disaster recovery
5. Conduct performance testing with realistic loads

---

For more detailed information, see the individual service documentation in their respective directories.

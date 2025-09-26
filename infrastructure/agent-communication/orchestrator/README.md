# Agent Orchestrator

The Agent Orchestrator is the central coordination system for the Halal Logistics AI Agents ecosystem. It provides intelligent routing, load balancing, health monitoring, and real-time communication between various AI agents and services.

## Features

- **Agent Registration & Management**: Register, track, and manage AI agents
- **Intelligent Load Balancing**: Route requests to optimal agents based on various algorithms
- **Health Monitoring**: Continuous health checks and failure detection
- **Message Broker Integration**: Support for Kafka, Redis, and RabbitMQ
- **Real-time Metrics**: Comprehensive monitoring and analytics
- **WebSocket Support**: Real-time communication with clients
- **RESTful API**: Complete API for agent management and monitoring
- **Fault Tolerance**: Automatic failover and recovery mechanisms

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Agents     │    │   Load Balancer │    │  Health Checks  │
│                 │    │                 │    │                 │
│ • Blockchain    │◄──►│ • Round Robin   │    │ • HTTP Endpoints│
│ • Certification │    │ • Least Conn    │◄──►│ • Response Time │
│ • Logistics     │    │ • Weighted      │    │ • Error Rates   │
│ • Tracking      │    │ • Random        │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Message Broker  │
                    │                 │
                    │ • Kafka        │
                    │ • Redis        │
                    │ • RabbitMQ     │
                    │                 │
                    └─────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for message brokers)
- Redis, Kafka, and RabbitMQ (or use Docker Compose)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start message brokers (using Docker Compose):**
   ```bash
   cd ../
   docker-compose up -d
   ```

3. **Build the orchestrator:**
   ```bash
   npm run build
   ```

4. **Start the orchestrator:**
   ```bash
   npm start
   ```

### Development Mode

```bash
# Start with auto-reload
npm run dev

# Or with nodemon
npm run dev:watch
```

## Configuration

Configure the orchestrator using environment variables:

```bash
# Server Configuration
PORT=3011
FRONTEND_URL=http://localhost:3000

# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=agent-orchestrator
KAFKA_GROUP_ID=agent-orchestrator-group

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# RabbitMQ Configuration
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USERNAME=guest
RABBITMQ_PASSWORD=guest
RABBITMQ_VHOST=/

# Load Balancer Configuration
LOAD_BALANCER_ALGORITHM=round-robin
HEALTH_CHECK_INTERVAL=30000
FAILOVER_THRESHOLD=3
MAX_RETRIES=3
AGENT_TIMEOUT=30000

# Metrics Configuration
METRICS_INTERVAL=60000

# Security
ORCHESTRATOR_SECRET=your-secret-key
```

## API Documentation

### Agent Management

#### Register Agent
```http
POST /api/v1/agents/register
Content-Type: application/json

{
  "agentInfo": {
    "name": "Blockchain Agent",
    "type": "blockchain",
    "version": "1.0.0",
    "capabilities": ["blockchain", "smart-contracts", "transactions"],
    "endpoints": {
      "health": "http://localhost:3001/health",
      "api": "http://localhost:3001/api"
    },
    "priority": 1,
    "maxConcurrency": 10
  }
}
```

#### Get All Agents
```http
GET /api/v1/agents
```

#### Get Agent by ID
```http
GET /api/v1/agents/{agentId}
```

#### Update Agent Status
```http
PUT /api/v1/agents/{agentId}/status
Content-Type: application/json

{
  "state": "online",
  "load": 75,
  "activeRequests": 5
}
```

#### Unregister Agent
```http
DELETE /api/v1/agents/{agentId}
```

### Request Routing

#### Route Request to Agent
```http
POST /api/v1/agents/request
Content-Type: application/json

{
  "type": "blockchain-transaction",
  "payload": {
    "data": "transaction details"
  },
  "priority": 1,
  "timeout": 30000,
  "metadata": {
    "requiredCapabilities": ["blockchain"],
    "agentType": "blockchain"
  }
}
```

### Health Monitoring

#### System Health
```http
GET /api/v1/health
```

#### Detailed Health
```http
GET /api/v1/health/detailed
```

#### Agent Health Report
```http
GET /api/v1/health/agent/{agentId}
```

#### Force Health Check
```http
POST /api/v1/health/agent/{agentId}/check
```

### Metrics & Analytics

#### System Metrics
```http
GET /api/v1/metrics/system
```

#### Agent Metrics
```http
GET /api/v1/metrics/agent/{agentId}?minutes=60
```

#### Performance Summary
```http
GET /api/v1/metrics/performance
```

#### Metrics Trends
```http
GET /api/v1/metrics/trends
```

#### Export Metrics
```http
GET /api/v1/metrics/export?format=csv
```

## WebSocket Events

Connect to the WebSocket server for real-time updates:

```javascript
const socket = io('http://localhost:3011');

socket.on('connect', () => {
  console.log('Connected to orchestrator');
});

// Subscribe to agent status updates
socket.emit('subscribe-agent-status', 'agent-id');

// Listen for agent status changes
socket.on('agent-status-update', (data) => {
  console.log('Agent status updated:', data);
});
```

## Load Balancing Algorithms

### Round Robin
Distributes requests evenly across all available agents.

### Least Connections
Routes requests to the agent with the fewest active connections.

### Weighted
Routes requests based on agent priority weights.

### Random
Randomly selects an available agent.

## Health Checks

The orchestrator performs continuous health checks on all registered agents:

- **HTTP Health Checks**: Validates agent endpoints
- **Response Time Monitoring**: Tracks agent performance
- **Error Rate Tracking**: Monitors failure patterns
- **Automatic Failover**: Routes traffic away from unhealthy agents

## Monitoring & Observability

### Metrics Collected
- Request count and throughput
- Error rates and patterns
- Response times and latency
- Agent load and utilization
- System resource usage

### Logging
All orchestrator activities are logged using Winston with configurable levels:

```javascript
logger.info('Agent registered successfully');
logger.warn('High error rate detected');
logger.error('Agent health check failed');
```

## Docker Deployment

### Build Docker Image
```bash
npm run docker:build
```

### Run with Docker
```bash
npm run docker:run
```

### Docker Compose
```yaml
version: '3.8'
services:
  orchestrator:
    image: halal-logistics/orchestrator
    ports:
      - "3011:3011"
    environment:
      - PORT=3011
      - REDIS_HOST=redis
      - KAFKA_BROKERS=kafka:9092
      - RABBITMQ_HOST=rabbitmq
    depends_on:
      - redis
      - kafka
      - rabbitmq
```

## Development

### Project Structure
```
src/
├── index.ts                 # Main application entry point
├── types/
│   └── index.ts            # TypeScript type definitions
├── services/
│   ├── AgentRegistryService.ts    # Agent registration & management
│   ├── MessageBrokerService.ts    # Message broker integration
│   ├── LoadBalancerService.ts     # Request routing & load balancing
│   ├── HealthCheckService.ts      # Health monitoring
│   └── MetricsService.ts          # Metrics collection & analytics
├── routes/
│   ├── agentRoutes.ts      # Agent management endpoints
│   ├── healthRoutes.ts     # Health check endpoints
│   └── metricsRoutes.ts    # Metrics endpoints
├── middleware/
│   ├── errorHandler.ts     # Error handling middleware
│   └── notFoundHandler.ts  # 404 handler
└── utils/
    └── logger.ts           # Logging configuration
```

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Security Considerations

- **Authentication**: Implement proper authentication for agent registration
- **Authorization**: Add role-based access control for API endpoints
- **Rate Limiting**: Configured to prevent abuse
- **Input Validation**: All inputs are validated and sanitized
- **HTTPS**: Use TLS in production environments
- **Secrets Management**: Store sensitive configuration securely

## Troubleshooting

### Common Issues

1. **Agents not registering**: Check message broker connectivity
2. **High response times**: Monitor agent health and load
3. **Connection timeouts**: Verify network configuration
4. **Memory issues**: Check metrics and scale if necessary

### Debug Mode
Enable debug logging by setting:
```bash
LOG_LEVEL=debug
```

### Health Check Failures
- Verify agent endpoints are accessible
- Check network connectivity
- Review agent logs for errors
- Monitor system resources

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

UNLICENSED - This project is proprietary software.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

---

**HalalChain Team** - Building the future of Halal logistics with AI

# Analytics Agent

## Overview

The Analytics Agent is a sophisticated AI-powered analytics service that provides predictive insights, performance monitoring, and intelligent reporting across the entire Halal Logistics Multi AI Agent System. It leverages machine learning algorithms to forecast trends, identify optimization opportunities, and generate actionable business intelligence.

## Features

### 📊 **Dashboard & Reporting**
- **Real-time Dashboard**: Comprehensive overview of all agent performance
- **Custom Reports**: Generate tailored reports with flexible parameters
- **Interactive Charts**: Visual data representation with Chart.js integration
- **Scheduled Reports**: Automated report generation and distribution

### 🔮 **Predictive Analytics**
- **Demand Forecasting**: Predict future demand patterns using ML models
- **Performance Predictions**: Forecast system performance and bottlenecks
- **Compliance Predictions**: Anticipate compliance risks and requirements
- **Risk Assessment**: Identify potential issues before they impact operations

### 📈 **Performance Monitoring**
- **KPI Tracking**: Monitor key performance indicators across all agents
- **Real-time Metrics**: Live system performance data collection
- **Trend Analysis**: Historical data analysis with trend identification
- **Alert System**: Intelligent alerting based on configurable thresholds

### 🎯 **Business Intelligence**
- **Insight Generation**: AI-powered insights and recommendations
- **Pattern Recognition**: Identify patterns in operational data
- **Optimization Suggestions**: Data-driven recommendations for improvement
- **Comparative Analysis**: Cross-agent performance comparisons

## API Endpoints

### Public Endpoints

- `GET /api/v1/analytics/health` - Health check endpoint
- `GET /api/v1/analytics/status` - Service status information

### Protected Endpoints (Requires JWT Authentication)

#### Dashboard & Overview
- `GET /api/v1/analytics/dashboard` - Main dashboard data
- `GET /api/v1/analytics/performance` - Performance metrics
- `GET /api/v1/analytics/kpi` - Key performance indicators

#### Predictive Analytics
- `GET /api/v1/analytics/predictions` - ML predictions and forecasts
- `GET /api/v1/analytics/trends` - Trend analysis data
- `GET /api/v1/analytics/insights` - AI-generated insights

#### Reporting
- `GET /api/v1/analytics/reports` - List available reports
- `POST /api/v1/analytics/report/generate` - Generate custom reports
- `GET /api/v1/analytics/reports/{id}/download` - Download generated reports

#### Alerts & Monitoring
- `GET /api/v1/analytics/alerts` - Active alerts and notifications
- `POST /api/v1/analytics/alert/configure` - Configure alert thresholds

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3014` |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | JWT signing secret | Required |
| `KAFKA_BROKERS` | Kafka broker URLs | `localhost:9092` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `ORCHESTRATOR_URL` | Orchestrator service URL | `http://localhost:3011` |
| `BLOCKCHAIN_API_URL` | Blockchain agent API URL | `http://localhost:3026/api/v1` |
| `COMPLIANCE_API_URL` | Compliance agent API URL | `http://localhost:3013/api/v1` |
| `DATABASE_URL` | Database connection string | Required |
| `ANALYTICS_RETENTION_DAYS` | Data retention period | `90` |
| `PREDICTION_MODEL_VERSION` | ML model version | `v2.1.0` |
| `REPORT_GENERATION_TIMEOUT` | Report timeout (ms) | `300000` |
| `CHART_CACHE_TTL` | Chart cache duration (s) | `3600` |
| `METRICS_COLLECTION_INTERVAL` | Metrics collection interval (ms) | `30000` |
| `ALERT_THRESHOLD_CPU` | CPU alert threshold (%) | `80` |
| `ALERT_THRESHOLD_MEMORY` | Memory alert threshold (%) | `85` |

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the service:
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## Configuration

### Kafka Topics

The Analytics Agent subscribes to and publishes on the following Kafka topics:

- **analytics.events** - Incoming analytics events
- **analytics.metrics** - Performance metrics data
- **analytics.predictions** - Prediction results
- **analytics.alerts** - Alert notifications
- **analytics.reports** - Report generation events

### Redis Keys

- `analytics:metrics:{agentId}` - Agent-specific metrics
- `analytics:predictions:{type}` - Prediction results cache
- `analytics:reports:{reportId}` - Generated reports
- `analytics:alerts:config` - Alert configuration
- `analytics:dashboard:cache` - Dashboard data cache

### ML Models

The Analytics Agent uses several machine learning models:

- **Demand Forecasting Model**: LSTM-based neural network
- **Performance Prediction Model**: Random Forest regression
- **Anomaly Detection Model**: Isolation Forest algorithm
- **Risk Assessment Model**: Gradient Boosting classifier

## Integration with Other Agents

### Orchestrator Integration

- **Metrics Collection**: Real-time metrics from all agents
- **Health Monitoring**: Agent health status aggregation
- **Load Balancing**: Performance-based load distribution
- **Alert Coordination**: Centralized alert management

### Blockchain Agent Integration

- **Transaction Analytics**: Blockchain transaction pattern analysis
- **Certification Tracking**: Halal certification lifecycle analytics
- **Supply Chain Insights**: End-to-end supply chain visibility
- **Cost Analysis**: Transaction cost optimization

### Compliance Agent Integration

- **Regulatory Analytics**: Compliance trend analysis
- **Risk Prediction**: Compliance risk forecasting
- **Audit Trail Analysis**: Historical compliance data analysis
- **Certification Expiry Alerts**: Proactive certification management

## Security

- **JWT Authentication**: Secure API access with role-based permissions
- **Data Encryption**: Sensitive analytics data encryption at rest
- **Audit Logging**: Comprehensive audit trail for all operations
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Strict input validation and sanitization

## Monitoring and Logging

### Metrics Collection

- **System Metrics**: CPU, memory, disk usage
- **Application Metrics**: Response times, error rates, throughput
- **Business Metrics**: Transaction volumes, compliance scores
- **Custom Metrics**: Agent-specific performance indicators

### Alert System

- **Threshold-based Alerts**: Configurable alert thresholds
- **Anomaly Detection**: ML-based anomaly detection
- **Predictive Alerts**: Early warning system
- **Notification Channels**: Email, webhook, dashboard notifications

## Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Code Quality

```bash
# Linting
npm run lint

# Format code
npm run format
```

### API Testing

The service includes comprehensive API testing with:
- Unit tests for all service methods
- Integration tests for API endpoints
- Performance tests for analytics operations
- Mock data for testing predictions

## Deployment

### Docker

```bash
# Build image
docker build -t analytics-agent .

# Run container
docker run -p 3014:3014 analytics-agent
```

### Kubernetes

```bash
# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Apply service
kubectl apply -f k8s/service.yaml

# Apply config map
kubectl apply -f k8s/configmap.yaml
```

## API Documentation

Full API documentation is available at `/api` when the service is running, or can be imported from the included Postman collection.

## Data Models

### Analytics Data Structure

```typescript
interface AnalyticsData {
  timestamp: Date;
  agentId: string;
  metrics: {
    requests: number;
    responseTime: number;
    errors: number;
    throughput: number;
  };
  predictions: {
    demand: number;
    confidence: number;
  };
  alerts: Alert[];
}
```

### Prediction Model

```typescript
interface Prediction {
  type: 'demand' | 'performance' | 'compliance' | 'risk';
  value: number;
  confidence: number;
  timeframe: string;
  factors: string[];
  modelVersion: string;
}
```

## Troubleshooting

### Common Issues

1. **Kafka Connection Issues**
   - Verify Kafka brokers are running
   - Check network connectivity
   - Review Kafka configuration

2. **Memory Issues**
   - Monitor memory usage in production
   - Adjust caching TTL values
   - Consider data archiving for old analytics

3. **Prediction Accuracy**
   - Retrain models with more data
   - Adjust model parameters
   - Validate prediction algorithms

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=analytics-agent:*
LOG_LEVEL=debug
```

## Performance Optimization

### Caching Strategy

- **Redis Caching**: Dashboard data, predictions, and reports
- **Memory Caching**: Frequently accessed metrics
- **CDN Integration**: Static charts and reports
- **Database Indexing**: Optimized queries for analytics data

### Scalability Considerations

- **Horizontal Scaling**: Multiple analytics agent instances
- **Data Partitioning**: Shard analytics data by agent/time
- **Load Balancing**: Distribute requests across instances
- **Async Processing**: Background report generation

## Contributing

1. Follow the established code style and architecture patterns
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure all tests pass before submitting PR
5. Consider performance impact of new features

## License

This project is part of the Halal Logistics Multi AI Agent System and follows the same licensing terms.

## Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Monitor system logs for errors
- Contact the development team for complex issues

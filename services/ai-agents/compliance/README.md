# Compliance Agent

## Overview

The Compliance Agent is a critical component of the Halal Logistics Multi AI Agent System, responsible for monitoring and ensuring regulatory compliance across all operations. It integrates with government APIs (JAKIM, HALAL DEVELOPMENT, ICA) to validate certifications and maintain audit trails.

## Features

- **Regulatory Monitoring**: Real-time monitoring of compliance status
- **Government Integration**: Direct API integration with regulatory bodies
- **Audit Trail Management**: Comprehensive logging of all compliance activities
- **Automated Reporting**: Scheduled compliance reports and alerts
- **Certification Validation**: Real-time validation of halal certifications
- **Risk Assessment**: Automated risk scoring based on compliance factors

## API Endpoints

### Public Endpoints

- `GET /api/v1/compliance/status` - Get current compliance status
- `GET /api/v1/compliance/regulations` - Get list of active regulations
- `GET /api/v1/compliance/certifications` - Get current certifications

### Protected Endpoints (Requires JWT Authentication)

- `POST /api/v1/compliance/check` - Perform compliance check
- `POST /api/v1/compliance/report` - Generate compliance report
- `GET /api/v1/compliance/audit/:id` - Get audit trail for specific entity

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3013` |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | JWT signing secret | Required |
| `KAFKA_BROKERS` | Kafka broker URLs | `localhost:9092` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `ORCHESTRATOR_URL` | Orchestrator service URL | `http://localhost:3011` |
| `JAKIM_API_URL` | JAKIM API endpoint | Required |
| `HALAL_DEV_API_URL` | HALAL DEVELOPMENT API endpoint | Required |
| `ICA_API_URL` | ICA API endpoint | Required |
| `DATABASE_URL` | Database connection string | Required |

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

The Compliance Agent subscribes to and publishes on the following Kafka topics:

- **compliance.events** - Incoming compliance events
- **compliance.check.completed** - Compliance check results
- **compliance.report.generated** - Report generation notifications
- **compliance.violation.detected** - Compliance violations

### Redis Keys

- `compliance:status:{entityId}` - Current compliance status
- `compliance:audit:{entityId}` - Audit trail data
- `compliance:reports:{reportId}` - Generated reports

## Integration with Other Agents

### Orchestrator Integration

The Compliance Agent communicates with the Orchestrator for:
- Agent registration and health checks
- Load balancing and failover
- Metrics collection and monitoring

### Blockchain Agent Integration

Integration points:
- Certification validation on blockchain
- Supply chain compliance verification
- Immutable audit trail storage

## Security

- JWT-based authentication for protected endpoints
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration for frontend integration
- Secure communication with government APIs

## Monitoring and Logging

- Comprehensive logging with structured JSON format
- Health check endpoints for monitoring
- Metrics collection for performance tracking
- Error tracking and alerting

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

## Deployment

### Docker

```bash
# Build image
docker build -t compliance-agent .

# Run container
docker run -p 3013:3013 compliance-agent
```

### Kubernetes

```bash
# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Apply service
kubectl apply -f k8s/service.yaml
```

## API Documentation

Full API documentation is available at `/api` when the service is running, or can be imported from the included Postman collection.

## Troubleshooting

### Common Issues

1. **Kafka Connection Issues**
   - Verify Kafka brokers are running
   - Check network connectivity
   - Review Kafka configuration

2. **Database Connection Errors**
   - Verify database credentials
   - Check database server status
   - Ensure proper permissions

3. **Government API Integration**
   - Verify API keys and endpoints
   - Check rate limits and quotas
   - Monitor API response times

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=compliance-agent:*
```

## Contributing

1. Follow the established code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass before submitting PR

## License

This project is part of the Halal Logistics Multi AI Agent System and follows the same licensing terms.

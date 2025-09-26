# HALAL DEVELOPMENT Integration Service

A comprehensive API integration service for HALAL DEVELOPMENT Corporation compliance, certification, and audit management.

## Overview

The HALAL DEVELOPMENT Integration Service provides seamless integration with the HALAL DEVELOPMENT Corporation's API for:
- Halal certification management
- Compliance checking and validation
- Audit logging and tracking
- Real-time compliance monitoring
- Certificate lifecycle management

## Features

### 🔍 Compliance Management
- Real-time compliance checking against HALAL DEVELOPMENT standards
- Automated compliance scoring and reporting
- Violation detection and reporting
- Compliance dashboard with metrics and trends

### 📋 Certification Services
- Certificate validation and verification
- Application submission and tracking
- Certificate lifecycle management
- Renewal notifications and alerts

### 📊 Audit & Logging
- Comprehensive audit trail management
- Immutable audit logging
- Export capabilities for compliance reports
- Real-time audit statistics

### 🔐 Security & Authentication
- JWT-based authentication
- API key authentication for service-to-service communication
- Role-based access control
- Encrypted data transmission

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Redis (for caching)

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd infrastructure/government-apis/halal-development
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the service:**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm start
   ```

## API Documentation

### Base URL
```
http://localhost:3019/api/v1
```

### Authentication
Most endpoints require authentication. Use either:
- **JWT Token**: `Authorization: Bearer <token>`
- **API Key**: `X-API-Key: <api_key>`

### Key Endpoints

#### Health & Status
- `GET /health` - Service health check
- `GET /api/v1/status/health` - Detailed status
- `GET /api/v1/status/metrics` - Service metrics

#### HALAL DEVELOPMENT Services
- `GET /api/v1/halal-dev/standards` - Get HALAL DEVELOPMENT standards
- `POST /api/v1/halal-dev/validate` - Validate against standards
- `GET /api/v1/halal-dev/certificates/:id` - Get certificate details
- `POST /api/v1/halal-dev/application` - Submit certification application
- `GET /api/v1/halal-dev/application/:id/status` - Check application status

#### Compliance Services
- `POST /api/v1/compliance/check` - Perform compliance check
- `GET /api/v1/compliance/reports` - Generate compliance reports
- `GET /api/v1/compliance/dashboard` - Get compliance dashboard
- `POST /api/v1/compliance/violation/report` - Report violations

#### Audit Services
- `POST /api/v1/audit/log` - Log audit event
- `GET /api/v1/audit/logs` - Retrieve audit logs
- `GET /api/v1/audit/trail/:entityType/:entityId` - Get audit trail
- `GET /api/v1/audit/statistics` - Get audit statistics
- `POST /api/v1/audit/export` - Export audit logs

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3019` |
| `HALAL_DEV_API_URL` | HALAL DEVELOPMENT API base URL | Required |
| `HALAL_DEV_API_KEY` | HALAL DEVELOPMENT API key | Required |
| `AUTH_ENABLED` | Enable authentication | `true` |
| `JWT_SECRET` | JWT signing secret | Required |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |

### Sample .env Configuration
```env
NODE_ENV=development
PORT=3019
HALAL_DEV_API_URL=https://api.halaldevelopment.gov.my
HALAL_DEV_API_KEY=your_api_key_here
AUTH_ENABLED=true
JWT_SECRET=your_jwt_secret_here
REDIS_URL=redis://localhost:6379
LOG_LEVEL=info
```

## Development

### Available Scripts
```bash
npm run start:dev    # Start in development mode
npm run build        # Build for production
npm start           # Start production server
npm run test        # Run tests
npm run lint        # Run linter
npm run lint:fix    # Fix linting issues
```

### Project Structure
```
infrastructure/government-apis/halal-development/
├── src/
│   ├── middleware/     # Custom middleware
│   ├── routes/        # API routes
│   ├── utils/         # Utilities and helpers
│   └── index.ts       # Main application file
├── tests/             # Test files
├── logs/             # Log files
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── README.md         # This file
```

## Testing

### Running Tests
```bash
npm run test
npm run test:watch
```

### API Testing with curl

#### Health Check
```bash
curl http://localhost:3019/health
```

#### Get Standards
```bash
curl -H "Authorization: Bearer <token>" \
     http://localhost:3019/api/v1/halal-dev/standards
```

#### Compliance Check
```bash
curl -X POST \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PROD-001",
    "companyId": "COMP-001",
    "standards": ["HD-STD-001"]
  }' \
  http://localhost:3019/api/v1/compliance/check
```

## Monitoring

### Health Checks
The service provides comprehensive health monitoring:
- Service availability
- Database connectivity
- External API status
- Memory and CPU usage

### Logging
Structured logging with Winston:
- Console output in development
- File logging in production
- JSON format for log aggregation
- Configurable log levels

### Metrics
Built-in metrics collection:
- Request/response times
- Error rates
- API usage statistics
- Resource utilization

## Security

### Authentication Methods
1. **JWT Tokens** - For user authentication
2. **API Keys** - For service-to-service communication
3. **Optional Authentication** - For public endpoints

### Security Features
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection

## Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3019
CMD ["npm", "start"]
```

### Production Checklist
- [ ] Set strong JWT secret
- [ ] Configure Redis for production
- [ ] Set up SSL/TLS certificates
- [ ] Configure monitoring and alerting
- [ ] Set up log aggregation
- [ ] Configure backup procedures
- [ ] Test all integrations

## Integration Examples

### JavaScript/TypeScript
```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:3019/api/v1',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
});

// Check compliance
const compliance = await client.post('/compliance/check', {
  productId: 'PROD-001',
  companyId: 'COMP-001',
  standards: ['HD-STD-001']
});
```

### Python
```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

response = requests.post(
    'http://localhost:3019/api/v1/compliance/check',
    headers=headers,
    json={
        'productId': 'PROD-001',
        'companyId': 'COMP-001',
        'standards': ['HD-STD-001']
    }
)
```

## Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the configuration guide

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Service Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: 2024

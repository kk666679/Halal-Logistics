# ICA Validation Service

The Islamic Consumer Association (ICA) Validation Service provides comprehensive halal certification validation, compliance checking, and regulatory compliance services for the Halal Logistics platform.

## Features

- **Product Validation**: Validate products against ICA halal standards
- **Certificate Verification**: Verify halal certificates and their validity
- **Compliance Assessment**: Comprehensive compliance checking for businesses
- **Standards Management**: Access to ICA halal standards and requirements
- **Audit Support**: Support for compliance audits and assessments
- **Real-time Validation**: Instant validation results with detailed reporting

## API Endpoints

### Public Endpoints

- `GET /api/v1/status/health` - Service health check
- `GET /api/v1/status/status` - Service status and configuration
- `GET /api/v1/status/metrics` - Service metrics and performance data

### Protected Endpoints (require authentication)

#### ICA Operations
- `POST /api/v1/ica/validate` - Validate product against ICA standards
- `GET /api/v1/ica/standards` - Get available ICA standards
- `GET /api/v1/ica/certificate/:certificateNumber` - Get certificate details
- `POST /api/v1/ica/verify` - Verify certificate authenticity

#### Validation Services
- `POST /api/v1/validation/check` - Comprehensive product validation
- `GET /api/v1/validation/reports` - Get validation reports
- `POST /api/v1/validation/batch` - Batch validation for multiple products
- `GET /api/v1/validation/history/:productId` - Get validation history

#### Compliance Services
- `POST /api/v1/compliance/assess` - Business compliance assessment
- `GET /api/v1/compliance/requirements/:standard` - Get compliance requirements
- `POST /api/v1/compliance/audit` - Initiate compliance audit
- `GET /api/v1/compliance/dashboard/:businessId` - Compliance dashboard

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build the Service**
   ```bash
   npm run build
   ```

4. **Start the Service**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Service port | `3020` |
| `NODE_ENV` | Environment | `development` |
| `AUTH_ENABLED` | Enable authentication | `false` |
| `JWT_SECRET` | JWT secret key | - |
| `API_KEY` | Service API key | - |
| `ICA_API_URL` | ICA API endpoint | - |
| `ICA_API_KEY` | ICA API key | - |
| `REDIS_URL` | Redis connection URL | - |
| `LOG_LEVEL` | Logging level | `info` |

### Authentication

The service supports two authentication methods:

1. **JWT Authentication** (for user requests)
2. **API Key Authentication** (for service-to-service communication)

## Usage Examples

### Validate Product

```bash
curl -X POST http://localhost:3020/api/v1/ica/validate \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PROD-001",
    "certificateNumber": "ICA-2024-001",
    "standards": ["ICA-001", "ICA-002"]
  }'
```

### Check Compliance

```bash
curl -X POST http://localhost:3020/api/v1/compliance/assess \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "BIZ-001",
    "operationType": "food_production",
    "standards": ["ICA-001", "ICA-002"]
  }'
```

### Get Validation Reports

```bash
curl -X GET "http://localhost:3020/api/v1/validation/reports?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer your-jwt-token"
```

## Standards Supported

- **ICA-001**: Halal Food Production Standards v2.1
- **ICA-002**: Halal Certification Requirements v1.8
- **ICA-003**: Islamic Consumer Protection Guidelines v3.0

## Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ICA Service   │    │   Validation    │    │   Compliance    │
│                 │    │    Engine       │    │   Assessment    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ - Certificate   │    │ - Product Check │    │ - Business      │
│   Validation    │    │ - Batch Process │    │   Assessment    │
│ - Standards     │    │ - Report Gen    │    │ - Requirements   │
│   Management    │    │ - History       │    │ - Audit Support │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Monitoring

The service provides comprehensive monitoring capabilities:

- **Health Checks**: `/api/v1/status/health`
- **Service Metrics**: `/api/v1/status/metrics`
- **Request Logging**: All requests are logged with detailed information
- **Error Tracking**: Comprehensive error handling and reporting

## Security

- **CORS Protection**: Configurable CORS policies
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **Input Validation**: Comprehensive input validation and sanitization
- **Error Handling**: Secure error handling without information leakage
- **Authentication**: JWT and API key authentication support

## Development

### Running Tests

```bash
npm test
npm run test:watch
```

### Code Quality

```bash
npm run lint
npm run lint:fix
```

### Building

```bash
npm run build
```

## Integration

The ICA Validation Service integrates with:

- **Orchestrator Service**: For centralized coordination
- **Blockchain Service**: For certificate verification
- **JAKIM Service**: For cross-validation
- **HALAL DEVELOPMENT Service**: For compliance checking

## Support

For support and questions:

- **Documentation**: See `/docs` directory
- **API Reference**: Available at service status endpoint
- **Issues**: Report bugs and feature requests

## License

MIT License - see LICENSE file for details.

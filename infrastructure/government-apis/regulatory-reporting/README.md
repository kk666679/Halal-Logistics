# Regulatory Reporting Service

## Overview

The Regulatory Reporting Service is a comprehensive automated system designed to handle regulatory compliance reporting, scheduled report generation, template management, and compliance assessment for halal certification and food safety standards.

## Features

### 🚀 Core Functionality
- **Automated Report Generation**: Generate compliance reports in multiple formats (PDF, Excel, CSV, JSON, XML)
- **Scheduled Reporting**: Cron-based scheduling system for automated report generation
- **Template Management**: Create, manage, and reuse report templates
- **Compliance Assessment**: Comprehensive compliance checking and scoring
- **Multi-format Export**: Support for various report formats and delivery methods

### 🔒 Security & Authentication
- JWT token authentication
- API key authentication for service-to-service communication
- Rate limiting and security headers
- CORS configuration
- Input validation and sanitization

### 🛃 Royal Malaysian Customs Integration
- **Customs Declaration Management**: Submit and track import/export declarations
- **Real-time Status Tracking**: Monitor declaration processing status
- **HS Code Validation**: Automatic harmonized system code verification
- **Halal Certificate Integration**: JAKIM (Malaysian Islamic Development Department) verification
- **Compliance Reporting**: Automated customs compliance assessment
- **Requirements Checking**: Dynamic customs requirements based on HS codes
- **Statistics & Analytics**: Comprehensive customs data analysis

### 📊 Monitoring & Analytics
- Comprehensive logging system
- Health check endpoints
- Service metrics and performance monitoring
- Error tracking and reporting

## API Endpoints

### Public Endpoints

#### Health & Status
- `GET /health` - Service health check
- `GET /api/v1/status/health` - Detailed health status
- `GET /api/v1/status/status` - Service configuration and status
- `GET /api/v1/status/metrics` - Performance metrics
- `GET /api/v1/status/docs` - API documentation

### Protected Endpoints (Require Authentication)

#### Report Management
- `POST /api/v1/reports/generate` - Generate a new regulatory report
- `GET /api/v1/reports/:id` - Get specific report details
- `GET /api/v1/reports` - List reports with filtering
- `GET /api/v1/reports/:id/download` - Download report file
- `DELETE /api/v1/reports/:id` - Delete a report

#### Scheduled Reports
- `POST /api/v1/schedules` - Create scheduled report
- `GET /api/v1/schedules` - List scheduled reports
- `GET /api/v1/schedules/:id` - Get specific schedule details
- `PUT /api/v1/schedules/:id` - Update scheduled report
- `DELETE /api/v1/schedules/:id` - Delete scheduled report
- `PATCH /api/v1/schedules/:id/toggle` - Toggle schedule active status

#### Template Management
- `POST /api/v1/templates` - Create report template
- `GET /api/v1/templates` - List templates with filtering
- `GET /api/v1/templates/:id` - Get template details
- `GET /api/v1/templates/:id/preview` - Preview template output
- `PUT /api/v1/templates/:id` - Update template
- `DELETE /api/v1/templates/:id` - Delete template
- `PATCH /api/v1/templates/:id/toggle` - Toggle template active status

#### Compliance Assessment
- `POST /api/v1/compliance/assess` - Perform compliance assessment
- `GET /api/v1/compliance/history/:entityType/:entityId` - Get compliance history
- `GET /api/v1/compliance/standards` - Get compliance standards
- `GET /api/v1/compliance/dashboard` - Get compliance dashboard

#### Royal Malaysian Customs Integration
- `POST /api/v1/customs/declaration` - Submit customs declaration
- `GET /api/v1/customs/declaration/:id/status` - Get declaration status
- `GET /api/v1/customs/requirements/:hsCode` - Get customs requirements
- `POST /api/v1/customs/compliance-report` - Generate customs compliance report
- `GET /api/v1/customs/statistics` - Get customs statistics

## Report Types

- `halal-compliance` - Halal certification compliance reports
- `food-safety` - Food safety and hygiene reports
- `quality-control` - Quality control and assurance reports
- `supply-chain` - Supply chain compliance reports
- `financial` - Financial compliance reports
- `environmental` - Environmental compliance reports
- `custom` - Custom report types

## Authentication

### JWT Authentication
```bash
curl -H "Authorization: Bearer <your-jwt-token>" \
     -H "Content-Type: application/json" \
     http://localhost:3021/api/v1/reports/generate
```

### API Key Authentication
```bash
curl -H "X-API-Key: <your-api-key>" \
     -H "Content-Type: application/json" \
     http://localhost:3021/api/v1/reports/generate
```

## Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3021
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Authentication
JWT_SECRET=your-super-secret-jwt-key
API_KEY=your-api-key-for-service-communication
AUTH_ENABLED=true

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/regulatory-reporting.log

# Database (when connected)
DATABASE_URL=postgresql://user:password@localhost:5432/regulatory_db
REDIS_URL=redis://localhost:6379

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@company.com

# File Storage
FILE_STORAGE_PATH=./storage/reports
MAX_FILE_SIZE=10MB

# Scheduled Tasks
SCHEDULER_ENABLED=true
SCHEDULER_TIMEZONE=UTC
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Redis (for caching and sessions)
- PostgreSQL (for data persistence)

### Installation

1. **Clone and navigate to the service directory**
   ```bash
   cd infrastructure/government-apis/regulatory-reporting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the service**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

### Docker Deployment

```bash
# Build Docker image
docker build -t regulatory-reporting-service .

# Run with Docker Compose
docker-compose up -d
```

## Usage Examples

### Generate a Report

```bash
curl -X POST http://localhost:3021/api/v1/reports/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reportType": "halal-compliance",
    "templateId": "standard-halal-report",
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "format": "pdf",
    "recipients": ["compliance@company.com"]
  }'
```

### Create a Scheduled Report

```bash
curl -X POST http://localhost:3021/api/v1/schedules \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Halal Compliance Report",
    "reportType": "halal-compliance",
    "schedule": "0 9 1 * *",
    "templateId": "monthly-halal-template",
    "format": "pdf",
    "recipients": ["manager@company.com", "compliance@company.com"],
    "parameters": {
      "includeCharts": true,
      "includeRawData": false
    }
  }'
```

### Perform Compliance Assessment

```bash
curl -X POST http://localhost:3021/api/v1/compliance/assess \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "entityType": "facility",
    "entityId": "FAC-001",
    "assessmentType": "comprehensive",
    "standards": ["halal-compliance", "food-safety"],
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    }
  }'
```

### Submit Customs Declaration

```bash
curl -X POST http://localhost:3021/api/v1/customs/declaration \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "declarationType": "import",
    "declarationNumber": "IMP-2024-001",
    "declarationDate": "2024-01-15",
    "consignment": {
      "consignor": {
        "name": "ABC Halal Foods Sdn Bhd",
        "address": "123 Jalan Industri, Shah Alam",
        "taxId": "123456789",
        "countryCode": "MY"
      },
      "consignee": {
        "name": "XYZ Trading Company",
        "address": "456 Commercial Street, Kuala Lumpur",
        "taxId": "987654321",
        "countryCode": "MY"
      },
      "goods": [
        {
          "itemNumber": 1,
          "hsCode": "02013000",
          "description": "Fresh halal beef meat",
          "quantity": 1000,
          "unit": "kg",
          "grossWeight": 1050,
          "netWeight": 1000,
          "value": 15000,
          "currency": "MYR",
          "originCountry": "AU"
        }
      ]
    },
    "transport": {
      "mode": "sea",
      "vesselFlightNumber": "MSC-VALENCIA",
      "voyageNumber": "V-2401",
      "containerNumbers": ["MSKU1234567", "TCLU7654321"]
    },
    "documents": [
      {
        "type": "commercial_invoice",
        "reference": "INV-2024-001",
        "issueDate": "2024-01-10"
      },
      {
        "type": "packing_list",
        "reference": "PL-2024-001",
        "issueDate": "2024-01-10"
      }
    ],
    "halalCertificate": {
      "certificateNumber": "HALAL-2024-ABC-001",
      "issuer": "JAKIM",
      "issueDate": "2024-01-01",
      "expiryDate": "2024-12-31",
      "status": "valid"
    }
  }'
```

### Check Customs Requirements

```bash
curl -X GET "http://localhost:3021/api/v1/customs/requirements/02013000?countryCode=AU&declarationType=import" \
  -H "Authorization: Bearer <token>"
```

### Generate Customs Compliance Report

```bash
curl -X POST http://localhost:3021/api/v1/customs/compliance-report \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "period": "2024-01",
    "entityType": "company",
    "entityId": "ABC-001",
    "includeDetails": true
  }'
```

## Monitoring & Health Checks

### Health Check
```bash
curl http://localhost:3021/health
```

### Service Status
```bash
curl http://localhost:3021/api/v1/status/status
```

### Performance Metrics
```bash
curl http://localhost:3021/api/v1/status/metrics
```

## Error Handling

The service implements comprehensive error handling with:

- Structured error responses
- Detailed logging
- Graceful degradation
- Rate limiting
- Input validation

### Error Response Format
```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly message",
  "details": {
    "field": "specific field error"
  }
}
```

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
```

### Project Structure

```
src/
├── index.ts                 # Main application entry point
├── middleware/              # Express middleware
│   ├── authMiddleware.ts    # Authentication middleware
│   ├── errorHandler.ts      # Error handling middleware
│   └── notFoundHandler.ts   # 404 handler
├── routes/                  # API route handlers
│   ├── statusRoutes.ts      # Health and status endpoints
│   ├── reportRoutes.ts      # Report management endpoints
│   ├── scheduleRoutes.ts    # Scheduled report endpoints
│   ├── templateRoutes.ts    # Template management endpoints
│   └── complianceRoutes.ts  # Compliance assessment endpoints
├── services/                # Business logic services
│   └── scheduledReportingService.ts # Scheduled reporting logic
└── utils/                   # Utility functions
    └── logger.ts           # Logging configuration
```

## Security Considerations

- All sensitive data is encrypted
- JWT tokens expire after configurable time
- Rate limiting prevents abuse
- Input validation prevents injection attacks
- CORS configured for specific origins
- Security headers set via Helmet
- Comprehensive logging for audit trails

## Performance Optimization

- Redis caching for frequently accessed data
- Database connection pooling
- Efficient query optimization
- File streaming for large reports
- Background job processing for heavy operations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and formatting
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api/v1/status/docs`

---

**Service Information:**
- **Version**: 1.0.0
- **Port**: 3021 (configurable)
- **Environment**: Development/Production
- **Status**: ✅ Active
- **Last Updated**: 2024-01-01

# 🚀 Automated Regulatory Reporting Setup Guide

## Overview

This guide provides step-by-step instructions for setting up the Automated Regulatory Reporting System for the Halal Logistics Platform. The system provides comprehensive regulatory compliance reporting, scheduled report generation, and integration with Malaysian government APIs.

## Features

### ✅ Core Capabilities
- **Automated Report Generation**: Generate compliance reports in multiple formats (PDF, Excel, CSV, JSON, XML)
- **Scheduled Reporting**: Cron-based scheduling system for automated report generation
- **Template Management**: Create, manage, and reuse report templates
- **Compliance Assessment**: Comprehensive compliance checking and scoring
- **Multi-format Export**: Support for various report formats and delivery methods

### 🛃 Government Integration
- **Royal Malaysian Customs**: Full integration with customs declaration system
- **JAKIM Integration**: Halal certification verification
- **Real-time Status Tracking**: Monitor declaration processing status
- **HS Code Validation**: Automatic harmonized system code verification

### 📊 Monitoring & Analytics
- Comprehensive logging system
- Health check endpoints
- Service metrics and performance monitoring
- Error tracking and reporting

## Quick Start

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning repositories)

### 2. Setup Instructions

#### Option A: Automated Setup (Recommended)

```bash
# Navigate to the regulatory reporting service directory
cd infrastructure/government-apis/regulatory-reporting

# Run the automated setup script
./setup-automated-reporting.sh
```

The automated script will:
- ✅ Check system requirements
- ✅ Install dependencies
- ✅ Create necessary directories
- ✅ Build the project
- ✅ Start the service
- ✅ Initialize scheduled tasks

#### Option B: Manual Setup

```bash
# 1. Navigate to the service directory
cd infrastructure/government-apis/regulatory-reporting

# 2. Install dependencies
npm install

# 3. Create environment configuration
cp .env.example .env
# Edit .env with your configuration values

# 4. Create necessary directories
mkdir -p logs storage/reports storage/templates

# 5. Build the project
npm run build

# 6. Start the service
npm start
```

### 3. Verify Installation

After setup, verify the service is running:

```bash
# Check service health
curl http://localhost:3021/health

# Check service status
curl http://localhost:3021/api/v1/status/status
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "service": "Regulatory Reporting Service",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Configuration

### Environment Variables

The service uses the following key environment variables:

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

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@halallogistics.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@halallogistics.com

# Scheduled Tasks
SCHEDULER_ENABLED=true
SCHEDULER_TIMEZONE=UTC

# Government API Integration
CUSTOMS_API_BASE_URL=https://api.customs.gov.my
CUSTOMS_API_KEY=your-customs-api-key
JAKIM_API_URL=https://api.halal.gov.my
JAKIM_API_KEY=your-jakim-api-key
```

### Default Scheduled Reports

The system automatically creates three default scheduled reports:

1. **Daily Halal Compliance Summary**
   - Schedule: Every day at 9:00 AM
   - Format: PDF
   - Recipients: compliance@company.com, manager@company.com

2. **Weekly Food Safety Report**
   - Schedule: Every Monday at 8:00 AM
   - Format: Excel
   - Recipients: safety@company.com, qa@company.com

3. **Monthly Quality Control Report**
   - Schedule: First day of every month at 10:00 AM
   - Format: PDF
   - Recipients: quality@company.com, management@company.com

## API Usage

### Authentication

The service supports both JWT and API key authentication:

```bash
# JWT Authentication
curl -H "Authorization: Bearer <your-jwt-token>" \
     http://localhost:3021/api/v1/reports/generate

# API Key Authentication
curl -H "X-API-Key: <your-api-key>" \
     http://localhost:3021/api/v1/reports/generate
```

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

## Monitoring & Management

### Service Health

```bash
# Health check
curl http://localhost:3021/health

# Detailed status
curl http://localhost:3021/api/v1/status/status

# Performance metrics
curl http://localhost:3021/api/v1/status/metrics
```

### Scheduled Reports Management

```bash
# List all scheduled reports
curl http://localhost:3021/api/v1/schedules

# Get specific schedule
curl http://localhost:3021/api/v1/schedules/SCH-001

# Toggle schedule active status
curl -X PATCH http://localhost:3021/api/v1/schedules/SCH-001/toggle

# Update schedule
curl -X PUT http://localhost:3021/api/v1/schedules/SCH-001 \
  -H "Content-Type: application/json" \
  -d '{"active": false}'

# Delete schedule
curl -X DELETE http://localhost:3021/api/v1/schedules/SCH-001
```

### Template Management

```bash
# List templates
curl http://localhost:3021/api/v1/templates

# Create template
curl -X POST http://localhost:3021/api/v1/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Halal Report",
    "description": "Custom halal compliance report",
    "reportType": "halal-compliance",
    "format": "pdf",
    "template": "...template content..."
  }'

# Preview template
curl http://localhost:3021/api/v1/templates/TPL-001/preview
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using port 3021
lsof -i :3021

# Kill the process
kill -9 $(lsof -t -i:3021)
```

#### 2. Dependencies Not Installed
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 3. Environment Configuration Issues
```bash
# Check if .env file exists
ls -la .env

# Validate .env syntax
node -e "require('dotenv').config(); console.log('Environment loaded successfully');"
```

#### 4. Build Errors
```bash
# Clear build cache and rebuild
rm -rf dist/
npm run build
```

#### 5. Service Won't Start
```bash
# Check logs
tail -f logs/regulatory-reporting.log

# Check system resources
df -h
free -h
```

### Debug Mode

Run the service in debug mode to get detailed logging:

```bash
# Set debug environment variable
export DEBUG=regulatory-reporting:*

# Start service with debug logging
NODE_ENV=development npm run dev
```

## Security Considerations

### Production Deployment

1. **Change Default Secrets**: Update all default passwords and API keys
2. **Use HTTPS**: Configure SSL/TLS certificates
3. **Firewall Configuration**: Restrict access to necessary ports only
4. **Regular Updates**: Keep dependencies updated
5. **Monitoring**: Set up log monitoring and alerting

### API Security

1. **Rate Limiting**: Configure appropriate rate limits
2. **Input Validation**: All inputs are validated and sanitized
3. **Authentication**: Use strong JWT secrets
4. **Audit Logging**: All API calls are logged for audit purposes

## Performance Optimization

### Memory Management
- Connection pooling for database connections
- Efficient caching strategies
- Memory leak monitoring

### Database Optimization
- Proper indexing on frequently queried fields
- Query optimization
- Connection pooling

### File Handling
- Streaming for large file uploads/downloads
- Efficient file storage organization
- Regular cleanup of temporary files

## Support & Maintenance

### Regular Tasks

1. **Log Rotation**: Configure log rotation to prevent disk space issues
2. **Database Maintenance**: Regular cleanup and optimization
3. **Security Updates**: Keep all dependencies updated
4. **Backup**: Regular backups of configuration and data

### Monitoring

Set up monitoring for:
- Service uptime and availability
- Response times and performance
- Error rates and types
- Resource usage (CPU, memory, disk)

### Health Checks

Implement automated health checks:
- Service availability
- Database connectivity
- External API connectivity
- Disk space monitoring

## Advanced Configuration

### Custom Report Types

You can extend the system with custom report types by:

1. Adding new report type definitions
2. Creating custom templates
3. Implementing custom data sources
4. Adding new export formats

### Integration with External Systems

The service can be integrated with:
- ERP systems
- CRM systems
- Document management systems
- Email systems
- SMS notification systems

## Conclusion

The Automated Regulatory Reporting System is now fully set up and operational. The system provides comprehensive regulatory compliance reporting capabilities with automated scheduling, government API integration, and extensive monitoring features.

For additional support or customization needs, refer to the main README.md file or contact the development team.

---

**Service Status**: ✅ **OPERATIONAL**
**Version**: 1.0.0
**Port**: 3021
**Automated Scheduling**: ✅ **ENABLED**
**Government Integration**: ✅ **CONFIGURED**

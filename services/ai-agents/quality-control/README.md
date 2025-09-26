# 🔍 Quality Control Agent

## Overview

The Quality Control Agent is a comprehensive AI-powered quality management system designed for Halal Logistics operations. It provides real-time quality monitoring, automated inspection, defect detection, and quality analytics to ensure product quality and compliance.

## Features

### 🏭 Core Quality Management
- **Real-time Quality Monitoring** - Continuous monitoring of production quality
- **Automated Product Inspection** - AI-powered visual and dimensional inspection
- **Defect Detection & Classification** - Advanced computer vision for defect identification
- **Quality Scoring** - Automated quality assessment and scoring
- **Batch Quality Assessment** - Comprehensive batch-level quality analysis

### 📊 Quality Analytics
- **Quality Metrics Dashboard** - Real-time quality performance indicators
- **Trend Analysis** - Historical quality trend analysis
- **Predictive Analytics** - Future quality predictions
- **KPI Tracking** - Key performance indicators monitoring
- **Benchmarking** - Industry benchmark comparisons

### 🚨 Quality Alerts & Notifications
- **Real-time Alerts** - Instant notifications for quality issues
- **Defect Alerts** - Automated defect detection alerts
- **Quality Threshold Monitoring** - Alert when quality falls below thresholds
- **Compliance Alerts** - Regulatory compliance violation alerts

### 📋 Inspection Management
- **Automated Inspections** - Scheduled and trigger-based inspections
- **Inspection Templates** - Configurable inspection protocols
- **Equipment Calibration** - Inspection equipment management
- **Inspection History** - Complete audit trail of inspections

### 🖼️ Computer Vision Integration
- **Image Analysis** - Advanced image processing for quality assessment
- **Defect Recognition** - AI-powered defect identification
- **Quality Standards Validation** - Automated compliance checking
- **Visual Quality Scoring** - Image-based quality assessment

### 📈 Quality Reporting
- **Comprehensive Reports** - Detailed quality analysis reports
- **Export Capabilities** - Multiple format export options
- **Scheduled Reporting** - Automated report generation
- **Custom Report Builder** - Flexible report configuration

## API Endpoints

### Health & Status
- `GET /api/v1/quality/health` - Service health check
- `GET /api/v1/quality/status` - Service status information

### Quality Inspection
- `POST /api/v1/quality/inspect` - Perform product quality inspection
- `GET /api/v1/quality/inspection/:id` - Get specific inspection details
- `GET /api/v1/quality/inspections` - List inspections with filters
- `POST /api/v1/quality/batch/inspect` - Batch inspection processing

### Image Analysis
- `POST /api/v1/quality/image/analyze` - Analyze product images for quality
- `GET /api/v1/quality/standards` - Get quality standards
- `POST /api/v1/quality/standard/validate` - Validate against quality standards
- `GET /api/v1/quality/defects` - Get defect types and classifications

### Quality Metrics
- `GET /api/v1/quality/metrics` - Get quality metrics
- `GET /api/v1/quality/dashboard` - Get quality dashboard data
- `GET /api/v1/quality/kpi` - Get quality KPIs
- `POST /api/v1/quality/kpi/target` - Set KPI targets
- `GET /api/v1/quality/trends` - Get quality trends

### Alerts & Notifications
- `GET /api/v1/quality/alerts` - Get quality alerts
- `POST /api/v1/quality/alert/acknowledge/:id` - Acknowledge quality alerts

### Reporting
- `GET /api/v1/quality/reports` - Get quality reports
- `POST /api/v1/quality/report/generate` - Generate quality reports
- `GET /api/v1/quality/export` - Export quality data

### Compliance & Certification
- `GET /api/v1/quality/compliance` - Get compliance status
- `POST /api/v1/quality/compliance/check` - Check compliance
- `GET /api/v1/quality/certifications` - Get quality certifications
- `POST /api/v1/quality/certification/validate` - Validate certifications

### Advanced Features
- `POST /api/v1/quality/model/train` - Train quality models
- `GET /api/v1/quality/models` - Get quality models
- `POST /api/v1/quality/simulate` - Simulate quality scenarios
- `GET /api/v1/quality/recommendations` - Get quality recommendations
- `POST /api/v1/quality/recommendation/apply/:id` - Apply recommendations

## Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3017
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Kafka Configuration
KAFKA_BROKERS=localhost:9092

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Vision Models
VISION_MODELS_PATH=./models

# Quality Standards
QUALITY_STANDARDS_PATH=./standards

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/quality_control

# File Storage
FILE_UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760  # 10MB
```

### Quality Standards Configuration

Create a `standards` directory with quality standard definitions:

```json
{
  "halal_standard_001": {
    "name": "Halal Product Quality Standard",
    "category": "halal",
    "requirements": [
      "No prohibited ingredients",
      "Clean production environment",
      "Proper labeling"
    ],
    "thresholds": {
      "minimumQualityScore": 0.8,
      "maximumDefectRate": 0.05
    }
  }
}
```

## Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Kafka broker
- Redis server
- PostgreSQL database (optional)

### Installation

1. **Install Dependencies**
   ```bash
   cd services/ai-agents/quality-control
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build the Application**
   ```bash
   npm run build
   ```

4. **Start the Service**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run start:prod
   ```

## Usage Examples

### Basic Quality Inspection

```javascript
const axios = require('axios');

const inspectionData = {
  productId: 'product_123',
  inspectionType: 'comprehensive',
  parameters: {
    visualCheck: true,
    dimensionalCheck: true,
    functionalCheck: true
  }
};

const response = await axios.post('http://localhost:3017/api/v1/quality/inspect', inspectionData, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

console.log('Inspection Result:', response.data);
```

### Image Analysis

```javascript
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('image', fs.createReadStream('product_image.jpg'));
form.append('productId', 'product_123');
form.append('analysisType', 'defect_detection');

const response = await axios.post('http://localhost:3017/api/v1/quality/image/analyze', form, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    ...form.getHeaders()
  }
});

console.log('Image Analysis:', response.data);
```

### Quality Dashboard

```javascript
const response = await axios.get('http://localhost:3017/api/v1/quality/dashboard', {
  params: {
    timeframe: 'week',
    includeAlerts: true,
    includeMetrics: true
  },
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  }
});

console.log('Quality Dashboard:', response.data);
```

## Integration with Other Agents

### Message Broker Topics

**Publishes to:**
- `quality.inspection.completed` - Quality inspection results
- `quality.alert.generated` - Quality alerts and notifications
- `quality.report.generated` - Generated quality reports
- `quality.defect.detected` - Detected defects
- `quality.standards.update` - Quality standard updates

**Subscribes to:**
- `production.batch.completed` - Production batch completion
- `inventory.received` - Incoming inventory
- `customer.complaint.received` - Customer complaints
- `supplier.delivery.received` - Supplier deliveries
- `certification.status.changed` - Certification updates

### Inter-Agent Communication

The Quality Control Agent communicates with other agents through Kafka topics:

1. **Risk Assessment Agent** - Shares quality data for risk analysis
2. **Document Agent** - Exchanges quality certificates and reports
3. **Analytics Agent** - Provides quality metrics for analytics
4. **Blockchain Agent** - Records quality data on blockchain
5. **Compliance Agent** - Validates regulatory compliance

## Quality Models

### Computer Vision Models
- **Defect Detection Model** - Identifies product defects
- **Quality Scoring Model** - Assesses overall product quality
- **Classification Model** - Categorizes defect types
- **Anomaly Detection Model** - Identifies unusual patterns

### Machine Learning Models
- **Predictive Quality Model** - Predicts future quality issues
- **Trend Analysis Model** - Analyzes quality trends
- **Recommendation Model** - Suggests quality improvements
- **Root Cause Analysis Model** - Identifies causes of quality issues

## Monitoring & Logging

### Health Checks
- Service health endpoint: `/api/v1/quality/health`
- Detailed status endpoint: `/api/v1/quality/status`
- Kafka connection monitoring
- Database connectivity checks

### Logging
- Structured logging with correlation IDs
- Quality event logging
- Performance metrics logging
- Error tracking and alerting

## Security

### Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- API key authentication for external services

### Authorization
- User permissions: `quality:inspect`, `quality:manage`, `quality:analyze`
- Role-based access: `admin`, `inspector`, `viewer`
- Resource-level permissions

### Data Protection
- Encrypted data storage
- Secure file uploads
- Audit logging for all operations

## Performance

### Optimization Features
- Caching for frequently accessed data
- Batch processing for inspections
- Asynchronous image processing
- Optimized database queries

### Scalability
- Horizontal scaling support
- Load balancing capabilities
- Microservices architecture
- Event-driven processing

## Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:e2e
```

### Test Coverage
- Quality service functions
- API endpoints
- Message broker integration
- Authentication flows

## Troubleshooting

### Common Issues

1. **Kafka Connection Issues**
   - Check Kafka broker configuration
   - Verify network connectivity
   - Review Kafka logs

2. **Image Processing Errors**
   - Verify OpenCV installation
   - Check image format compatibility
   - Review memory usage

3. **Database Connection Issues**
   - Check database credentials
   - Verify database server status
   - Review connection pool settings

### Debug Mode
Enable debug logging:
```bash
DEBUG=quality-control:* npm run start:dev
```

## Contributing

1. Follow the established code structure
2. Add unit tests for new features
3. Update API documentation
4. Follow TypeScript best practices
5. Ensure Kafka message compatibility

## License

This project is part of the Halal Logistics Multi AI Agent System.

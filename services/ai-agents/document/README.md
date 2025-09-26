# Document Agent

## Overview

The Document Agent is an advanced AI-powered document processing service that provides comprehensive document management, processing, and analysis capabilities for the Halal Logistics Multi AI Agent System. It handles various document types, extracts structured data, performs content analysis, and integrates seamlessly with other agents in the system.

## Features

### 📄 **Document Management**
- **Multi-format Support**: PDF, DOCX, DOC, TXT, JPG, PNG, XLS, XLSX
- **Secure Upload**: File validation, size limits, and type restrictions
- **Metadata Management**: Comprehensive document metadata tracking
- **Version Control**: Document versioning and history tracking
- **Batch Processing**: Process multiple documents simultaneously

### 🔍 **Content Processing**
- **Text Extraction**: Advanced OCR and text extraction from all supported formats
- **Data Extraction**: Structured data extraction from documents
- **Content Analysis**: Language detection, readability analysis, and complexity assessment
- **Entity Recognition**: Extract dates, numbers, and key-value pairs
- **Topic Modeling**: Automatic topic extraction and categorization

### 📊 **Document Analysis**
- **Sentiment Analysis**: Analyze document sentiment and tone
- **Compliance Analysis**: Check documents for compliance requirements
- **Quality Assessment**: Evaluate document quality and completeness
- **Risk Analysis**: Identify potential risks in document content
- **Pattern Recognition**: Identify patterns and anomalies in documents

### 🔄 **Document Conversion**
- **Format Conversion**: Convert between different document formats
- **Quality Optimization**: Optimize documents for different purposes
- **Compression**: Compress documents while maintaining quality
- **Thumbnail Generation**: Generate document thumbnails and previews

### 🔐 **Security & Access Control**
- **JWT Authentication**: Secure API access with role-based permissions
- **Document Sharing**: Secure document sharing with expiration
- **Access Logging**: Comprehensive audit trail for all operations
- **Encryption**: Document encryption at rest and in transit
- **API Key Management**: Generate and manage API keys for external access

### 📈 **Analytics & Reporting**
- **Usage Analytics**: Track document processing and usage statistics
- **Performance Metrics**: Monitor processing times and success rates
- **Storage Analytics**: Monitor storage usage and file distribution
- **User Activity**: Track user interactions and document access patterns

## API Endpoints

### Public Endpoints

- `GET /api/v1/document/health` - Health check endpoint
- `GET /api/v1/document/status` - Service status information

### Protected Endpoints (Requires JWT Authentication)

#### Document Management
- `POST /api/v1/document/upload` - Upload new documents
- `GET /api/v1/document/list` - List documents with filtering
- `GET /api/v1/document/:id` - Get document details
- `DELETE /api/v1/document/:id` - Delete document

#### Document Processing
- `POST /api/v1/document/process/:id` - Process document
- `GET /api/v1/document/:id/extract` - Extract data from document
- `GET /api/v1/document/:id/analyze` - Analyze document content
- `POST /api/v1/document/:id/validate` - Validate document structure
- `GET /api/v1/document/:id/convert` - Convert document format
- `POST /api/v1/document/batch/process` - Batch process documents

#### Document Analysis
- `POST /api/v1/document/:id/classify` - Classify document
- `GET /api/v1/document/:id/search` - Search within document
- `PUT /api/v1/document/:id/metadata` - Update document metadata
- `POST /api/v1/document/:id/share` - Share document

#### Templates
- `GET /api/v1/document/templates/list` - List document templates
- `POST /api/v1/document/template/create` - Create document template

#### Analytics
- `GET /api/v1/document/analytics/usage` - Get usage analytics

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3015` |
| `NODE_ENV` | Environment | `development` |
| `JWT_SECRET` | JWT signing secret | Required |
| `DATABASE_URL` | Database connection string | Required |
| `KAFKA_BROKERS` | Kafka broker URLs | `localhost:9092` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `ORCHESTRATOR_URL` | Orchestrator service URL | `http://localhost:3011` |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:3000` |
| `UPLOAD_DIR` | File upload directory | `./uploads` |
| `MAX_FILE_SIZE` | Maximum file size in bytes | `10485760` |
| `ALLOWED_FILE_TYPES` | Comma-separated allowed file types | `pdf,doc,docx,jpg,jpeg,png,txt` |
| `PROCESSING_TIMEOUT` | Document processing timeout | `300000` |
| `OCR_ENABLED` | Enable OCR processing | `true` |
| `OCR_LANGUAGE` | OCR language codes | `en,ms` |
| `STORAGE_TYPE` | Storage type (local, s3) | `local` |
| `AWS_S3_BUCKET` | S3 bucket name (if using S3) | - |
| `AWS_REGION` | AWS region (if using S3) | - |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `LOG_LEVEL` | Logging level | `info` |
| `ANALYTICS_ENABLED` | Enable analytics | `true` |
| `BACKUP_ENABLED` | Enable automatic backups | `true` |

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

3. Create required directories:
```bash
mkdir -p uploads thumbnails logs templates
```

4. Start the service:
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## Configuration

### Supported File Types

- **Documents**: PDF, DOC, DOCX, TXT
- **Images**: JPG, JPEG, PNG
- **Spreadsheets**: XLS, XLSX
- **Archives**: ZIP, RAR (planned)

### Processing Capabilities

#### Text Extraction
- PDF text extraction with layout preservation
- DOCX content extraction with formatting
- OCR for scanned documents and images
- Multi-language support (English, Malay, Arabic)

#### Data Extraction
- Certificate information (number, dates, issuer)
- Supplier information (name, address, contact)
- Contract details (parties, terms, conditions)
- Invoice data (amounts, dates, items)

#### Content Analysis
- Language detection and confidence scoring
- Readability analysis (Flesch score)
- Topic extraction and categorization
- Sentiment analysis
- Complexity assessment

### Storage Options

#### Local Storage
- Files stored on local filesystem
- Configurable upload directory
- Automatic backup and cleanup
- Thumbnail generation

#### AWS S3 Storage
- Cloud-based file storage
- Automatic scaling and redundancy
- CDN integration support
- Access control and encryption

## Integration with Other Agents

### Orchestrator Integration

- **Event Publishing**: Document events published to Kafka
- **Health Monitoring**: Service health reported to orchestrator
- **Load Balancing**: Processing load distributed across instances
- **Metrics Collection**: Performance metrics collected and reported

### Analytics Agent Integration

- **Usage Analytics**: Document processing statistics sent to analytics
- **Performance Metrics**: Processing times and success rates tracked
- **User Activity**: User interactions logged for analysis
- **Trend Analysis**: Document processing trends analyzed

### Compliance Agent Integration

- **Document Validation**: Compliance validation of processed documents
- **Regulatory Checks**: Automatic regulatory compliance checking
- **Audit Trail**: Comprehensive audit trail for compliance
- **Risk Assessment**: Document-based risk assessment

### Blockchain Agent Integration

- **Document Hashing**: Document hashes stored on blockchain
- **Certification Tracking**: Certificate lifecycle on blockchain
- **Immutable Records**: Tamper-proof document records
- **Verification**: Blockchain-based document verification

## Security Features

### Authentication & Authorization
- JWT-based authentication with configurable expiration
- Role-based access control (RBAC)
- API key management for external integrations
- Session management and tracking

### Data Protection
- Document encryption at rest
- Secure file upload with validation
- Access logging and audit trails
- Rate limiting and DDoS protection

### Compliance
- GDPR compliance features
- Data retention policies
- Secure document sharing
- Access control and permissions

## Document Processing Pipeline

### 1. Upload Phase
- File validation and type checking
- Virus scanning (if configured)
- Metadata extraction
- Storage allocation

### 2. Processing Phase
- Content extraction based on file type
- Text analysis and entity recognition
- Data structuring and validation
- Quality assessment

### 3. Analysis Phase
- Content analysis and classification
- Compliance checking
- Risk assessment
- Quality scoring

### 4. Storage Phase
- Secure storage with encryption
- Indexing for search
- Backup and archival
- Access control setup

## Monitoring and Logging

### Metrics Collection

- **Processing Metrics**: Processing times, success/failure rates
- **Storage Metrics**: File sizes, storage usage, cleanup statistics
- **Performance Metrics**: Response times, throughput, error rates
- **User Metrics**: User activity, document access patterns

### Logging

- **Structured Logging**: JSON-formatted logs with correlation IDs
- **Log Levels**: Configurable log levels (debug, info, warn, error)
- **Log Rotation**: Automatic log rotation and archival
- **Centralized Logging**: Support for external log aggregation

### Health Checks

- **Service Health**: Basic service availability checks
- **Dependency Health**: Database, message broker, storage health
- **Performance Health**: Response time and throughput monitoring
- **Custom Health**: Configurable health check endpoints

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
- Performance tests for document processing
- Mock data for testing various document types

## Deployment

### Docker

```bash
# Build image
docker build -t document-agent .

# Run container
docker run -p 3015:3015 \
  -v /path/to/uploads:/app/uploads \
  -v /path/to/logs:/app/logs \
  document-agent
```

### Kubernetes

```bash
# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Apply service
kubectl apply -f k8s/service.yaml

# Apply persistent volume claim
kubectl apply -f k8s/pvc.yaml
```

### Environment Setup

1. **Database Setup**: Configure PostgreSQL or MongoDB
2. **Message Broker**: Set up Kafka and Redis
3. **Storage**: Configure local storage or AWS S3
4. **Dependencies**: Ensure all external services are running
5. **Environment Variables**: Configure all required environment variables

## API Documentation

Full API documentation is available at `/api` when the service is running, or can be imported from the included Postman collection.

## Data Models

### Document Structure

```typescript
interface Document {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  metadata: {
    uploadedBy: string;
    uploadedAt: Date;
    processedAt?: Date;
    documentType?: string;
    extractedData?: any;
    validationStatus?: string;
    confidence?: number;
  };
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}
```

### Processing Result

```typescript
interface ProcessingResult {
  documentId: string;
  type: string;
  text: string;
  metadata: any;
  extractedData: {
    entities: any[];
    dates: string[];
    numbers: string[];
    keyValuePairs: any[];
  };
  analysis: {
    language: string;
    readability: any;
    topics: string[];
    sentiment: any;
    complexity: string;
  };
  confidence: number;
  processedAt: Date;
}
```

## Troubleshooting

### Common Issues

1. **File Upload Issues**
   - Check file size limits
   - Verify file type restrictions
   - Ensure upload directory permissions

2. **Processing Failures**
   - Check document format compatibility
   - Verify OCR service availability
   - Review processing timeout settings

3. **Storage Issues**
   - Monitor disk space usage
   - Check file permissions
   - Verify backup configuration

4. **Performance Issues**
   - Monitor concurrent processing limits
   - Check system resources
   - Review caching configuration

### Debug Mode

Enable debug logging by setting:
```bash
DEBUG=document-agent:*
LOG_LEVEL=debug
```

## Performance Optimization

### Caching Strategy

- **Redis Caching**: Processing results and metadata
- **File Caching**: Frequently accessed documents
- **Memory Caching**: Processing configurations
- **CDN Integration**: Static assets and thumbnails

### Scalability Considerations

- **Horizontal Scaling**: Multiple document agent instances
- **Load Balancing**: Distribute processing load
- **Queue Management**: Kafka-based processing queues
- **Database Optimization**: Indexed queries and partitioning

### Resource Management

- **Memory Management**: Configurable processing limits
- **Storage Management**: Automatic cleanup and archival
- **CPU Optimization**: Parallel processing capabilities
- **Network Optimization**: Efficient data transfer

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

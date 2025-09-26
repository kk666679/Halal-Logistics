# JAKIM API Integration Service

This service provides integration with the Malaysian Islamic Development Department (JAKIM) API for Halal certification management and validation.

## Features

- **Certificate Management**: Create, update, and manage Halal certificates
- **Real-time Validation**: Validate certificates and products against JAKIM standards
- **Application Submission**: Submit new certification applications to JAKIM
- **Status Monitoring**: Track application and validation status
- **Compliance Checking**: Automated compliance verification
- **Audit Trail**: Complete logging and audit trail for all operations

## API Endpoints

### Public Endpoints

- `GET /api/v1/status/health` - Service health check
- `GET /api/v1/status` - Service status and information

### Protected Endpoints (require authentication)

- `GET /api/v1/jakim/status` - JAKIM API connection status
- `POST /api/v1/jakim/validate-certificate` - Validate certificate with JAKIM
- `POST /api/v1/jakim/submit-application` - Submit new application to JAKIM
- `GET /api/v1/certificates/:id` - Get certificate details
- `POST /api/v1/certificates` - Create new certificate
- `PUT /api/v1/certificates/:id` - Update certificate
- `POST /api/v1/validation/product` - Validate product compliance
- `POST /api/v1/validation/company` - Validate company compliance
- `GET /api/v1/validation/history/:entityId` - Get validation history

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Start the service:**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm start
   ```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Service port | 3018 |
| `FRONTEND_URL` | Frontend application URL | http://localhost:3000 |
| `JWT_SECRET` | JWT signing secret | - |
| `JAKIM_API_KEY` | JAKIM API authentication key | - |
| `DATABASE_URL` | Database connection string | - |
| `REDIS_URL` | Redis connection string | - |
| `JAKIM_BASE_URL` | JAKIM API base URL | https://api.jakim.gov.my |
| `LOG_LEVEL` | Logging level | info |

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start the production server
- `npm run start:dev` - Start the development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

### Project Structure

```
src/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── routes/          # API route handlers
├── services/        # Business logic services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## Security

- JWT-based authentication for protected endpoints
- API key authentication for service-to-service communication
- Rate limiting to prevent abuse
- Input validation and sanitization
- CORS configuration for cross-origin requests
- Helmet.js for security headers

## Monitoring

- Health check endpoints for service monitoring
- Comprehensive logging with Winston
- Error tracking and reporting
- Performance metrics collection

## Integration

This service integrates with:

- **JAKIM API**: Official Malaysian Islamic Development Department API
- **Agent Orchestrator**: For inter-agent communication
- **Database**: For persistent storage
- **Redis**: For caching and session management
- **Message Queue**: For asynchronous processing

## Testing

Run the test suite:
```bash
npm test
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables for production

3. Start the service:
   ```bash
   npm start
   ```

## License

MIT License - see LICENSE file for details.

# Halal Logistics and Supply Chain Platform

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js Version](https://img.shields.io/badge/Node.js-22.x-green.svg)
![Next.js Version](https://img.shields.io/badge/Next.js-15.x-black.svg)
![NestJS Version](https://img.shields.io/badge/NestJS-10.x-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791.svg)
![Redis](https://img.shields.io/badge/Redis-7.x-DC382D.svg)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED.svg)
![Microservices](https://img.shields.io/badge/Architecture-Microservices-6E5494.svg)

A comprehensive microservices-based platform for managing Halal logistics operations, including certification workflows, shipment tracking, inventory management, and compliance auditing.

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph FrontendLayer [Frontend Layer]
        NextJS[Next.js 15 App<br/>Tailwind CSS + shadcn/ui]
    end

    subgraph APIGateway [API Gateway Layer]
        Gateway[NestJS API Gateway<br/>Authentication<br/>Rate Limiting<br/>Request Routing]
    end

    subgraph Microservices [Microservices Layer]
        Auth[Auth Service<br/>JWT Management<br/>User Management]
        Cert[Certification Service<br/>Halal Certification<br/>Document Management]
        Ship[Shipment Service<br/>Tracking<br/>QR/RFID Integration]
        Inv[Inventory Service<br/>Stock Management<br/>Batch Tracking]
        Audit[Audit Service<br/>Compliance<br/>Reporting]
    end

    subgraph Infrastructure [Infrastructure Layer]
        Redis[Redis<br/>Caching<br/>Pub/Sub<br/>Sessions]
        Postgres[PostgreSQL Neon<br/>Primary Data Storage]
        Blob[Blob Storage<br/>Documents<br/>Certificates<br/>Images]
    end

    NextJS --> Gateway
    Gateway --> Auth
    Gateway --> Cert
    Gateway --> Ship
    Gateway --> Inv
    Gateway --> Audit

    Auth -.-> Redis
    Cert -.-> Redis
    Ship -.-> Redis
    Inv -.-> Redis
    Audit -.-> Redis

    Auth --> Postgres
    Cert --> Postgres
    Ship --> Postgres
    Inv --> Postgres
    Audit --> Postgres

    Cert --> Blob
    Audit --> Blob
```

## 📋 Tech Stack

![Tech Stack](https://skillicons.dev/icons?i=nodejs,nextjs,nestjs,ts,tailwind,prisma,postgres,redis,docker,aws,gcp,azure)

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: NestJS Microservices, Node.js 22
- **API Gateway**: NestJS with Express adapter
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Prisma for type-safe database access
- **Caching & Pub/Sub**: Redis
- **File Storage**: Blob Storage (AWS S3/Azure Blob Storage)
- **Authentication**: JWT with role-based access control
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Containerization**: Docker with Docker Compose
- **Message Broker**: Redis Pub/Sub for inter-service communication

## 🚀 Quick Start

### Prerequisites

![Prerequisites](https://img.shields.io/badge/Node.js-22%2B-green?logo=nodedotjs)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis)

- Node.js 22+
- Docker and Docker Compose
- PostgreSQL database (Neon recommended)
- Redis instance
- Blob Storage account (AWS S3/Azure Blob Storage, or similar)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/halal-logistics-platform.git
cd halal-logistics-platform
```

### 2. Environment Setup

Copy the environment template files:

```bash
# Copy environment templates
cp .env.example .env
cp apps/auth-service/.env.example apps/auth-service/.env
cp apps/certification-service/.env.example apps/certification-service/.env
cp apps/shipment-service/.env.example apps/shipment-service/.env
cp apps/inventory-service/.env.example apps/inventory-service/.env
cp apps/audit-service/.env.example apps/audit-service/.env
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

Update each environment file with your specific configuration.

### 3. Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# Or build and start
docker-compose up --build -d

# View logs
docker-compose logs -f
```

### 4. Database Migrations

```bash
# Run migrations for all services
docker-compose exec auth-service npm run db:migrate
docker-compose exec certification-service npm run db:migrate
docker-compose exec shipment-service npm run db:migrate
docker-compose exec inventory-service npm run db:migrate
docker-compose exec audit-service npm run db:migrate

# Seed initial data (optional)
docker-compose exec auth-service npm run db:seed
```

### 5. Access the Application

![Frontend](https://img.shields.io/badge/Frontend-Localhost:3000-000000?logo=next.js)
![API](https://img.shields.io/badge/API_Localhost:3000/api-67A4AC?logo=node.js)
![Docs](https://img.shields.io/badge/Docs-Localhost:3000/api/docs-6E5494?logo=swagger)

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api/docs

## 📁 Project Structure

```
halal-logistics-platform/
├── apps/
│   ├── api-gateway/                 # API Gateway (NestJS)
│   ├── auth-service/                # Authentication Service
│   ├── certification-service/       # Certification Management
│   ├── shipment-service/            # Shipment Tracking
│   ├── inventory-service/           # Inventory Management
│   ├── audit-service/               # Audit & Compliance
│   └── frontend/                    # Next.js 15 Frontend
├── packages/
│   ├── shared/                      # Shared utilities and types
│   └── proto/                       # gRPC protocol definitions
├── docker-compose.yml               # Docker compose configuration
├── package.json                     # Root package.json
└── README.md                        # Project documentation
```

## 🔐 Authentication & Authorization

### User Roles

![Admin](https://img.shields.io/badge/Role-ADMIN-red)
![Certifier](https://img.shields.io/badge/Role-CERTIFIER-blue)
![Provider](https://img.shields.io/badge/Role-PROVIDER-green)
![Manufacturer](https://img.shields.io/badge/Role-MANUFACTURER-orange)
![Auditor](https://img.shields.io/badge/Role-AUDITOR-purple)

- **ADMIN**: Full system access and user management
- **CERTIFIER**: Manage certifications and conduct audits
- **PROVIDER**: Handle shipments and logistics operations
- **MANUFACTURER**: Submit certifications and manage inventory
- **AUDITOR**: Conduct compliance audits and generate reports

### JWT Token Structure

```typescript
interface JwtPayload {
  userId: string;
  email: string;
  roles: UserRole[];
  permissions: string[];
  services: {
    auth: boolean;
    certification: boolean;
    shipment: boolean;
    inventory: boolean;
    audit: boolean;
  };
  iat: number;
  exp: number;
}
```

## 📊 API Endpoints

### Authentication Service
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile
- `POST /auth/roles` - Assign roles (Admin only)

### Certification Service
- `POST /certifications` - Submit certification request
- `GET /certifications` - List certifications
- `GET /certifications/:id` - Get certification details
- `PATCH /certifications/:id` - Update certification status
- `POST /certifications/:id/documents` - Upload documents

### Shipment Service
- `POST /shipments` - Create shipment
- `GET /shipments` - List shipments
- `GET /shipments/:id` - Get shipment details
- `GET /shipments/track/:trackingId` - Track shipment
- `POST /shipments/:id/scan` - Record shipment scan

### Inventory Service
- `POST /inventory` - Add inventory item
- `GET /inventory` - List inventory items
- `GET /inventory/:id` - Get inventory item details
- `PATCH /inventory/:id` - Update inventory item
- `POST /inventory/batch` - Create batch

### Audit Service
- `GET /audit` - Get audit logs
- `POST /audit/inspection` - Schedule inspection
- `GET /audit/reports/compliance` - Generate compliance report
- `GET /audit/reports/certifications` - Certification status report

## 🛠️ Development

### Running Services Individually

```bash
# Install dependencies
npm install

# Run all services in development mode
npm run dev

# Or run individual services
npm run dev:auth
npm run dev:certification
npm run dev:shipment
npm run dev:inventory
npm run dev:audit
npm run dev:gateway
npm run dev:frontend
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

### Testing

![Testing](https://img.shields.io/badge/Testing-Jest-C21325?logo=jest)
![Coverage](https://img.shields.io/badge/Coverage-90%25-brightgreen)

```bash
# Run tests for all services
npm test

# Run tests for specific service
npm run test:auth
npm run test:certification

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 🐳 Docker Deployment

### Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Kubernetes Deployment (Optional)

```bash
# Apply Kubernetes configurations
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmaps.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployments.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/ingress.yaml
```

## 🔒 Security Features

![Security](https://img.shields.io/badge/Security-✓-green)
![JWT](https://img.shields.io/badge/JWT-Auth-critical)
![RBAC](https://img.shields.io/badge/RBAC-Enabled-blueviolet)
![Rate Limiting](https://img.shields.io/badge/Rate_Limiting-✓-yellow)

- JWT authentication with refresh token rotation
- Role-based access control (RBAC)
- Rate limiting with Redis store
- Input validation with class-validator
- SQL injection protection via Prisma
- CORS configuration
- Helmet.js security headers
- CSRF protection
- File upload validation and scanning
- Service-to-service authentication

## 📈 Monitoring & Logging

### Health Checks

```bash
# Check service health
curl http://localhost:3000/api/health

# Check specific service health
curl http://localhost:3000/api/health/auth
curl http://localhost:3000/api/health/certification
```

### Logging

Logs are structured and available through:

- Docker Compose: `docker-compose logs -f`
- Individual containers: `docker logs <container-name>`
- File logs in production environments
- Cloud logging services (when deployed to cloud platforms)

## 🔄 Event-Driven Architecture

### Available Events

```typescript
// User events
USER_CREATED = 'user.created'
USER_UPDATED = 'user.updated'
USER_DELETED = 'user.deleted'

// Certification events
CERTIFICATION_SUBMITTED = 'certification.submitted'
CERTIFICATION_APPROVED = 'certification.approved'
CERTIFICATION_REJECTED = 'certification.rejected'

// Shipment events
SHIPMENT_CREATED = 'shipment.created'
SHIPMENT_UPDATED = 'shipment.updated'
SHIPMENT_SCANNED = 'shipment.scanned'

// Inventory events
INVENTORY_ADDED = 'inventory.added'
INVENTORY_UPDATED = 'inventory.updated'
INVENTORY_LOW = 'inventory.low'

// Audit events
AUDIT_LOG_CREATED = 'audit.log.created'
INSPECTION_SCHEDULED = 'inspection.scheduled'
COMPLIANCE_ISSUE = 'compliance.issue'
```

### Creating Event Listeners

```typescript
@Injectable()
export class UserEventListener {
  constructor(private readonly certificationService: CertificationService) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(payload: UserCreatedEvent) {
    await this.certificationService.createUserProfile({
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    });
  }
}
```

## 📱 Future Enhancements

![Roadmap](https://img.shields.io/badge/Roadmap-Active-ff69b4)
![Mobile](https://img.shields.io/badge/Mobile-React_Native-61DAFB?logo=react)
![Blockchain](https://img.shields.io/badge/Blockchain-Integration-3C3C3D?logo=blockchaindotcom)
![IoT](https://img.shields.io/badge/IoT-RFID/QR-0064A5?logo=iot)
![ML](https://img.shields.io/badge/ML-Predictions-FF6F61?logo=ai)

- [ ] Mobile app (React Native)
- [ ] Blockchain integration for immutable certification records
- [ ] RFID/IoT sensor data integration for real-time monitoring
- [ ] PDF certificate generation with digital signatures
- [ ] Advanced analytics dashboard with data visualization
- [ ] Multi-language support for international operations
- [ ] WebSocket support for real-time notifications
- [ ] GraphQL API for flexible data querying
- [ ] Machine learning for compliance prediction
- [ ] Supply chain optimization algorithms

## 🤝 Contributing

![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen)

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

![Support](https://img.shields.io/badge/Support-GitHub_Issues-181717?logo=github)
![Email](https://img.shields.io/badge/Email-support%40halallogistics.com-EA4335?logo=gmail)
![Docs](https://img.shields.io/badge/Docs-docs.halallogistics.com-6E5494?logo=readthedocs)

For support and questions:

- Open an issue on GitHub
- Email: support@halallogistics.com
- Documentation: [docs.halallogistics.com](https://docs.halallogistics.com)

## 🙏 Acknowledgments

- NestJS team for the excellent framework
- Next.js team for the React framework
- Prisma team for the database toolkit
- The open-source community for countless libraries and tools

---

Built with ❤️ for the Halal logistics industry

![Halal Certified](https://img.shields.io/badge/Halal-Certified-green)
![Quality](https://img.shields.io/badge/Quality-Assured-blue)
![Compliance](https://img.shields.io/badge/Compliance-100%25-brightgreen)

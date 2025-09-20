# HalalChain Backend API

A comprehensive NestJS backend API for the HalalChain system, providing authentication, product management, certification tracking, and shipment tracking with blockchain verification.

## 🏗️ Architecture Overview

```mermaid
graph TB
    A[Client Applications] --> B[NestJS API Gateway]
    B --> C[Authentication Module]
    B --> D[Users Module]
    B --> E[Products Module]
    B --> F[Certification Module]
    B --> G[Tracking Module]

    C --> H[JWT Service]
    C --> I[Passport Strategies]

    E --> J[MongoDB Products]
    F --> K[MongoDB Certifications]
    G --> L[MongoDB Tracking]
    D --> M[MongoDB Users]

    G --> N[Blockchain Service]
    F --> O[File Upload Service]

    H --> P[Bcrypt Hashing]
    I --> Q[Role-based Guards]
```

## ✨ Features

- **🔐 Authentication & Authorization**: JWT-based authentication with role-based access control
- **👥 User Management**: Multi-role user system with profile management
- **📦 Product Management**: Complete inventory management with Halal certification tracking
- **📋 Certification System**: End-to-end certification workflow management
- **🚚 Shipment Tracking**: Real-time tracking with blockchain verification
- **🛡️ Security**: Input validation, error handling, and secure authentication
- **📊 Analytics**: Comprehensive statistics and reporting endpoints

## 🛠️ Tech Stack

- **Framework**: NestJS 10.x
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **File Upload**: Multer (configurable)

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── dto/
│   │   │   └── auth.dto.ts     # Auth request/response DTOs
│   │   ├── auth.controller.ts  # Auth endpoints
│   │   ├── auth.module.ts      # Auth module configuration
│   │   ├── auth.service.ts     # Auth business logic
│   │   ├── jwt-auth.guard.ts   # JWT authentication guard
│   │   ├── jwt.strategy.ts     # JWT strategy
│   │   └── local.strategy.ts   # Local strategy
│   │
│   ├── users/                   # User management module
│   │   ├── dto/
│   │   │   └── user.dto.ts     # User DTOs
│   │   ├── user.schema.ts      # User MongoDB schema
│   │   ├── users.controller.ts # User endpoints
│   │   ├── users.module.ts     # Users module
│   │   └── users.service.ts    # User business logic
│   │
│   ├── products/                # Product management module
│   │   ├── dto/
│   │   │   └── product.dto.ts  # Product DTOs
│   │   ├── product.schema.ts   # Product MongoDB schema
│   │   ├── products.controller.ts # Product endpoints
│   │   ├── products.module.ts  # Products module
│   │   └── products.service.ts # Product business logic
│   │
│   ├── certification/           # Certification module
│   │   ├── dto/
│   │   │   └── certification.dto.ts # Certification DTOs
│   │   ├── certification.schema.ts # Certification schema
│   │   ├── certification.controller.ts # Certification endpoints
│   │   ├── certification.module.ts # Certification module
│   │   └── certification.service.ts # Certification logic
│   │
│   ├── tracking/                # Tracking module
│   │   ├── dto/
│   │   │   └── tracking.dto.ts # Tracking DTOs
│   │   ├── tracking.schema.ts  # Tracking schema
│   │   ├── tracking.controller.ts # Tracking endpoints
│   │   ├── tracking.module.ts  # Tracking module
│   │   └── tracking.service.ts # Tracking business logic
│   │
│   ├── common/                  # Shared utilities (future)
│   ├── app.module.ts           # Root application module
│   └── main.ts                 # Application entry point
│
├── test/                       # Test files
├── node_modules/               # Dependencies
├── .env.example               # Environment template
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🚀 Installation

### Prerequisites
- Node.js 18+
- MongoDB 5+
- npm or yarn

### Setup Steps

1. **Clone and Install**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/halalchain

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d

   # Server
   PORT=3001
   NODE_ENV=development

   # CORS
   FRONTEND_URL=http://localhost:3000

   # Optional: Blockchain Integration
   BLOCKCHAIN_API_URL=https://api.blockchain-provider.com
   BLOCKCHAIN_API_KEY=your-blockchain-api-key

   # Optional: File Upload
   MAX_FILE_SIZE=10485760
   UPLOAD_DEST=./uploads
   ```

3. **Start MongoDB**:
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest

   # Or using local installation
   mongod
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

The API will be available at `http://localhost:3001`

## 📡 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| GET | `/auth/profile` | Get user profile | ✅ |
| PATCH | `/auth/profile` | Update user profile | ✅ |

### User Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get current user profile | ✅ |
| GET | `/users/stats` | Get user statistics | ✅ |
| GET | `/users` | Get all users (Admin) | ✅ |

### Product Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/products` | Get all products | ✅ |
| GET | `/products/low-stock` | Get low stock products | ✅ |
| GET | `/products/stats` | Get product statistics | ✅ |
| GET | `/products/:id` | Get product by ID | ✅ |
| POST | `/products` | Create new product | ✅ |
| PATCH | `/products/:id` | Update product | ✅ |
| PATCH | `/products/:id/stock` | Update product stock | ✅ |
| DELETE | `/products/:id` | Delete product | ✅ |

### Certification Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/certifications` | Get all applications | ✅ |
| GET | `/certifications/my-applications` | Get user's applications | ✅ |
| GET | `/certifications/stats` | Get certification statistics | ✅ |
| GET | `/certifications/:id` | Get application by ID | ✅ |
| POST | `/certifications` | Submit new application | ✅ |
| PATCH | `/certifications/:id` | Update application | ✅ |
| PATCH | `/certifications/:id/status` | Update application status | ✅ |
| PATCH | `/certifications/:id/assign` | Assign to reviewer | ✅ |

### Tracking Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tracking` | Get all shipments | ✅ |
| GET | `/tracking/my-shipments` | Get user's shipments | ✅ |
| GET | `/tracking/stats` | Get tracking statistics | ✅ |
| GET | `/tracking/:id` | Get shipment by ID | ✅ |
| POST | `/tracking` | Create new shipment | ✅ |
| PATCH | `/tracking/:id` | Update shipment | ✅ |
| PATCH | `/tracking/:id/status` | Update shipment status | ✅ |
| POST | `/tracking/:id/events` | Add tracking event | ✅ |

## 🗄️ Database Models

### User Model
```typescript
{
  _id: ObjectId,
  firstName: string,
  lastName: string,
  email: string,
  password: string (hashed),
  role: 'supplier' | 'certifier' | 'auditor' | 'consumer',
  companyName?: string,
  phoneNumber?: string,
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```typescript
{
  _id: ObjectId,
  name: string,
  category: ProductCategory,
  sku: string,
  description?: string,
  currentStock: number,
  minStock: number,
  maxStock: number,
  unit: string,
  costPerUnit: number,
  sellingPrice: number,
  supplier: string,
  location: string,
  expiryDate: Date,
  batchNumber: string,
  halalCertified: boolean,
  certificationNumber?: string,
  certificationExpiry?: Date,
  temperature?: number,
  humidity?: number,
  isActive: boolean,
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

### Certification Model
```typescript
{
  _id: ObjectId,
  productName: string,
  productCategory: string,
  companyName: string,
  companyAddress: string,
  contactPerson: string,
  contactEmail: string,
  contactPhone: string,
  productDescription: string,
  ingredients: string[],
  manufacturingProcess: string,
  supplierDetails: string,
  requestedCertificationType: CertificationType,
  expectedCompletionDate: Date,
  supportingDocuments: string[],
  status: CertificationStatus,
  reviewComments?: string,
  approvedBy?: ObjectId,
  approvedAt?: Date,
  certificationNumber?: string,
  validUntil?: Date,
  submittedBy: ObjectId (User),
  assignedTo?: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

### Tracking Model
```typescript
{
  _id: ObjectId,
  productName: string,
  quantity: string,
  origin: string,
  destination: string,
  estimatedDelivery: Date,
  currentLocation: string,
  status: TrackingStatus,
  progress: number,
  halalCertified: boolean,
  temperature: {
    current: number,
    min: number,
    max: number,
    unit: 'C' | 'F'
  },
  carrier: string,
  blockchainVerified: boolean,
  trackingEvents: TrackingEvent[],
  createdBy: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Role-based Access
- **Supplier**: Can manage products and track shipments
- **Certifier**: Can review and approve certification applications
- **Auditor**: Can access audit logs and verification data
- **Consumer**: Can view products and track orders

## ✅ Data Validation

All input data is validated using class-validator decorators:

- **String validation**: Min/max length, email format, enum values
- **Number validation**: Min/max values, positive numbers
- **Date validation**: ISO date strings
- **Custom validation**: Business logic validation

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Sanitization**: All inputs validated and sanitized
- **CORS Protection**: Configurable CORS settings
- **Rate Limiting**: Request throttling (configurable)
- **Error Handling**: Secure error responses without data leakage

## 📊 Analytics & Statistics

The API provides comprehensive statistics endpoints:

- **User Statistics**: Registration trends, active users by role
- **Product Statistics**: Inventory levels, low stock alerts, category distribution
- **Certification Statistics**: Application status distribution, approval rates
- **Tracking Statistics**: Shipment status, delivery performance

## 🧪 Testing

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Test Coverage
npm run test:cov
```

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/halalchain
JWT_SECRET=your-production-jwt-secret-key
PORT=3001
FRONTEND_URL=https://yourdomain.com
```

## 🤝 Contributing

1. Follow the existing code style and structure
2. Add proper validation for all inputs
3. Include error handling for edge cases
4. Add unit tests for new features
5. Update this README if adding new endpoints
6. Use conventional commit messages

## 📝 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:3001/api`
- **ReDoc**: `http://localhost:3001/api-json`

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the example requests in the test files

---

**Built with ❤️ for the HalalChain ecosystem**

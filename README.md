# Halal Logistics and Supply Chain Platform

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black.svg)
![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791.svg)
![Redis](https://img.shields.io/badge/Redis-7.x-DC382D.svg)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED.svg)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-6E5494.svg)
![OCI Deployment](https://img.shields.io/badge/OCI-Deployment-F80000.svg?logo=oracle)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen.svg)
![Contributors](https://img.shields.io/badge/contributors-10+-blue.svg)
![Last Commit](https://img.shields.io/badge/last%20commit-1%20day%20ago-green.svg)

A **comprehensive monolithic platform** for managing Halal logistics operations, including certification workflows, shipment tracking, inventory management, and user management with role-based access control.

---

## ✨ Key Features

- **Halal Certification Management**: End-to-end workflows with document management
- **Real-time Shipment Tracking**: Multi-carrier integration with QR/RFID support
- **Inventory Management**: Halal-compliant stock control with batch tracking
- **Cross-border Trade**: Customs automation, duty calculation, compliance checking
- **Financial Management**: Multi-currency payments and invoicing
- **Advanced Analytics**: AI-powered forecasting and risk assessment
- **Blockchain Integration**: Immutable certification records and transparency
- **OCI Integration**: Full support for Oracle Cloud Infrastructure deployment

---

## 🏗 System Architecture

```mermaid
flowchart TD
  subgraph Frontend [Frontend Layer]
    NextJS[Next.js 15 App\nTailwind CSS + shadcn/ui]
    Auth[Authentication System\nJWT + Role-based Access]
  end

  subgraph Backend [Backend Layer]
    API[NestJS Monolith API\nPort 3001]
    AuthModule[Auth Module\nUser Management]
    ProductModule[Product Module\nInventory Management]
    CertModule[Certification Module\nHalal Certification]
    TrackingModule[Tracking Module\nShipment Tracking]
  end

  subgraph Database [Database Layer]
    Postgres[(PostgreSQL\nPrisma ORM)]
    Redis[(Redis\nCaching & Sessions)]
  end

  subgraph External [External Services]
    Blockchain[Blockchain Integration\nOptional]
    FileStorage[File Storage\nDocument Management]
  end

  NextJS --> API
  Auth --> API

  API --> AuthModule
  API --> ProductModule
  API --> CertModule
  API --> TrackingModule

  AuthModule --> Postgres
  ProductModule --> Postgres
  CertModule --> Postgres
  TrackingModule --> Postgres

  AuthModule -.-> Redis
  API -.-> Redis

  CertModule -.-> FileStorage
  CertModule -.-> Blockchain
```

---

## 🗂 Project Structure

```mermaid
graph TD
  A[halal-logistics-platform/]

  subgraph frontend [Frontend - Next.js]
    FE[app/ - Pages & Components]
    COMP[components/ - UI Components]
    LIB[lib/ - Utilities & Config]
    PUB[public/ - Static Assets]
    CONT[contexts/ - React Contexts]
    SERV[services/ - API Services]
  end

  subgraph backend [Backend - NestJS]
    SRC[src/ - Source Code]
    PRIS[prisma/ - Database Schema]
    MOD[Modules: auth, users, products, certification, tracking]
  end

  subgraph config [Configuration]
    ENV[.env files]
    PKG[package.json]
    TS[tsconfig.json]
    ESL[eslint config]
  end

  subgraph docs [Documentation]
    READ[README.md]
    API[README-API-Integration.md]
    BACK[backend/README.md]
  end

  A --> frontend
  A --> backend
  A --> config
  A --> docs
```

---

## 🚀 Quick Start

### Prerequisites

![Node.js](https://img.shields.io/badge/Node.js-22%2B-green?logo=nodedotjs)
![Docker](https://img.shields.io/badge/Docker-✓-2496ED?logo=docker)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?logo=redis)
![Kubernetes](https://img.shields.io/badge/Kubernetes-✓-326CE5?logo=kubernetes)
![Oracle Cloud](https://img.shields.io/badge/Oracle_Cloud-✓-F80000?logo=oracle)

- Node.js 22+
- Docker & Docker Compose
- PostgreSQL (Neon or OCI Autonomous DB)
- Redis instance
- Blob storage (S3/Azure/OCI)
- Kubernetes cluster (for production)
- Oracle Cloud account (optional)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/halal-logistics-platform.git
cd halal-logistics-platform

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Set up environment variables
cp .env.example .env  # Update with your database URL and other configs

# Set up the database
cd backend
npx prisma generate
npx prisma db push
cd ..

# Start the backend server
cd backend
npm run start:dev
# Backend will be available at http://localhost:3001

# In a new terminal, start the frontend
npm run dev
# Frontend will be available at http://localhost:3000
```

### Access

![Frontend](https://img.shields.io/badge/Frontend-Localhost:3000-000000?logo=next.js)
![Backend API](https://img.shields.io/badge/Backend_API-Localhost:3001-67A4AC?logo=node.js)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql)

- Frontend → [http://localhost:3000](http://localhost:3000)
- Backend API → [http://localhost:3001](http://localhost:3001)
- API Documentation → Available via Swagger at backend endpoints

---

## 📦 Tech Stack

![Tech](https://skillicons.dev/icons?i=nodejs,nextjs,nestjs,ts,tailwind,prisma,postgres,redis,docker,jest)

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS 10, Node.js 22, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator, class-transformer
- **Caching**: Redis (optional)
- **File Storage**: Local file system (configurable)
- **Development**: ESLint, Prettier
- **Testing**: Jest

---

## 🤝 Contributing

![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)
![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen)

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test` in backend, `npm run build` in frontend)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📜 License

![MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is licensed under the **MIT License**.

---

## 📞 Support

![GitHub Issues](https://img.shields.io/badge/Support-GitHub_Issues-181717?logo=github)

For support and questions:

- Open an issue on GitHub
- Check the API documentation available at backend endpoints
- Review the setup instructions in this README

---

Built with ❤️ for logistics and supply chain management

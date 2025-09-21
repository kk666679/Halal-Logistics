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
![Issues](https://img.shields.io/github/issues/your-org/halal-logistics-platform)
![PRs](https://img.shields.io/github/issues-pr/your-org/halal-logistics-platform)
![Discord](https://img.shields.io/discord/1234567890?label=discord)
![Twitter Follow](https://img.shields.io/twitter/follow/halallogistics_halalchain?style=social)

A **comprehensive microservices-based platform** for managing Halal logistics operations, including certification workflows, shipment tracking, inventory management, compliance auditing, and cross-border trade facilitation.

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
  subgraph FrontendLayer [Frontend Layer]
    NextJS[Next.js 15 App\nTailwind CSS + shadcn/ui]
    Mobile[React Native App\nCross-platform]
    AdminPanel[Admin Dashboard\nAdvanced Analytics]
  end

  subgraph APIGateway [API Gateway Layer]
    Gateway[NestJS API Gateway\nAuth + Rate Limiting]
    BFF1[Backend for Frontend\nWeb]
    BFF2[Backend for Frontend\nMobile]
  end

  subgraph Microservices [Microservices Layer]
    Auth[Auth Service\nJWT + RBAC]
    Cert[Certification Service]
    Ship[Shipment Service]
    Inv[Inventory Service]
    Audit[Audit Service]
    Finance[Finance Service]
    Risk[Risk Management]
    AI[AI Service]
    Blockchain[Blockchain Service]
  end

  subgraph Infrastructure [Infrastructure Layer]
    Redis[Redis Cache + Pub/Sub]
    Postgres[PostgreSQL Neon]
    Blob[Blob Storage]
    Kafka[Kafka Streaming]
    K8s[Kubernetes]
    OCI[Oracle Cloud Infrastructure]
  end

  NextJS --> BFF1
  Mobile --> BFF2
  AdminPanel --> Gateway
  BFF1 --> Gateway
  BFF2 --> Gateway

  Gateway --> Auth
  Gateway --> Cert
  Gateway --> Ship
  Gateway --> Inv
  Gateway --> Audit
  Gateway --> Finance
  Gateway --> Risk
  Gateway --> AI
  Gateway --> Blockchain

  Auth -.-> Redis
  Cert -.-> Redis
  Ship -.-> Redis
  Inv -.-> Redis

  Auth --> Postgres
  Cert --> Postgres
  Ship --> Postgres
  Inv --> Postgres
  Audit --> Postgres

  Cert --> Blob
  Audit --> Blob

  Cert --> Kafka
  Ship --> Kafka
  Risk --> Kafka

  Postgres -.-> OCI
  Redis -.-> OCI
  Blob -.-> OCI
  Kafka -.-> OCI
  K8s -.-> OCI
```

---

## 🗂 Project Structure

```mermaid
graph TD
  A[halal-logistics-platform/]

  subgraph apps
    AG[api-gateway]
    AU[auth-service]
    CE[certification-service]
    SH[shipment-service]
    IN[inventory-service]
    AU2[audit-service]
    FI[finance-service]
    AI[ai-service]
    BC[blockchain-service]
    OCI[oci-integration]
    FE[frontend]
  end

  subgraph packages
    SHD[shared]
    PRO[proto]
  end

  A --> apps
  A --> packages
  A --> CFG[docker-compose.yml]
  A --> CFG2[docker-compose.prod.yml]
  A --> CFG3[docker-compose.oci.yml]
  A --> PKG[package.json]
  A --> DOC[README.md]
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
# Clone
git clone https://github.com/your-org/halal-logistics-platform.git
cd halal-logistics-platform

# Copy environment templates
cp .env.example .env
cp apps/auth-service/.env.example apps/auth-service/.env
...

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec auth-service npm run db:migrate
...
```

### Access

![Frontend](https://img.shields.io/badge/Frontend-Localhost:3000-000000?logo=next.js)
![API](https://img.shields.io/badge/API_Localhost:3000/api-67A4AC?logo=node.js)
![Docs](https://img.shields.io/badge/Docs-Localhost:3000/api/docs-6E5494?logo=swagger)
![Admin](https://img.shields.io/badge/Admin-Localhost:3000/admin-FF6B6B?logo=react)
![OCI Console](https://img.shields.io/badge/OCI_Console-Cloud_Console-F80000?logo=oracle)

- Frontend → [http://localhost:3000](http://localhost:3000)
- API Gateway → [http://localhost:3000/api](http://localhost:3000/api)
- API Docs (Swagger) → [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Admin Dashboard → [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📦 Tech Stack

![Tech](https://skillicons.dev/icons?i=nodejs,nextjs,nestjs,ts,tailwind,prisma,postgres,redis,docker,aws,gcp,azure,kafka,kubernetes,react,graphql,jest,oracle)

- **Frontend**: Next.js 15, React 19, Tailwind, shadcn/ui
- **Backend**: NestJS, Node.js 22
- **Database**: PostgreSQL (Neon/OCI Autonomous)
- **ORM**: Prisma
- **Caching**: Redis
- **Messaging**: Kafka, Redis Pub/Sub
- **Storage**: S3/Azure/OCI Object Storage
- **Blockchain**: Ethereum/Hyperledger
- **AI/ML**: TensorFlow\.js
- **Infra**: Docker, Kubernetes, OCI

---

## 🤝 Contributing

![Contributions](https://img.shields.io/badge/Contributions-Welcome-brightgreen)
![PRs](https://img.shields.io/badge/PRs-Welcome-brightgreen)
![Good First Issue](https://img.shields.io/github/issues/your-org/halal-logistics-platform/good%20first%20issue)
![Help Wanted](https://img.shields.io/github/issues/your-org/halal-logistics-platform/help%20wanted)
![OCI Contributions](https://img.shields.io/badge/Contributions-OCI_Integration-F80000?logo=oracle)

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md).

1. Fork the repo
2. Create feature branch
3. Commit & push
4. Open a PR

Special call for **OCI integration contributors** 🚀

---

## 📜 License

![MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

This project is licensed under the **MIT License**.

---

## 📞 Support

![GitHub Issues](https://img.shields.io/badge/Support-GitHub_Issues-181717?logo=github)
![Email](https://img.shields.io/badge/Email-support%40halallogistics.com-EA4335?logo=gmail)
![Docs](https://img.shields.io/badge/Docs-docs.halallogistics.com-6E5494?logo=readthedocs)
![Discord](https://img.shields.io/discord/1234567890?label=discord&logo=discord)
![Twitter](https://img.shields.io/twitter/follow/halallogistics?style=social&logo=twitter)
![OCI Forum](https://img.shields.io/badge/Support-OCI_Forum-F80000?logo=oracle)

For support and questions:

- Open an issue on GitHub
- Email: [support@halallogistics.xyz](mailto:support@halallogistics.xyz)
- Documentation: docs.halallogistics.com
- Discord: Join our community
- Twitter: @halallogistics_halalchain
- OCI Forum: Oracle Cloud Infrastructure Forum

---

Built with ❤️ for the Halal logistics industry
![Halal](https://img.shields.io/badge/Halal-Certified-green)
![Quality](https://img.shields.io/badge/Quality-Assured-blue)
![Compliance](https://img.shields.io/badge/Compliance-100%25-brightgreen)
![Transparency](https://img.shields.io/badge/Transparency-Blockchain-3C3C3D)
![OCI Ready](https://img.shields.io/badge/Deployment-OCI_Ready-F80000?logo=oracle)

**Halal Certified • Quality • Compliance • Transparency • OCI Ready**

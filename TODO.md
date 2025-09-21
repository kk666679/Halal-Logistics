# Dependency Cleanup and Stack Alignment TODO

## 📋 Analysis Complete ✅
- Frontend: Next.js 14.2.32 → 15, React 18 → 19, Missing TensorFlow.js
- Backend: Mongoose → Prisma, Missing Redis/Kafka/Storage/Blockchain clients
- All shadcn/ui components properly configured

## 🚀 Implementation Steps

### 1. Update Frontend Dependencies
- [ ] Upgrade Next.js from 14.2.32 to 15
- [ ] Upgrade React from 18 to 19
- [ ] Add TensorFlow.js for AI/ML
- [ ] Update React types to match React 19

### 2. Replace Backend Database Layer
- [ ] Remove Mongoose and @nestjs/mongoose from backend/package.json
- [ ] Install Prisma ORM and @prisma/client
- [ ] Install PostgreSQL client (@types/pg)
- [ ] Create Prisma schema file
- [ ] Migrate existing schemas to Prisma format

### 3. Add Missing Backend Dependencies
- [ ] Install Redis client (ioredis)
- [ ] Install Kafka client (@kafka/client)
- [ ] Install AWS SDK for S3 storage
- [ ] Install Web3.js for blockchain integration

### 4. Update Schema Files
- [ ] Convert user.schema.ts to Prisma schema
- [ ] Convert product.schema.ts to Prisma schema
- [ ] Convert certification.schema.ts to Prisma schema
- [ ] Convert tracking.schema.ts to Prisma schema

### 5. Update Service Implementations
- [ ] Update users.service.ts to use Prisma
- [ ] Update products.service.ts to use Prisma
- [ ] Update certification.service.ts to use Prisma
- [ ] Update tracking.service.ts to use Prisma

### 6. Clean Up and Reinstall
- [ ] Remove package-lock.json files
- [ ] Run npm install in both frontend and backend
- [ ] Check for any dependency conflicts

### 7. Update Configuration
- [ ] Update environment variables for new services
- [ ] Update TypeScript configurations if needed
- [ ] Update package.json scripts if needed

### 8. Testing and Verification
- [ ] Test frontend build and dev server
- [ ] Test backend build and dev server
- [ ] Verify database connections
- [ ] Test API endpoints functionality

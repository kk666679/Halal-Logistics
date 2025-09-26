# Halal Logistics Platform Deployment Guide

This guide provides comprehensive instructions for deploying the Halal Logistics Platform to production environments.

## 🏗️ Architecture Overview

The platform consists of:
- **Frontend**: Next.js 15 application with TypeScript
- **Backend**: NestJS API with PostgreSQL database
- **Database**: PostgreSQL with Prisma ORM
- **Optional**: Redis for caching, blockchain integration

## 🚀 Quick Start Deployment

### Using Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/halal-logistics-platform.git
   cd halal-logistics-platform
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

3. **Deploy with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

### Manual Deployment

#### 1. Database Setup

**PostgreSQL Setup:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE halalchain;
CREATE USER halalchain WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE halalchain TO halalchain;
ALTER USER halalchain CREATEDB;
\q
```

**Prisma Setup:**
```bash
cd backend
npx prisma generate
npx prisma db push
```

#### 2. Backend Deployment

**Install dependencies:**
```bash
cd backend
npm install --production
```

**Build the application:**
```bash
npm run build
```

**Set environment variables:**
```bash
# .env file
NODE_ENV=production
DATABASE_URL="postgresql://halalchain:your-secure-password@localhost:5432/halalchain?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
FRONTEND_URL=https://yourdomain.com
```

**Start the backend:**
```bash
npm run start:prod
```

#### 3. Frontend Deployment

**Install dependencies:**
```bash
npm install --production
```

**Build the application:**
```bash
npm run build
```

**Set environment variables:**
```bash
# .env.local file
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

**Start the frontend:**
```bash
npm start
```

## ☁️ Cloud Deployment Options

### 1. Oracle Cloud Infrastructure (OCI)

#### Backend Deployment on OCI

1. **Create OCI Compute Instance:**
   - Use Oracle Linux 8 or Ubuntu 20.04
   - Minimum 2 CPU, 4GB RAM
   - Enable port 3001 in security group

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Deploy Backend:**
   ```bash
   git clone https://github.com/your-org/halal-logistics-platform.git
   cd halal-logistics-platform/backend
   npm install --production
   npm run build
   pm2 start dist/main.js --name halalchain-backend
   ```

#### Database Setup on OCI

1. **Create Autonomous Database:**
   - Use OCI Console to create PostgreSQL database
   - Configure network access
   - Get connection string

2. **Update Backend Configuration:**
   ```env
   DATABASE_URL="postgresql://username:password@database-host:5432/halalchain?schema=public"
   ```

#### Frontend Deployment on OCI

1. **Create Load Balancer:**
   - Configure HTTPS termination
   - Set up SSL certificate
   - Route traffic to backend instances

2. **Deploy Frontend:**
   ```bash
   cd frontend
   npm run build
   # Upload to OCI Object Storage or use compute instance
   ```

### 2. Vercel (Frontend Only)

1. **Connect to Vercel:**
   ```bash
   npm i -g vercel
   vercel --prod
   ```

2. **Configure Environment Variables:**
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

### 3. Railway

1. **Deploy Backend:**
   ```bash
   cd backend
   railway login
   railway link
   railway up
   ```

2. **Deploy Frontend:**
   ```bash
   cd ../
   railway up
   ```

## 🔧 Environment Configuration

### Production Environment Variables

#### Backend (.env)
```env
# Application
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL="postgresql://halalchain:secure-password@db-host:5432/halalchain?schema=public"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://yourdomain.com

# Optional: Redis
REDIS_URL=redis://localhost:6379

# Optional: Blockchain
BLOCKCHAIN_API_URL=https://api.blockchain-provider.com
BLOCKCHAIN_API_KEY=your-blockchain-api-key

# Optional: File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DEST=./uploads

# Optional: Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Logging
LOG_LEVEL=info
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_APP_NAME=HalalChain
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🔒 Security Considerations

### 1. SSL/TLS Configuration

- Use HTTPS for all communications
- Configure SSL certificates
- Enable HSTS headers
- Use secure cookies for authentication

### 2. Database Security

- Use strong passwords
- Enable database encryption at rest
- Configure firewall rules
- Regular security updates

### 3. API Security

- Rate limiting implementation
- Input validation and sanitization
- CORS configuration
- API versioning

### 4. Authentication Security

- Use strong JWT secrets
- Implement refresh token rotation
- Enable account lockout policies
- Regular security audits

## 📊 Monitoring and Logging

### Application Monitoring

1. **Health Checks:**
   - Backend: `GET /health`
   - Database connectivity
   - External service connectivity

2. **Performance Monitoring:**
   - Response times
   - Database query performance
   - Memory and CPU usage

### Logging Configuration

**Backend Logging:**
```typescript
// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'halalchain-backend' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

**Frontend Error Tracking:**
- Implement error boundary components
- Use error tracking services (Sentry, LogRocket)
- Monitor Core Web Vitals

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Build application
      run: npm run build
    - name: Deploy to server
      run: |
        echo "${{ secrets.SSH_PRIVATE_KEY }}" > key
        chmod 600 key
        ssh -i key -o StrictHostKeyChecking=no user@server 'cd /app && git pull && npm run build && pm2 restart halalchain'
```

## 🧪 Testing Production Deployment

### 1. Health Check Endpoints

- Backend: `GET https://api.yourdomain.com/health`
- Frontend: `GET https://yourdomain.com/health`

### 2. Database Connectivity

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"
```

### 3. API Functionality

```bash
# Test authentication
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","role":"SUPPLIER"}'

# Test product endpoints
curl -X GET https://api.yourdomain.com/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Frontend Functionality

- Test user registration and login
- Verify product management features
- Test certification workflows
- Validate shipment tracking

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check database connectivity
npx prisma db ping

# View database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

#### 2. Application Startup Issues
```bash
# Check application logs
pm2 logs halalchain-backend

# Verify environment variables
printenv | grep -E "(DATABASE_URL|JWT_SECRET|PORT)"
```

#### 3. Performance Issues
```bash
# Monitor system resources
htop

# Check database performance
EXPLAIN ANALYZE SELECT * FROM products WHERE category = 'MEAT_POULTRY';
```

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
DEBUG=halalchain:*
LOG_LEVEL=debug
```

## 📞 Support and Maintenance

### Regular Maintenance Tasks

1. **Database Backups:**
   ```bash
   pg_dump halalchain > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Log Rotation:**
   ```bash
   sudo logrotate -f /etc/logrotate.d/halalchain
   ```

3. **Security Updates:**
   ```bash
   sudo apt update && sudo apt upgrade
   npm audit fix
   ```

4. **Performance Monitoring:**
   - Monitor database query performance
   - Check application response times
   - Monitor server resource usage

### Emergency Procedures

1. **Application Downtime:**
   - Check system logs
   - Verify database connectivity
   - Restart services if necessary

2. **Data Recovery:**
   - Restore from database backups
   - Verify data integrity
   - Test critical functionality

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancing:**
   - Use OCI Load Balancer
   - Implement health checks
   - Configure session persistence

2. **Database Scaling:**
   - Use read replicas
   - Implement connection pooling
   - Optimize queries

3. **Caching:**
   - Implement Redis caching
   - Cache frequently accessed data
   - Use CDN for static assets

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database configuration
- Implement query optimization

## 📚 Additional Resources

- [NestJS Production Deployment](https://docs.nestjs.com/deployment)
- [Next.js Production Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Setup](https://www.prisma.io/docs/guides/deployment/deployment-guides)
- [PostgreSQL Production Configuration](https://www.postgresql.org/docs/current/runtime-config.html)

## 🆘 Getting Help

For deployment support:
- Email: devops@halallogistics.com
- Documentation: https://docs.halallogistics.com/deployment
- Community: https://community.halallogistics.com

---

**Happy deploying! 🚀**

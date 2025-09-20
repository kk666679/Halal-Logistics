# Halal Logistics and Supply Chain Platform

A comprehensive full-stack application for managing Halal logistics operations, including certification workflows, shipment tracking, inventory management, and compliance auditing.

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router)
- **Backend**: NestJS API with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with role-based access control
- **UI**: Tailwind CSS + shadcn/ui components

## 📋 Features

### Core Modules
- 🧾 **Halal Certification Workflow** - Submit, review, and manage Halal certificates
- 🚚 **Shipment Tracking** - Real-time tracking with blockchain verification
- 🗄️ **Inventory Management** - Halal-certified product tracking with stock control
- 👥 **User Management** - Multi-role system (Supplier, Certifier, Auditor, Consumer)
- 📄 **Audit & Compliance** - Inspection scheduling and compliance reports
- 📊 **Analytics Dashboard** - Comprehensive statistics and reporting

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- MongoDB database (local or cloud)
- npm or yarn

### 1. Clone and Setup

```bash
git clone <repository-url>
cd halal-logistics-platform
```

### 2. Install Dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

### 3. Database Setup

1. Install and start MongoDB (local or use MongoDB Atlas)
2. Copy environment template:
```bash
cd backend
cp .env.example .env
```

Update `backend/.env`:
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
```

### 4. Start Development Servers

#### Backend (Terminal 1)
```bash
cd backend
npm run start:dev
```

#### Frontend (Terminal 2)
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/            # Authentication pages
│   ├── register/         # User registration
│   ├── certifications/   # Certification management
│   ├── shipments/        # Shipment tracking
│   ├── inventory/        # Inventory management
│   └── audit/            # Compliance & audit logs
├── backend/              # NestJS API
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── users/        # User management module
│   │   ├── products/     # Product management module
│   │   ├── certification/ # Certification module
│   │   ├── tracking/     # Shipment tracking module
│   │   ├── common/       # Shared utilities
│   │   └── main.ts       # Application entry point
│   └── package.json      # Backend dependencies
├── components/           # Reusable UI components
└── lib/                  # Utility functions
```

## 🔐 Authentication & Authorization

### User Roles
- **SUPPLIER** - Product suppliers and manufacturers
- **CERTIFIER** - Certification authorities and reviewers
- **AUDITOR** - Quality auditors and compliance officers
- **CONSUMER** - End consumers and buyers

### API Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PATCH /auth/profile` - Update user profile

#### Products
- `GET /products` - Get all products
- `GET /products/low-stock` - Get low stock products
- `GET /products/stats` - Get product statistics
- `POST /products` - Create new product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Certifications
- `GET /certifications` - Get all certification applications
- `GET /certifications/my-applications` - Get user's applications
- `GET /certifications/stats` - Get certification statistics
- `POST /certifications` - Submit new certification application
- `PATCH /certifications/:id/status` - Update certification status

#### Tracking
- `GET /tracking` - Get all shipments
- `GET /tracking/my-shipments` - Get user's shipments
- `GET /tracking/stats` - Get tracking statistics
- `POST /tracking` - Create new shipment
- `POST /tracking/:id/events` - Add tracking event

#### Users
- `GET /users/profile` - Get current user profile
- `GET /users/stats` - Get user statistics

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

#### Backend
```bash
cd backend
npm run start:dev      # Start development server with hot reload
npm run build          # Build for production
npm run start:prod     # Start production server
npm run test           # Run unit tests
npm run test:e2e       # Run e2e tests
```

### Environment Variables

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
JWT_SECRET=your-super-secret-jwt-key
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Backend (Railway/Render/Fly.io)
```bash
npm run build
npm start
```

### Database (MongoDB Atlas)
- Use MongoDB Atlas for cloud database
- Configure connection string in production environment

## 🔒 Security Features

- JWT authentication with expiration
- Role-based access control
- Input validation with class-validator
- Password hashing with bcrypt
- CORS protection
- Rate limiting (configurable)
- SQL injection protection via Mongoose

## 📊 Analytics & Statistics

The platform provides comprehensive analytics:

- **User Statistics**: Registration trends, active users by role
- **Product Statistics**: Inventory levels, low stock alerts, category distribution
- **Certification Statistics**: Application status distribution, approval rates
- **Tracking Statistics**: Shipment status, delivery performance

## 📱 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Blockchain integration for immutable records
- [ ] RFID/IoT sensor data integration
- [ ] PDF certificate generation
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Real-time notifications
- [ ] File upload for certification documents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Built with ❤️ for the Halal logistics industry**
### API Endpoints

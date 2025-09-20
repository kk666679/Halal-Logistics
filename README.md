# Halal Logistics and Supply Chain Platform

A comprehensive full-stack application for managing Halal logistics operations, including certification workflows, shipment tracking, inventory management, and compliance auditing.

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router)
- **Backend**: Express.js API
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Prisma
- **Authentication**: JWT with role-based access control
- **UI**: Tailwind CSS + shadcn/ui components

## 📋 Features

### Core Modules
- 🧾 **Halal Certification Workflow** - Submit, review, and manage Halal certificates
- 🚚 **Shipment Tracking** - Real-time tracking with QR/RFID support
- 🗄️ **Storage & Transport Logs** - Cold chain and contamination tracking
- 👥 **User Management** - Role-based access (Admin, Certifier, Provider, Manufacturer)
- 📄 **Audit & Compliance** - Inspection scheduling and compliance reports
- 📦 **Inventory Management** - Halal-certified product tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
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

1. Create a Neon PostgreSQL database
2. Copy `.env` and update with your database URL:
```bash
cp backend/.env backend/.env.local
```

Update `backend/.env`:
```env
DATABASE_URL="postgresql://username:password@hostname/database"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

### 4. Database Migration

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 5. Start Development Servers

#### Backend (Terminal 1)
```bash
cd backend
npm run dev
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
├── backend/              # Express.js API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth & validation
│   │   ├── routes/       # API endpoints
│   │   └── server.js     # Main server file
│   └── prisma/           # Database schema
├── components/           # Reusable UI components
└── lib/                  # Utility functions
```

## 🔐 Authentication & Authorization

### User Roles
- **ADMIN** - Full system access
- **CERTIFIER** - Manage certifications and audits
- **PROVIDER** - Handle shipments and logistics
- **MANUFACTURER** - Submit certifications and manage inventory

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

#### Certifications
- `POST /api/certifications` - Submit certification request
- `GET /api/certifications` - Get all certifications (Admin/Certifier)
- `PATCH /api/certifications/:id` - Update certification status

#### Shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments` - Get shipments
- `GET /api/shipments/track/:trackingId` - Track shipment (public)
- `PATCH /api/shipments/:id` - Update shipment status

#### Inventory
- `POST /api/inventory` - Add inventory item
- `GET /api/inventory` - Get inventory items
- `PATCH /api/inventory/:id` - Update inventory item

#### Audits
- `POST /api/audits` - Submit audit log
- `GET /api/audits` - Get audit logs

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
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run prisma:studio  # Open Prisma Studio
npm run prisma:push    # Push schema changes
```

### Environment Variables

Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
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

### Database (Neon)
- Use the free tier for development
- Configure connection string in production environment

## 🔒 Security Features

- JWT authentication with expiration
- Role-based access control
- Rate limiting
- Input validation
- SQL injection protection via Prisma
- CORS configuration
- Helmet.js security headers

## 📱 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Blockchain integration for immutable records
- [ ] RFID/IoT sensor data integration
- [ ] PDF certificate generation
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

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

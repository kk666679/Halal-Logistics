# HalalChain API Integration Guide

## Overview

This document provides instructions for setting up and testing the API integration between the Next.js frontend and NestJS backend.

## Prerequisites

- Node.js 18+ installed
- MongoDB running locally or connection string configured
- npm or yarn package manager

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/halalchain

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Backend Server

```bash
cd backend
npm run start:dev
```

The backend will be available at: http://localhost:3001/api

## Frontend Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The `.env.local` file is already configured with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=HalalChain
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Start the Frontend Server

```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

## API Integration Features

### Authentication System

- **Login**: POST `/api/auth/login`
- **Register**: POST `/api/auth/register`
- **Profile**: GET `/api/auth/profile`
- **Update Profile**: PATCH `/api/auth/profile`

### Product Management

- **Get All Products**: GET `/api/products`
- **Get Product by ID**: GET `/api/products/:id`
- **Create Product**: POST `/api/products`
- **Update Product**: PATCH `/api/products/:id`
- **Delete Product**: DELETE `/api/products/:id`
- **Get Product Stats**: GET `/api/products/stats`
- **Get Low Stock Products**: GET `/api/products/low-stock`

### Certification Management

- **Get All Certifications**: GET `/api/certifications`
- **Get My Applications**: GET `/api/certifications/my-applications`
- **Create Certification**: POST `/api/certifications`
- **Update Certification**: PATCH `/api/certifications/:id`
- **Update Status**: PATCH `/api/certifications/:id/status`
- **Get Certification Stats**: GET `/api/certifications/stats`

### Tracking System

- **Get All Shipments**: GET `/api/tracking`
- **Get My Shipments**: GET `/api/tracking/my-shipments`
- **Create Shipment**: POST `/api/tracking`
- **Update Shipment**: PATCH `/api/tracking/:id`
- **Add Tracking Event**: POST `/api/tracking/:id/events`
- **Get Tracking Stats**: GET `/api/tracking/stats`

### User Management

- **Get User Profile**: GET `/api/users/profile`
- **Update User Profile**: PATCH `/api/users/profile`
- **Get Users by Role**: GET `/api/users/role/:role`
- **Get User Stats**: GET `/api/users/stats`

## Testing the Integration

### 1. Start Both Servers

1. Backend: `cd backend && npm run start:dev`
2. Frontend: `npm run dev`

### 2. Test Authentication

1. Open http://localhost:3000
2. Try logging in with different roles (supplier, certifier, auditor, consumer)
3. Check that you're redirected to the appropriate dashboard

### 3. Test Product Management

1. Login as a supplier
2. Navigate to the inventory dashboard
3. Check that products load from the API
4. Try adding a new product
5. Verify the product appears in the list

### 4. Test Real-time Data

1. Add some products via the frontend
2. Check that the stats update automatically
3. Try the search and filter functionality

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure the backend CORS configuration allows the frontend URL
   - Check that `FRONTEND_URL` is set correctly in backend `.env`

2. **Authentication Issues**
   - Verify JWT_SECRET is set in backend `.env`
   - Check that tokens are being stored/retrieved correctly
   - Ensure the API client is sending the Authorization header

3. **Database Connection Issues**
   - Verify MongoDB is running
   - Check the MONGODB_URI in backend `.env`
   - Ensure the database name is correct

4. **API Endpoint Issues**
   - Verify the backend is running on the correct port
   - Check that all endpoints are properly configured
   - Ensure the API client baseURL matches the backend URL

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
DEBUG=api:*
```

## Development Workflow

1. **Make Backend Changes**: Update controllers, services, or schemas
2. **Test API Endpoints**: Use tools like Postman or curl to test endpoints
3. **Update Frontend Types**: Update TypeScript interfaces in `lib/types.ts`
4. **Update Services**: Modify service methods in `services/` directory
5. **Update Components**: Connect components to use the API services
6. **Test Integration**: Verify the full flow works end-to-end

## Security Considerations

- JWT tokens are stored in localStorage (consider using httpOnly cookies for production)
- API requests include authentication headers
- Input validation is handled by both frontend (Zod) and backend (class-validator)
- CORS is configured to only allow specific origins
- Passwords are hashed using bcryptjs

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use environment variables for sensitive data
3. Configure proper CORS origins
4. Set up proper database connection
5. Configure reverse proxy (nginx) for API routing
6. Set up SSL certificates
7. Configure proper logging and monitoring

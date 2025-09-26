# Halal Logistics Platform API Documentation

## Overview

The Halal Logistics Platform API provides comprehensive endpoints for managing halal supply chain operations, including authentication, product management, certification workflows, and shipment tracking.

**Base URL**: `http://localhost:3001/api` (development) | `https://api.halallogistics.com/api` (production)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "SUPPLIER",
  "companyName": "Halal Foods Ltd",
  "phoneNumber": "+1234567890",
  "address": "123 Main St, City, Country"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx123abc456def789",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "SUPPLIER",
      "companyName": "Halal Foods Ltd",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "SUPPLIER"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clx123abc456def789",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "SUPPLIER",
      "companyName": "Halal Foods Ltd"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET /auth/profile
Get current user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx123abc456def789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "SUPPLIER",
    "companyName": "Halal Foods Ltd",
    "phoneNumber": "+1234567890",
    "address": "123 Main St, City, Country",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PATCH /auth/profile
Update user profile information.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "phoneNumber": "+0987654321",
  "address": "456 Updated St, New City, Country"
}
```

## Product Management

### Product Endpoints

#### GET /products
Get all products with optional filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search in product name and description
- `category` (string): Filter by category
- `supplier` (string): Filter by supplier
- `halalCertified` (boolean): Filter by halal certification status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc456def789",
      "name": "Premium Halal Chicken",
      "category": "MEAT_POULTRY",
      "sku": "HAL-CHK-001",
      "description": "Fresh halal certified chicken",
      "currentStock": 150,
      "minStock": 20,
      "maxStock": 500,
      "unit": "kg",
      "costPerUnit": 8.50,
      "sellingPrice": 12.99,
      "supplier": "Halal Poultry Farm",
      "location": "Farm A1, Sector 2",
      "expiryDate": "2024-06-15T00:00:00Z",
      "batchNumber": "BATCH-2024-001",
      "halalCertified": true,
      "certificationNumber": "HAL-2024-001",
      "certificationExpiry": "2025-01-15T00:00:00Z",
      "temperature": 4.5,
      "humidity": 65.0,
      "isActive": true,
      "createdBy": "clx123abc456def789",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

#### GET /products/low-stock
Get products with low stock levels.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc456def789",
      "name": "Halal Beef",
      "currentStock": 5,
      "minStock": 20,
      "unit": "kg"
    }
  ]
}
```

#### GET /products/stats
Get product statistics and analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 150,
    "totalValue": 125000.50,
    "lowStockItems": 12,
    "outOfStockItems": 3,
    "expiringSoonItems": 8,
    "categoryDistribution": {
      "MEAT_POULTRY": 45,
      "DAIRY_PRODUCTS": 30,
      "PROCESSED_FOODS": 25,
      "BEVERAGES": 20,
      "COSMETICS": 15,
      "PHARMACEUTICALS": 15
    }
  }
}
```

#### GET /products/:id
Get a specific product by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx123abc456def789",
    "name": "Premium Halal Chicken",
    "category": "MEAT_POULTRY",
    "sku": "HAL-CHK-001",
    "description": "Fresh halal certified chicken",
    "currentStock": 150,
    "minStock": 20,
    "maxStock": 500,
    "unit": "kg",
    "costPerUnit": 8.50,
    "sellingPrice": 12.99,
    "supplier": "Halal Poultry Farm",
    "location": "Farm A1, Sector 2",
    "expiryDate": "2024-06-15T00:00:00Z",
    "batchNumber": "BATCH-2024-001",
    "halalCertified": true,
    "certificationNumber": "HAL-2024-001",
    "certificationExpiry": "2025-01-15T00:00:00Z",
    "temperature": 4.5,
    "humidity": 65.0,
    "isActive": true,
    "createdBy": "clx123abc456def789",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### POST /products
Create a new product.

**Request Body:**
```json
{
  "name": "Premium Halal Chicken",
  "category": "MEAT_POULTRY",
  "sku": "HAL-CHK-001",
  "description": "Fresh halal certified chicken",
  "currentStock": 150,
  "minStock": 20,
  "maxStock": 500,
  "unit": "kg",
  "costPerUnit": 8.50,
  "sellingPrice": 12.99,
  "supplier": "Halal Poultry Farm",
  "location": "Farm A1, Sector 2",
  "expiryDate": "2024-06-15",
  "batchNumber": "BATCH-2024-001",
  "halalCertified": true,
  "certificationNumber": "HAL-2024-001",
  "certificationExpiry": "2025-01-15",
  "temperature": 4.5,
  "humidity": 65.0
}
```

#### PATCH /products/:id
Update an existing product.

**Request Body:**
```json
{
  "currentStock": 120,
  "sellingPrice": 13.50,
  "temperature": 4.2
}
```

#### DELETE /products/:id
Delete a product.

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

## Certification Management

### Certification Endpoints

#### GET /certifications
Get all certification applications.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `type` (string): Filter by certification type

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc456def789",
      "productName": "Premium Halal Chicken",
      "productCategory": "MEAT_POULTRY",
      "companyName": "Halal Foods Ltd",
      "companyAddress": "123 Main St, City, Country",
      "contactPerson": "John Doe",
      "contactEmail": "john@halalfoods.com",
      "contactPhone": "+1234567890",
      "productDescription": "Fresh halal certified chicken",
      "ingredients": ["Chicken", "Natural Spices", "Salt"],
      "manufacturingProcess": "Farm to table process with halal standards",
      "supplierDetails": "Certified halal poultry farm",
      "requestedCertificationType": "STANDARD",
      "expectedCompletionDate": "2024-02-15T00:00:00Z",
      "supportingDocuments": ["doc1.pdf", "doc2.pdf"],
      "status": "UNDER_REVIEW",
      "reviewComments": "Application under review",
      "submittedBy": "clx123abc456def789",
      "assignedTo": "clx987def654ghi321",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

#### GET /certifications/my-applications
Get current user's certification applications.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc456def789",
      "productName": "Premium Halal Chicken",
      "status": "UNDER_REVIEW",
      "submittedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### GET /certifications/stats
Get certification statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalApplications": 150,
    "pendingReview": 25,
    "approved": 95,
    "rejected": 20,
    "expired": 10,
    "approvalRate": 82.6
  }
}
```

#### POST /certifications
Submit a new certification application.

**Request Body:**
```json
{
  "productName": "Premium Halal Chicken",
  "productCategory": "MEAT_POULTRY",
  "companyName": "Halal Foods Ltd",
  "companyAddress": "123 Main St, City, Country",
  "contactPerson": "John Doe",
  "contactEmail": "john@halalfoods.com",
  "contactPhone": "+1234567890",
  "productDescription": "Fresh halal certified chicken",
  "ingredients": ["Chicken", "Natural Spices", "Salt"],
  "manufacturingProcess": "Farm to table process with halal standards",
  "supplierDetails": "Certified halal poultry farm",
  "requestedCertificationType": "STANDARD",
  "expectedCompletionDate": "2024-02-15",
  "supportingDocuments": ["doc1.pdf", "doc2.pdf"]
}
```

#### PATCH /certifications/:id
Update a certification application.

**Request Body:**
```json
{
  "reviewComments": "Additional documentation required",
  "status": "PENDING"
}
```

#### PATCH /certifications/:id/status
Update certification application status (for reviewers).

**Request Body:**
```json
{
  "status": "APPROVED",
  "reviewComments": "All requirements met",
  "certificationNumber": "HAL-2024-001",
  "validUntil": "2025-01-15"
}
```

## Shipment Tracking

### Tracking Endpoints

#### GET /tracking
Get all shipments.

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): Filter by status
- `origin` (string): Filter by origin
- `destination` (string): Filter by destination

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc456def789",
      "productName": "Premium Halal Chicken",
      "quantity": "150 kg",
      "origin": "Farm A1, Sector 2",
      "destination": "Distribution Center, City",
      "estimatedDelivery": "2024-01-20T14:30:00Z",
      "currentLocation": "Warehouse B, Transit",
      "status": "IN_TRANSIT",
      "progress": 65,
      "halalCertified": true,
      "temperature": {
        "current": 4.2,
        "min": 2.0,
        "max": 8.0,
        "unit": "C"
      },
      "carrier": "Halal Express",
      "blockchainVerified": true,
      "createdBy": "clx123abc456def789",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T12:45:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

#### GET /tracking/my-shipments
Get current user's shipments.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx123abc456def789",
      "productName": "Premium Halal Chicken",
      "status": "IN_TRANSIT",
      "estimatedDelivery": "2024-01-20T14:30:00Z",
      "currentLocation": "Warehouse B, Transit"
    }
  ]
}
```

#### GET /tracking/stats
Get tracking statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalShipments": 150,
    "inTransit": 45,
    "delivered": 95,
    "delayed": 8,
    "cancelled": 2,
    "onTimeDeliveryRate": 87.5
  }
}
```

#### POST /tracking
Create a new shipment.

**Request Body:**
```json
{
  "productName": "Premium Halal Chicken",
  "quantity": "150 kg",
  "origin": "Farm A1, Sector 2",
  "destination": "Distribution Center, City",
  "estimatedDelivery": "2024-01-20",
  "carrier": "Halal Express",
  "temperature": {
    "current": 4.2,
    "min": 2.0,
    "max": 8.0,
    "unit": "C"
  }
}
```

#### PATCH /tracking/:id
Update shipment information.

**Request Body:**
```json
{
  "currentLocation": "Warehouse B, Transit",
  "status": "IN_TRANSIT",
  "progress": 65
}
```

#### POST /tracking/:id/events
Add a tracking event to a shipment.

**Request Body:**
```json
{
  "location": "Warehouse B, Transit",
  "status": "IN_TRANSIT",
  "temperature": 4.2,
  "humidity": 65.0,
  "description": "Shipment transferred to delivery vehicle",
  "coordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

## Error Handling

All API responses follow a consistent error format:

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "status": 400,
  "errors": {
    "field": ["Error message for field"]
  }
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

API requests are rate limited to prevent abuse:
- **Authentication endpoints**: 10 requests per minute
- **Other endpoints**: 100 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

The API supports webhooks for real-time notifications:

### Webhook Events

- `shipment.created` - New shipment created
- `shipment.delivered` - Shipment delivered
- `certification.approved` - Certification approved
- `product.low_stock` - Product stock is low

### Webhook Payload

```json
{
  "event": "shipment.delivered",
  "data": {
    "id": "clx123abc456def789",
    "trackingNumber": "HAL-2024-001",
    "status": "DELIVERED",
    "deliveredAt": "2024-01-20T14:30:00Z"
  },
  "timestamp": "2024-01-20T14:30:00Z"
}
```

## Support

For API support and questions:
- Email: api@halallogistics.com
- Documentation: https://docs.halallogistics.com
- Status Page: https://status.halallogistics.com

# Halal Logistics Platform Database Schema

This document provides comprehensive documentation for the PostgreSQL database schema used by the Halal Logistics Platform.

## 🗄️ Database Overview

- **Database**: PostgreSQL 12+
- **ORM**: Prisma
- **Schema**: Public
- **Connection**: Configured via `DATABASE_URL` environment variable

## 📊 Database Schema

### Users Table

Stores user account information and authentication data.

```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY DEFAULT cuid(),
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    firstName VARCHAR NOT NULL,
    lastName VARCHAR NOT NULL,
    role USERROLE NOT NULL,
    companyName VARCHAR,
    phoneNumber VARCHAR,
    address VARCHAR,
    isActive BOOLEAN DEFAULT true,
    profileImage VARCHAR,
    certificationNumber VARCHAR,
    licenseNumber VARCHAR,
    refreshToken VARCHAR,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `email`: User's email address (unique)
- `password`: Hashed password (bcrypt)
- `firstName`: User's first name
- `lastName`: User's last name
- `role`: User role (SUPPLIER, CERTIFIER, AUDITOR, CONSUMER)
- `companyName`: Associated company name
- `phoneNumber`: Contact phone number
- `address`: Physical address
- `isActive`: Account status
- `profileImage`: Profile picture URL
- `certificationNumber`: Professional certification number
- `licenseNumber`: Business license number
- `refreshToken`: JWT refresh token
- `createdAt`: Account creation timestamp
- `updatedAt`: Last modification timestamp

**Indexes:**
- Primary key on `id`
- Unique index on `email`
- Index on `role` for filtering

### Products Table

Stores inventory and product information.

```sql
CREATE TABLE products (
    id VARCHAR PRIMARY KEY DEFAULT cuid(),
    name VARCHAR NOT NULL,
    category PRODUCTCATEGORY NOT NULL,
    sku VARCHAR NOT NULL,
    description VARCHAR,
    currentStock INTEGER NOT NULL,
    minStock INTEGER NOT NULL,
    maxStock INTEGER NOT NULL,
    unit VARCHAR NOT NULL,
    costPerUnit DECIMAL NOT NULL,
    sellingPrice DECIMAL NOT NULL,
    supplier VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    expiryDate TIMESTAMP NOT NULL,
    batchNumber VARCHAR NOT NULL,
    halalCertified BOOLEAN DEFAULT true,
    certificationNumber VARCHAR,
    certificationExpiry TIMESTAMP,
    temperature DECIMAL,
    humidity DECIMAL,
    isActive BOOLEAN DEFAULT true,
    createdBy VARCHAR NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `name`: Product name
- `category`: Product category (MEAT_POULTRY, DAIRY_PRODUCTS, etc.)
- `sku`: Stock keeping unit
- `description`: Product description
- `currentStock`: Current inventory level
- `minStock`: Minimum stock threshold
- `maxStock`: Maximum stock capacity
- `unit`: Unit of measurement (kg, pieces, liters, etc.)
- `costPerUnit`: Cost per unit
- `sellingPrice`: Selling price per unit
- `supplier`: Supplier name
- `location`: Storage location
- `expiryDate`: Product expiration date
- `batchNumber`: Manufacturing batch number
- `halalCertified`: Halal certification status
- `certificationNumber`: Halal certification number
- `certificationExpiry`: Certification expiration date
- `temperature`: Storage temperature (°C)
- `humidity`: Storage humidity (%)
- `isActive`: Product status
- `createdBy`: User who created the product
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp

**Indexes:**
- Primary key on `id`
- Index on `category` for filtering
- Index on `supplier` for supplier-based queries
- Index on `halalCertified` for certification filtering
- Index on `createdBy` for user-based queries
- Index on `expiryDate` for expiration tracking

### Certifications Table

Stores halal certification applications and records.

```sql
CREATE TABLE certifications (
    id VARCHAR PRIMARY KEY DEFAULT cuid(),
    productName VARCHAR NOT NULL,
    productCategory VARCHAR NOT NULL,
    companyName VARCHAR NOT NULL,
    companyAddress VARCHAR NOT NULL,
    contactPerson VARCHAR NOT NULL,
    contactEmail VARCHAR NOT NULL,
    contactPhone VARCHAR NOT NULL,
    productDescription VARCHAR NOT NULL,
    ingredients VARCHAR[] NOT NULL,
    manufacturingProcess VARCHAR NOT NULL,
    supplierDetails VARCHAR NOT NULL,
    requestedCertificationType CERTIFICATIONTYPE NOT NULL,
    expectedCompletionDate TIMESTAMP NOT NULL,
    supportingDocuments VARCHAR[] DEFAULT '{}',
    status CERTIFICATIONSTATUS DEFAULT 'PENDING',
    reviewComments VARCHAR,
    approvedBy VARCHAR,
    approvedAt TIMESTAMP,
    certificationNumber VARCHAR,
    validUntil TIMESTAMP,
    submittedBy VARCHAR NOT NULL,
    assignedTo VARCHAR,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (submittedBy) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL
);
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `productName`: Name of the product being certified
- `productCategory`: Product category
- `companyName`: Company applying for certification
- `companyAddress`: Company address
- `contactPerson`: Primary contact person
- `contactEmail`: Contact email address
- `contactPhone`: Contact phone number
- `productDescription`: Detailed product description
- `ingredients`: Array of product ingredients
- `manufacturingProcess`: Manufacturing process description
- `supplierDetails`: Supplier information
- `requestedCertificationType`: Type of certification (STANDARD, ORGANIC, PREMIUM)
- `expectedCompletionDate`: Expected completion date
- `supportingDocuments`: Array of document URLs
- `status`: Application status (PENDING, UNDER_REVIEW, APPROVED, REJECTED, EXPIRED)
- `reviewComments`: Reviewer comments
- `approvedBy`: User who approved the certification
- `approvedAt`: Approval timestamp
- `certificationNumber`: Issued certification number
- `validUntil`: Certification validity period
- `submittedBy`: User who submitted the application
- `assignedTo`: User assigned to review the application
- `createdAt`: Submission timestamp
- `updatedAt`: Last modification timestamp

**Indexes:**
- Primary key on `id`
- Index on `status` for status-based filtering
- Index on `submittedBy` for user applications
- Index on `assignedTo` for assigned reviews
- Index on `requestedCertificationType` for type filtering
- Index on `expectedCompletionDate` for deadline tracking

### Tracking Table

Stores shipment and logistics tracking information.

```sql
CREATE TABLE tracking (
    id VARCHAR PRIMARY KEY DEFAULT cuid(),
    productName VARCHAR NOT NULL,
    quantity VARCHAR NOT NULL,
    origin VARCHAR NOT NULL,
    destination VARCHAR NOT NULL,
    estimatedDelivery TIMESTAMP NOT NULL,
    currentLocation VARCHAR,
    status TRACKINGSTATUS DEFAULT 'PENDING',
    progress INTEGER NOT NULL,
    halalCertified BOOLEAN DEFAULT true,
    temperature JSON DEFAULT '{"current": 0, "min": 0, "max": 0, "unit": "C"}',
    carrier VARCHAR NOT NULL,
    blockchainVerified BOOLEAN DEFAULT true,
    createdBy VARCHAR NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `productName`: Name of the shipped product
- `quantity`: Quantity being shipped
- `origin`: Shipment origin location
- `destination`: Shipment destination
- `estimatedDelivery`: Estimated delivery date
- `currentLocation`: Current shipment location
- `status`: Shipment status (PENDING, IN_TRANSIT, DELIVERED, DELAYED, CANCELLED)
- `progress`: Shipment progress percentage (0-100)
- `halalCertified`: Halal certification status
- `temperature`: Temperature monitoring data (JSON)
- `carrier`: Shipping carrier company
- `blockchainVerified`: Blockchain verification status
- `createdBy`: User who created the shipment
- `createdAt`: Creation timestamp
- `updatedAt`: Last modification timestamp

**Indexes:**
- Primary key on `id`
- Index on `status` for status-based filtering
- Index on `origin` and `destination` for route-based queries
- Index on `createdBy` for user shipments
- Index on `estimatedDelivery` for delivery scheduling

### Tracking Events Table

Stores detailed tracking events for shipments.

```sql
CREATE TABLE tracking_events (
    id VARCHAR PRIMARY KEY DEFAULT cuid(),
    location VARCHAR NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    status TRACKINGSTATUS NOT NULL,
    temperature DECIMAL,
    humidity DECIMAL,
    description VARCHAR NOT NULL,
    blockchainHash VARCHAR,
    verifiedBy VARCHAR,
    coordinates JSON,
    trackingId VARCHAR NOT NULL,
    userId VARCHAR,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (trackingId) REFERENCES tracking(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);
```

**Fields:**
- `id`: Unique identifier (CUID format)
- `location`: Event location
- `timestamp`: Event timestamp
- `status`: Shipment status at event
- `temperature`: Temperature reading
- `humidity`: Humidity reading
- `description`: Event description
- `blockchainHash`: Blockchain transaction hash
- `verifiedBy`: User who verified the event
- `coordinates`: GPS coordinates (JSON)
- `trackingId`: Associated tracking record
- `userId`: User who recorded the event
- `createdAt`: Event creation timestamp
- `updatedAt`: Last modification timestamp

**Indexes:**
- Primary key on `id`
- Index on `trackingId` for shipment events
- Index on `timestamp` for chronological ordering
- Index on `location` for location-based queries

## 🔗 Relationships

### User Relationships
- One user can create many products
- One user can submit many certification applications
- One user can be assigned to review many certifications
- One user can create many tracking records
- One user can record many tracking events

### Product Relationships
- Each product is created by one user
- Products are referenced in certification applications

### Certification Relationships
- Each certification is submitted by one user
- Each certification can be assigned to one reviewer
- Certifications reference products being certified

### Tracking Relationships
- Each tracking record is created by one user
- Each tracking record can have many tracking events
- Each tracking event belongs to one tracking record
- Each tracking event can be recorded by one user

## 📊 Enums and Types

### UserRole Enum
```sql
CREATE TYPE USERROLE AS ENUM (
    'SUPPLIER',
    'CERTIFIER',
    'AUDITOR',
    'CONSUMER'
);
```

### ProductCategory Enum
```sql
CREATE TYPE PRODUCTCATEGORY AS ENUM (
    'MEAT_POULTRY',
    'DAIRY_PRODUCTS',
    'PROCESSED_FOODS',
    'BEVERAGES',
    'COSMETICS',
    'PHARMACEUTICALS'
);
```

### CertificationStatus Enum
```sql
CREATE TYPE CERTIFICATIONSTATUS AS ENUM (
    'PENDING',
    'UNDER_REVIEW',
    'APPROVED',
    'REJECTED',
    'EXPIRED'
);
```

### CertificationType Enum
```sql
CREATE TYPE CERTIFICATIONTYPE AS ENUM (
    'STANDARD',
    'ORGANIC',
    'PREMIUM'
);
```

### TrackingStatus Enum
```sql
CREATE TYPE TRACKINGSTATUS AS ENUM (
    'PENDING',
    'IN_TRANSIT',
    'DELIVERED',
    'DELAYED',
    'CANCELLED'
);
```

## 🔍 Key Queries and Views

### Product Inventory Summary
```sql
SELECT
    category,
    COUNT(*) as total_products,
    SUM(currentStock) as total_stock,
    AVG(sellingPrice) as avg_price
FROM products
WHERE isActive = true
GROUP BY category;
```

### Low Stock Alert
```sql
SELECT
    name,
    currentStock,
    minStock,
    (currentStock - minStock) as stock_deficit
FROM products
WHERE currentStock <= minStock
AND isActive = true
ORDER BY stock_deficit ASC;
```

### Certification Statistics
```sql
SELECT
    status,
    COUNT(*) as count,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
FROM certifications
GROUP BY status;
```

### Shipment Performance
```sql
SELECT
    status,
    COUNT(*) as shipment_count,
    AVG(progress) as avg_progress,
    COUNT(CASE WHEN estimatedDelivery < NOW() AND status != 'DELIVERED' THEN 1 END) as delayed_shipments
FROM tracking
GROUP BY status;
```

## 🔧 Database Maintenance

### Regular Maintenance Tasks

1. **Index Optimization:**
   ```sql
   REINDEX TABLE products;
   REINDEX TABLE certifications;
   REINDEX TABLE tracking;
   ```

2. **Vacuum and Analyze:**
   ```sql
   VACUUM ANALYZE products;
   VACUUM ANALYZE certifications;
   VACUUM ANALYZE tracking;
   VACUUM ANALYZE tracking_events;
   ```

3. **Log Cleanup:**
   ```sql
   DELETE FROM tracking_events
   WHERE createdAt < NOW() - INTERVAL '1 year';
   ```

### Performance Monitoring

1. **Slow Query Log:**
   ```sql
   SET log_min_duration_statement = 1000; -- Log queries > 1 second
   ```

2. **Connection Monitoring:**
   ```sql
   SELECT state, COUNT(*) FROM pg_stat_activity GROUP BY state;
   ```

3. **Table Statistics:**
   ```sql
   SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

## 🔒 Security Considerations

### Row Level Security (RLS)

Enable RLS policies for data access control:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;

-- Create policies for user data access
CREATE POLICY user_own_data ON products FOR ALL USING (createdBy = current_user_id());
CREATE POLICY user_own_certifications ON certifications FOR ALL USING (submittedBy = current_user_id());
CREATE POLICY user_own_tracking ON tracking FOR ALL USING (createdBy = current_user_id());
```

### Data Encryption

1. **Password Hashing:** Uses bcrypt with salt rounds
2. **Sensitive Data:** Encrypt PII data at rest
3. **Connection Encryption:** Use SSL/TLS for database connections

### Backup Strategy

1. **Daily Backups:**
   ```sql
   pg_dump -h localhost -U halalchain -F c -b -v -f backup_$(date +%Y%m%d).sql halalchain
   ```

2. **Automated Backup Script:**
   ```bash
   #!/bin/bash
   BACKUP_DIR="/var/backups/postgresql"
   DB_NAME="halalchain"
   pg_dump -h localhost -U halalchain -F c -b -v -f "$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql" $DB_NAME
   find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
   ```

## 📈 Scaling Considerations

### Partitioning Strategy

1. **Time-based Partitioning for Tracking Events:**
   ```sql
   CREATE TABLE tracking_events_2024 PARTITION OF tracking_events
   FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
   ```

2. **Category-based Partitioning for Products:**
   ```sql
   CREATE TABLE products_meat PARTITION OF products
   FOR VALUES IN ('MEAT_POULTRY');
   ```

### Read Replicas

Set up read replicas for improved read performance:
```sql
# In PostgreSQL configuration
primary_conninfo = 'host=primary-db port=5432 user=replica_user password=replica_pass'
```

## 🆘 Troubleshooting

### Common Issues

1. **Connection Pool Exhaustion:**
   ```sql
   SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
   ```

2. **Slow Queries:**
   ```sql
   SELECT query, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
   ```

3. **Lock Contention:**
   ```sql
   SELECT relation::regclass, mode, pid FROM pg_locks WHERE NOT granted;
   ```

### Performance Tuning

1. **Query Optimization:**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM products WHERE category = 'MEAT_POULTRY';
   ```

2. **Index Usage:**
   ```sql
   SELECT indexname, idx_scan, idx_tup_read, idx_tup_fetch
   FROM pg_stat_user_indexes
   ORDER BY idx_scan DESC;
   ```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Database Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

## 🆘 Support

For database-related support:
- Email: database@halallogistics.com
- Documentation: https://docs.halallogistics.com/database
- Community: https://community.halallogistics.com/database

---

**Database schema version: 1.0.0**
**Last updated: 2024-01-15**

# Role-Based Access Control (RBAC) Implementation

## Overview

This implementation provides a comprehensive Role-Based Access Control system with three user roles: `admin`, `seller`, and `user`. The system includes new modules for Orders and Reviews, along with logical features like inventory management and coupon systems.

## User Roles

### Admin
- Full access to all features
- Can manage all products, orders, and reviews
- Can view all user data
- Can create and manage coupons

### Seller
- Can create, update, and delete their own products
- Can view all orders (for fulfillment)
- Cannot modify other sellers' products
- Can view product reviews

### User
- Can place orders
- Can add reviews to products
- Can view their own orders
- Can apply coupons to orders

## Authentication Middleware

### `isAuthenticated` (authenticateToken)
Validates JWT token and attaches user to `req.user`

**Error Responses:**
```json
{
  "status": 0,
  "message": "No token provided",
  "data": null,
  "httpCode": 401
}
```

```json
{
  "status": 0,
  "message": "Authentication failed",
  "data": null,
  "httpCode": 401
}
```

### `hasRole(...roles)`
Checks if user's role matches allowed roles

**Error Response:**
```json
{
  "status": 0,
  "message": "Access denied: insufficient permissions",
  "data": null,
  "httpCode": 403
}
```

## Order Module

### Place Order (User Only)
**POST** `/api/orders`

**Request:**
```json
{
  "products": [
    { "productId": "p1", "quantity": 2 }
  ],
  "shippingAddress": "123 Main St",
  "couponCode": "DISCOUNT20" // Optional
}
```

**Response:**
```json
{
  "status": 1,
  "message": "Order placed successfully",
  "data": {
    "orderId": "ORD12345",
    "summary": {
      "totalItems": 3,
      "totalAmount": 3897.00
    }
  }
}
```

### Get User Orders
**GET** `/api/orders/user`

**Response:**
```json
[
  { 
    "_id": "ORD1", 
    "status": "pending",
    "totalAmount": 1299.99,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get All Orders (Admin/Seller)
**GET** `/api/orders`

**Response:**
```json
[
  { 
    "_id": "ORD1", 
    "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
    "products": [...],
    "status": "pending",
    "totalAmount": 1299.99
  }
]
```

### Apply Coupon
**POST** `/api/orders/:orderId/apply-coupon`

**Request:**
```json
{
  "couponCode": "DISCOUNT20"
}
```

**Response:**
```json
{
  "discountApplied": true,
  "newTotal": 1039.20,
  "discountAmount": 260.80
}
```

## Review Module

### Add Review (User Only)
**POST** `/api/reviews`

**Request:**
```json
{
  "productId": "p1",
  "rating": 5,
  "comment": "Excellent phone!"
}
```

**Response:**
```json
{
  "status": 1,
  "message": "Review submitted successfully",
  "data": { "reviewId": 1 }
}
```

### Get Product Reviews
**GET** `/api/reviews/product/:productId`

**Response:**
```json
[
  { 
    "user": { "id": 1, "name": "John Doe" },
    "rating": 5, 
    "comment": "Great product!",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Logical Features

### Inventory Management
- **Stock Validation**: Prevents orders when stock < requested quantity
- **Automatic Stock Update**: Decreases stock when order is placed
- **Low Stock Alert**: Logs alert when stock ≤ 5 units

**Error Response:**
```json
{
  "status": 0,
  "message": "Insufficient stock for product: iPhone 15",
  "data": null,
  "httpCode": 400
}
```

### Order Summary Calculation
- Dynamically calculates total from product price × quantity
- Includes coupon discounts
- Provides summary with total items and amount

### Coupon System
- **Percentage Discounts**: e.g., 20% off
- **Fixed Amount Discounts**: e.g., $50 off
- **Usage Limits**: Track and limit coupon usage
- **Minimum Order Amounts**: Require minimum spend
- **Maximum Discount Caps**: Prevent excessive discounts
- **Validity Periods**: Set start and end dates

## Database Schema

### Orders Table
```sql
CREATE TABLE Orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId VARCHAR(255) UNIQUE NOT NULL,
  userId INT NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
  totalAmount DECIMAL(10,2) NOT NULL,
  shippingAddress TEXT NOT NULL,
  items JSON NOT NULL,
  appliedCoupon VARCHAR(255),
  discountAmount DECIMAL(10,2) DEFAULT 0,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

### Reviews Table
```sql
CREATE TABLE Reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  productId INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  isVerified BOOLEAN DEFAULT FALSE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  UNIQUE KEY unique_user_product (userId, productId)
);
```

### Coupons Table
```sql
CREATE TABLE Coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(255) UNIQUE NOT NULL,
  discountType ENUM('percentage', 'fixed') NOT NULL,
  discountValue DECIMAL(10,2) NOT NULL,
  minOrderAmount DECIMAL(10,2) DEFAULT 0,
  maxDiscount DECIMAL(10,2),
  usageLimit INT DEFAULT -1,
  usedCount INT DEFAULT 0,
  validFrom DATETIME NOT NULL,
  validUntil DATETIME NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/logout` - User logout

### Products (with RBAC)
- `GET /api/products` - Get all products (Public)
- `GET /api/products/:id` - Get product by ID (Public)
- `POST /api/products` - Create product (Admin/Seller)
- `PUT /api/products/:id` - Update product (Admin/Seller with ownership)
- `DELETE /api/products/:id` - Delete product (Admin/Seller with ownership)

### Orders
- `POST /api/orders` - Place order (User)
- `GET /api/orders/user` - Get user orders (User)
- `GET /api/orders` - Get all orders (Admin/Seller)
- `POST /api/orders/:orderId/apply-coupon` - Apply coupon (User)
- `GET /api/orders/:orderId` - Get order details (User/Admin/Seller)
- `PATCH /api/orders/:orderId/status` - Update order status (Admin/Seller)

### Reviews
- `POST /api/reviews` - Add review (User)
- `GET /api/reviews/product/:productId` - Get product reviews (Public)
- `GET /api/reviews/product/:productId/stats` - Get review stats (Public)
- `PUT /api/reviews/:reviewId` - Update review (User who created it)
- `DELETE /api/reviews/:reviewId` - Delete review (User who created it or Admin)

## Security Features

### Ownership Logic
- Sellers can only modify their own products
- Users can only modify their own reviews
- Users can only view their own orders
- Admins have full access to all resources

### Input Validation
- Product stock validation before order placement
- Coupon validation (expiry, usage limits, minimum amounts)
- Review rating validation (1-5 stars)
- Unique constraint on user-product reviews

### Error Handling
- Comprehensive error messages for different scenarios
- Proper HTTP status codes
- Consistent response format

## Setup Instructions

1. **Run Migrations:**
   ```bash
   npx sequelize-cli db:migrate
   ```

2. **Run Seeders:**
   ```bash
   npx sequelize-cli db:seed:all
   ```

3. **Start Server:**
   ```bash
   npm start
   ```

## Testing the RBAC System

### Create Test Users
```bash
# Admin user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"password123","role":"admin"}'

# Seller user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Seller User","email":"seller@example.com","password":"password123","role":"seller"}'

# Regular user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Regular User","email":"user@example.com","password":"password123","role":"user"}'
```

### Test Order Placement
```bash
# Login and get token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' | jq -r '.data.token')

# Place order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "products": [{"productId": 1, "quantity": 2}],
    "shippingAddress": "123 Main St, City, State 12345"
  }'
```

This implementation provides a robust, secure, and scalable RBAC system with comprehensive order and review management capabilities. 
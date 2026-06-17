# ShopNest E-Commerce Platform
## Complete Project Documentation

**Version:** 1.0.0  
**Last Updated:** June 17, 2026  
**Author:** Raj Malviya  
**Project Type:** Full-Stack MERN Application

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Frontend Components](#frontend-components)
9. [Features Implemented](#features-implemented)
10. [Installation & Setup](#installation--setup)
11. [Environment Configuration](#environment-configuration)
12. [Security Implementation](#security-implementation)
13. [Key Features Detail](#key-features-detail)
14. [Testing Guide](#testing-guide)
15. [Deployment Instructions](#deployment-instructions)
16. [Future Enhancements](#future-enhancements)
17. [Troubleshooting](#troubleshooting)

---

## Executive Summary

**ShopNest** is a fully functional, production-ready e-commerce platform built using the MERN stack (MongoDB, Express, React, Node.js). The application provides a complete shopping experience with user authentication, product management, shopping cart, payment processing, and admin dashboard functionality.

### Key Highlights:
- ✅ Full-featured e-commerce platform
- ✅ JWT-based authentication with email verification
- ✅ Professional admin dashboard
- ✅ Razorpay payment integration (test mode)
- ✅ Cloud image storage (Cloudinary)
- ✅ Redux state management
- ✅ Responsive UI design
- ✅ RESTful API architecture

---

## Project Overview

### Project Goals:
1. Provide a seamless shopping experience for end users
2. Enable easy product management for administrators
3. Implement secure authentication and payment processing
4. Offer scalable architecture for future enhancements

### Core Functionality:
- User registration and authentication
- Product browsing and searching
- Shopping cart management
- Order placement with payment integration
- Admin product and order management
- User profile and order history
- Email notifications for key events

---

## Technology Stack

### Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | - | JavaScript runtime |
| **Framework** | Express.js | 5.2.1 | Web application framework |
| **Database** | MongoDB | - | NoSQL database |
| **ODM** | Mongoose | 9.6.2 | MongoDB object modeling |
| **Authentication** | JWT | 9.0.3 | Token-based authentication |
| **Encryption** | bcryptjs | 3.0.3 | Password hashing |
| **Payment Gateway** | Razorpay | 2.9.6 | Payment processing |
| **Email Service** | Nodemailer | 8.0.7 | Email sending |
| **Cloud Storage** | Cloudinary | 2.10.0 | Image hosting |
| **File Upload** | Multer | 2.1.1 | Middleware for file uploads |
| **CORS** | cors | 2.8.6 | Cross-origin resource sharing |
| **Environment** | dotenv | 17.4.2 | Environment variable management |
| **Dev Tool** | Nodemon | 3.1.14 | Auto-reload during development |

### Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Library** | React | 19.2.7 | UI component library |
| **Routing** | React Router | 7.17.0 | Client-side routing |
| **State Management** | Redux Toolkit | 2.12.0 | Predictable state management |
| **Redux Bindings** | React Redux | 9.3.0 | React integration for Redux |
| **Build Tool** | React Scripts | 5.0.1 | Webpack + Babel configuration |

### Development Dependencies
- **Testing Library:** React Testing Library v16.3.2
- **Jest:** Testing framework (via react-scripts)
- **ESLint:** Code quality checking

---

## System Architecture

### 3-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Frontend)                   │
│  React + Redux | Routes | Components | State Management     │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER (Backend)               │
│  Express Server | Routes | Controllers | Middleware         │
│  JWT Auth | Admin Checks | Error Handling                   │
└────────────────────────┬────────────────────────────────────┘
                         │ MongoDB Protocol
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER (Database)                     │
│  MongoDB | Collections | Schemas | Indexing                 │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
Request → CORS Middleware → Route Handler → Auth Middleware 
→ Admin Check (if needed) → Controller Logic → Database Query 
→ Response Formatting → JSON Response
```

### Authentication Flow

```
Register/Login → Password Hash/Verify → JWT Generation 
→ Token Stored in Frontend → Authorization Header in Requests 
→ Token Verification → Protected Route Access
```

### Payment Flow

```
Checkout → Razorpay Order Creation → Payment Modal Open 
→ User Enters Card Details → Razorpay Verification 
→ Order Saved to DB → Email Notification → Order Success
```

---

## Project Structure

### Root Directory
```
E-commerce full stack website/
├── backend/                          # Node.js/Express backend
├── frontend/                         # React frontend
├── node_modules/                     # Root dependencies
├── package.json                      # Root package config
├── package-lock.json                 # Dependency lock file
└── .gitignore                        # Git ignore rules
```

### Backend Structure (`/backend`)
```
backend/
│
├── config/                           # Configuration files
│   ├── db.js                        # MongoDB connection config
│   └── cloudinary.js                # Cloudinary API config
│
├── controllers/                      # Business logic handlers
│   ├── authController.js            # Auth logic (register, login, OTP)
│   ├── productController.js         # Product CRUD operations
│   ├── orderController.js           # Order management
│   ├── paymentController.js         # Razorpay integration
│   └── analyticsController.js       # Dashboard analytics
│
├── middleware/                       # Express middleware functions
│   ├── authMiddleware.js            # JWT verification
│   └── adminMiddleware.js           # Admin role authorization
│
├── model/                            # Mongoose schemas
│   ├── User.js                      # User schema & validation
│   ├── Product.js                   # Product schema & validation
│   └── Order.js                     # Order schema & validation
│
├── routes/                           # API endpoint definitions
│   ├── authRoutes.js                # /api/auth routes
│   ├── productRoutes.js             # /api/products routes
│   ├── orderRoutes.js               # /api/orders routes
│   ├── paymentRoutes.js             # /api/payment routes
│   └── analyticsRoutes.js           # /api/analytics routes
│
├── utils/                            # Utility functions
│   └── sendEmail.js                 # Nodemailer email utility
│
├── uploads/                          # Local file storage
│   └── [image files]                # Uploaded product images
│
├── .env                              # Environment variables
├── .env.example                      # Example env template
├── index.js                          # App entry point
├── server.js                         # Express server setup
├── seed.js                           # Database seeding script
├── package.json                      # Backend dependencies
└── node_modules/                     # Backend node packages
```

### Frontend Structure (`/frontend`)
```
frontend/
│
├── public/
│   └── index.html                   # HTML entry point
│
├── src/
│   ├── admin/                        # Admin panel pages
│   │   ├── AdminDashboard.jsx       # Admin main dashboard
│   │   ├── AdminProducts.jsx        # Product management
│   │   ├── AddProduct.jsx           # Add new product form
│   │   ├── EditProduct.jsx          # Edit product form
│   │   ├── AdminOrders.jsx          # Order management
│   │   └── AdminUsers.jsx           # User management
│   │
│   ├── components/                   # Reusable components
│   │   ├── Navbar.jsx               # Navigation bar
│   │   ├── Footer.jsx               # Footer component
│   │   └── ProductCard.jsx          # Product card display
│   │
│   ├── context/                      # React Context
│   │   └── AuthContext.jsx          # Authentication context provider
│   │
│   ├── pages/                        # Page components
│   │   ├── Home.jsx                 # Landing page
│   │   ├── Shop.jsx                 # Product listing
│   │   ├── ProductDetail.jsx        # Single product detail
│   │   ├── Cart.jsx                 # Shopping cart
│   │   ├── Checkout.jsx             # Checkout & payment
│   │   ├── Login.jsx                # User login
│   │   ├── Register.jsx             # User registration
│   │   ├── VerifyEmail.jsx          # Email OTP verification
│   │   ├── Profile.jsx              # User profile page
│   │   ├── OrderSuccess.jsx         # Order confirmation
│   │   ├── About.jsx                # About page
│   │   ├── ReturnPolicy.jsx         # Return policy page
│   │   └── Disclaimer.jsx           # Disclaimer page
│   │
│   ├── redux/                        # Redux state management
│   │   ├── store.js                 # Redux store configuration
│   │   └── cartSlice.js             # Cart state & actions
│   │
│   ├── styles/                       # CSS stylesheets
│   │   ├── global.css               # Global styles
│   │   ├── navbar.css               # Navbar styles
│   │   ├── auth.css                 # Auth pages styles
│   │   ├── cart.css                 # Cart styles
│   │   └── product.css              # Product styles
│   │
│   ├── App.jsx                       # Main App component with routing
│   └── index.js                      # React DOM entry point
│
├── .env                              # Frontend environment variables
├── package.json                      # Frontend dependencies
├── package-lock.json                 # Dependency lock file
└── node_modules/                     # Frontend node packages
```

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  verified: {
    type: Boolean,
    default: false
  },
  otp: String,
  otpExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `email` (unique), `role`

### Product Collection

```javascript
{
  _id: ObjectId,
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `category`, `price`, `name`

### Order Collection

```javascript
{
  _id: ObjectId,
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: ObjectId,
        ref: 'Product',
        required: true
      },
      qty: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  address: {
    fullName: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  paymentId: String,
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:** `userId`, `status`, `createdAt`

---

## API Documentation

### Base URL
- **Development:** `http://localhost:5000/api`
- **Production:** `https://your-domain.com/api`

### Authentication Routes (`/api/auth`)

#### 1. Register User
```
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (201):
{
  "message": "Registration successful. Please verify your email using the OTP sent to your email."
}
```

#### 2. Login User
```
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token_here"
}
```

#### 3. Verify Email
```
POST /verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}

Response (200):
{
  "message": "Email verified successfully"
}
```

#### 4. Resend OTP
```
POST /resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}

Response (200):
{
  "message": "A new OTP has been sent to your email."
}
```

#### 5. Get All Users (Admin Only)
```
GET /users
Authorization: Bearer {token}

Response (200):
[
  {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "verified": true
  }
]
```

### Product Routes (`/api/products`)

#### 1. Get All Products
```
GET /
Response (200):
[
  {
    "_id": "product_id",
    "name": "Product Name",
    "price": 999,
    "category": "Electronics",
    "imageURL": "image_url",
    "rating": 4.5,
    "stock": 50
  }
]
```

#### 2. Get Single Product
```
GET /:id
Response (200):
{
  "_id": "product_id",
  "name": "Product Name",
  "description": "Full description",
  "price": 999,
  "category": "Electronics",
  "imageURL": "image_url",
  "rating": 4.5,
  "numReviews": 25,
  "stock": 50
}
```

#### 3. Create Product (Admin Only)
```
POST /
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

FormData:
- name: "New Product"
- description: "Product description"
- price: 999
- category: "Electronics"
- stock: 50
- file: [image_file]

Response (201):
{
  "_id": "product_id",
  "name": "New Product",
  ...
}
```

#### 4. Update Product (Admin Only)
```
PUT /:id
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

FormData:
- name: "Updated Product"
- price: 1299
- [optional] file: [new_image_file]

Response (200):
{
  "_id": "product_id",
  "name": "Updated Product",
  ...
}
```

#### 5. Delete Product (Admin Only)
```
DELETE /:id
Authorization: Bearer {admin_token}

Response (200):
{
  "message": "Product removed"
}
```

### Order Routes (`/api/orders`)

#### 1. Create Order
```
POST /
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id",
      "qty": 2,
      "price": 999
    }
  ],
  "totalAmount": 1998,
  "address": {
    "fullName": "John Doe",
    "street": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentId": "pay_123456"
}

Response (201):
{
  "message": "Order created successfully",
  "order": {
    "_id": "order_id",
    "userId": "user_id",
    "items": [...],
    "totalAmount": 1998,
    "status": "Pending"
  }
}
```

#### 2. Get My Orders
```
GET /myorders
Authorization: Bearer {token}

Response (200):
[
  {
    "_id": "order_id",
    "totalAmount": 1998,
    "status": "Pending",
    "createdAt": "2026-06-17T10:30:00Z"
  }
]
```

#### 3. Get All Orders (Admin Only)
```
GET /
Authorization: Bearer {admin_token}

Response (200):
[
  {
    "_id": "order_id",
    "userId": { "_id": "user_id", "name": "John Doe" },
    "totalAmount": 1998,
    "status": "Pending"
  }
]
```

#### 4. Update Order Status (Admin Only)
```
PUT /:id/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "Shipped"
}

Response (200):
{
  "_id": "order_id",
  "status": "Shipped",
  ...
}
```

### Payment Routes (`/api/payment`)

#### 1. Create Razorpay Order
```
POST /order
Content-Type: application/json

{
  "amount": 1998
}

Response (200):
{
  "id": "order_123456",
  "entity": "order",
  "amount": 199800,
  "amount_paid": 0,
  "amount_due": 199800,
  "currency": "INR",
  "receipt": "rcptid",
  "status": "created",
  "attempts": 0,
  "notes": [],
  "created_at": 1623916800
}
```

#### 2. Verify Payment
```
POST /verify
Content-Type: application/json

{
  "razorpay_order_id": "order_123456",
  "razorpay_payment_id": "pay_123456",
  "razorpay_signature": "signature_hash"
}

Response (200):
{
  "message": "Payment verified successfully"
}
```

### Analytics Routes (`/api/analytics`)

#### 1. Get Dashboard Stats (Admin Only)
```
GET /dashboard
Authorization: Bearer {admin_token}

Response (200):
{
  "totalOrders": 150,
  "totalProducts": 50,
  "totalUsers": 500,
  "totalRevenue": 149500
}
```

---

## Frontend Components

### Page Components

#### Home Page (`pages/Home.jsx`)
- Landing page with featured products
- Hero section with call-to-action
- Product showcase

#### Shop Page (`pages/Shop.jsx`)
- Product listing with pagination
- Filtering and sorting options
- Add to cart functionality

#### Product Detail (`pages/ProductDetail.jsx`)
- Full product information display
- Product images
- Price and availability
- Add to cart button
- Related products

#### Cart (`pages/Cart.jsx`)
- Cart items display
- Quantity adjustment
- Remove items
- Total calculation
- Checkout button

#### Checkout (`pages/Checkout.jsx`)
- Shipping address form
- Order summary
- Payment integration with Razorpay
- Student bypass mode for testing

#### Authentication Pages
- **Login** (`pages/Login.jsx`): User login form
- **Register** (`pages/Register.jsx`): User registration with email
- **VerifyEmail** (`pages/VerifyEmail.jsx`): OTP email verification

#### User Pages
- **Profile** (`pages/Profile.jsx`): User profile and settings
- **OrderSuccess** (`pages/OrderSuccess.jsx`): Order confirmation

#### Information Pages
- **About** (`pages/About.jsx`): Company information
- **ReturnPolicy** (`pages/ReturnPolicy.jsx`): Return policy details
- **Disclaimer** (`pages/Disclaimer.jsx`): Legal disclaimer

### Admin Pages

#### Admin Dashboard (`admin/AdminDashboard.jsx`)
- Dashboard overview with statistics
- Quick links to admin features
- Sales and user metrics

#### Product Management
- **AdminProducts** (`admin/AdminProducts.jsx`): List all products
- **AddProduct** (`admin/AddProduct.jsx`): Form to add new product
- **EditProduct** (`admin/EditProduct.jsx`): Form to edit product

#### Order Management
- **AdminOrders** (`admin/AdminOrders.jsx`): View and manage orders
- Update order status
- Track order details

#### User Management
- **AdminUsers** (`admin/AdminUsers.jsx`): View and manage users
- User statistics and activity

### Reusable Components

#### Navbar (`components/Navbar.jsx`)
- Navigation menu
- Brand logo
- User authentication status
- Cart link
- Admin dashboard access

#### Footer (`components/Footer.jsx`)
- Company information
- Quick links
- Contact information
- Social media links

#### ProductCard (`components/ProductCard.jsx`)
- Product image
- Product name and price
- Rating display
- Add to cart button

---

## Features Implemented

### ✅ Authentication System
- User registration with email verification
- JWT token-based authentication
- Password hashing with bcryptjs
- OTP generation and verification (10-minute expiration)
- Resend OTP functionality
- Professional HTML email templates for OTP

### ✅ Product Management
- 6 seed products (expandable to 30)
- Product CRUD operations (Admin only)
- Cloudinary image storage integration
- Product categorization
- Rating and review count display
- Stock management

### ✅ Shopping Cart
- Redux-based state management
- LocalStorage persistence
- Add/remove/update quantities
- Real-time cart total calculation
- Cart clearing after checkout

### ✅ Payment Processing
- Razorpay integration with test mode
- Student bypass mode for testing
- Payment verification
- Order creation on successful payment
- Transaction ID tracking

### ✅ Order Management
- Order creation with items and address
- Order status tracking (Pending, Shipped, Delivered)
- Order history for users
- Admin order management
- Order confirmation emails

### ✅ User Management
- User profile viewing
- User role management (user/admin)
- Email verification requirement for login
- Admin user listing and management

### ✅ Admin Dashboard
- Sales statistics
- Total revenue calculation
- Product count
- User count
- Order count

### ✅ Email Notifications
- Registration OTP emails
- Order confirmation emails
- Professional HTML email templates
- Nodemailer integration

---

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Gmail account (for email sending)
- Razorpay account (test keys provided)

### Step 1: Clone Repository
```bash
cd "E-commerce full stack website"
```

### Step 2: Install Root Dependencies
```bash
npm run install-all
```

This will install dependencies for:
- Root project
- Frontend
- Backend

### Step 3: Configure Environment Variables

#### Backend Configuration (`.env`)
```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopnest

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Email Service (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password

# Razorpay (Test Keys Provided)
RAZORPAY_KEY_ID=rzp_test_T1VdmxWDRne37c
RAZORPAY_KEY_SECRET=GJu8GLTMyngdHDgnx8nfkYd7

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

#### Frontend Configuration (`.env`)
```bash
REACT_APP_RAZORPAY_KEY_ID=rzp_test_T1VdmxWDRne37c
```

### Step 4: Database Seeding
```bash
npm run seed
```

Output:
```
Seed complete: 2 users, 6 products, and 1 order.
Demo logins: admin@shopnest.com / password123 and demo@shopnest.com / password123
```

### Step 5: Start Development Servers
```bash
npm run dev
```

This starts:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

---

## Environment Configuration

### Backend Environment Variables

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `MONGODB_URI` | String | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | String | Secret key for JWT signing | `your-secret-key` |
| `EMAIL_USER` | String | Sender Gmail address | `your-email@gmail.com` |
| `EMAIL_PASS` | String | Gmail app-specific password | `16-digit-password` |
| `RAZORPAY_KEY_ID` | String | Razorpay public key | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | String | Razorpay secret key | `secret_key_...` |
| `CLOUDINARY_NAME` | String | Cloudinary cloud name | `cloudinary-name` |
| `CLOUDINARY_API_KEY` | String | Cloudinary API key | `api_key` |
| `CLOUDINARY_API_SECRET` | String | Cloudinary API secret | `api_secret` |
| `PORT` | Number | Server port | `5000` |
| `NODE_ENV` | String | Environment | `development` or `production` |

### Frontend Environment Variables

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `REACT_APP_RAZORPAY_KEY_ID` | String | Razorpay public key for frontend | `rzp_test_...` |

---

## Security Implementation

### Password Security
- Passwords hashed with bcryptjs (salt rounds: 10)
- Never stored in plain text
- Comparison using bcryptjs compare method

### JWT Authentication
- Token expiration: 3 days
- Secret key stored in environment variables
- Bearer token authentication header validation
- Decoded token includes user ID

### Admin Authorization
- Role-based access control (RBAC)
- Admin middleware checks user role
- 403 Forbidden response for unauthorized access

### CORS Configuration
```javascript
// Allowed origins
- http://localhost:3000
- http://127.0.0.1:3000
- process.env.FRONTEND_URL (production)

// Credentials enabled
- credentials: true
```

### Email Security
- OTP expires in 10 minutes
- OTP cleared after verification
- Email validation before sending

### Data Validation
- Input validation on all API endpoints
- Required field checking
- Email format validation
- Password length requirements (minimum 6 characters)

---

## Key Features Detail

### Email OTP Verification

**Process:**
1. User registers with email
2. System generates 6-digit OTP
3. OTP sent via Gmail (Nodemailer)
4. User enters OTP to verify email
5. After 10 minutes, OTP expires and must be resent

**Email Template:**
- Professional HTML design
- Gradient header with branding
- Large OTP display
- Security warning
- Timer information

### Payment Flow (Test Mode)

**Razorpay Test Credentials:**
- Success Card: `4111 1111 1111 1111`
- Failure Card: `4222 2222 2222 2226`
- Expiry: `12/25`
- CVV: `123`

**Flow:**
1. User fills checkout form with address
2. Clicks "Pay Now"
3. Razorpay modal opens (test mode)
4. User enters test card details
5. Payment is simulated
6. Order is created in database
7. User redirected to order success page

**Student Bypass Mode:**
- If Razorpay keys unconfigured
- System asks for bypass confirmation
- Order created without payment processing
- Perfect for development/testing

### Redux State Management

**Cart Slice:**
```javascript
State:
- cartItems: [] (array of items)

Actions:
- addToCart(item): Add or update item
- removeFromCart(productId): Remove item
- clearCart(): Empty entire cart

Persistence:
- LocalStorage saves cart items
- Cart restored on page refresh
```

### Admin Dashboard Analytics

**Metrics Calculated:**
- Total Orders Count
- Total Products Count
- Total Verified Users Count
- Total Revenue Sum

**Real-time Updates:**
- Dashboard queries latest data on load
- Updates available on page refresh

---

## Testing Guide

### Demo User Accounts

#### Regular User
- **Email:** demo@shopnest.com
- **Password:** password123

#### Admin User
- **Email:** admin@shopnest.com
- **Password:** password123

### Testing Scenarios

#### 1. User Registration & Email Verification
```
1. Go to /register
2. Fill form and submit
3. Check email for OTP
4. Enter OTP at /verify-email
5. Login with credentials
```

#### 2. Shopping Flow
```
1. Login to account
2. Browse products at /shop
3. Click product to view details
4. Add to cart
5. View cart at /cart
6. Adjust quantities or remove items
```

#### 3. Checkout & Payment
```
1. From cart, click checkout
2. Fill shipping address
3. Click "Pay Now"
4. Use test card: 4111 1111 1111 1111
5. Expiry: 12/25, CVV: 123
6. Confirm payment
7. View order at /ordersuccess
```

#### 4. Student Bypass Mode
```
1. If payment fails, confirm bypass
2. Order saved without actual payment
3. Useful for development testing
```

#### 5. Admin Functions
```
1. Login as admin@shopnest.com
2. Access /admin dashboard
3. View analytics
4. Manage products (/admin/products)
5. View orders (/admin/orders)
6. View users (/admin/users)
```

### Test Data

**Seeded Products (6):**
1. Classic Cotton T-Shirt - ₹799
2. Wireless Headphones - ₹3,499
3. Leather Backpack - ₹2,299
4. Running Shoes - ₹2,999
5. Smart Watch - ₹4,999
6. Ceramic Coffee Mug - ₹449

**Seeded Users (2):**
1. Admin User - admin@shopnest.com
2. Demo Customer - demo@shopnest.com

---

## Deployment Instructions

### Heroku Deployment

#### Step 1: Prepare for Production
```bash
# Build frontend
npm run build

# Verify backend runs in production
NODE_ENV=production npm start
```

#### Step 2: Configure Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new Heroku app
heroku create shopnest-app
```

#### Step 3: Set Environment Variables
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASS=your_email_password
# ... set all other variables
```

#### Step 4: Deploy
```bash
git push heroku main
```

### AWS EC2 Deployment

#### Step 1: Launch EC2 Instance
- Ubuntu 20.04 LTS
- t2.micro or higher

#### Step 2: Install Dependencies
```bash
sudo apt update
sudo apt install nodejs npm mongodb
```

#### Step 3: Clone Repository
```bash
git clone <your-repo>
cd E-commerce\ full\ stack\ website
npm run install-all
```

#### Step 4: Configure .env and Start
```bash
npm run seed
npm run start
```

#### Step 5: Setup Reverse Proxy (Nginx)
```
server {
  listen 80;
  server_name your-domain.com;
  
  location / {
    proxy_pass http://localhost:5000;
  }
}
```

---

## Future Enhancements

### Phase 2 Features
- [ ] Product search with full-text indexing
- [ ] Advanced filtering (price range, ratings)
- [ ] Product recommendations engine
- [ ] Wishlist functionality
- [ ] User reviews and ratings
- [ ] Product reviews moderation

### Phase 3 Features
- [ ] Inventory alerts for low stock
- [ ] Email notifications for order updates
- [ ] SMS notifications (Twilio)
- [ ] Real-time order tracking
- [ ] Refund/return management system

### Phase 4 Features
- [ ] Mobile app (React Native)
- [ ] API documentation (Swagger)
- [ ] Unit testing (Jest)
- [ ] Integration testing
- [ ] E2E testing (Cypress)
- [ ] Performance optimization
- [ ] Redis caching layer

### Phase 5 Features
- [ ] Multi-currency support
- [ ] Subscription products
- [ ] Coupon and discount system
- [ ] Loyalty program
- [ ] Social media integration
- [ ] AI-powered product recommendations

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Razorpay keys unconfigured"
**Solution:**
1. Ensure `.env` has Razorpay keys
2. Restart backend server
3. Keys provided: `rzp_test_T1VdmxWDRne37c` (ID)
4. Use Student Bypass Mode for testing

#### Issue: "MongoDB connection failed"
**Solution:**
1. Check MongoDB URI in `.env`
2. Verify network access (MongoDB Atlas)
3. Ensure IP address is whitelisted
4. Test connection string locally

#### Issue: "Email not sending"
**Solution:**
1. Enable 2-FA on Gmail account
2. Generate 16-digit app password
3. Use app password in `.env` (EMAIL_PASS)
4. Allow less secure apps (if not using 2-FA)

#### Issue: "JWT token expired"
**Solution:**
1. User needs to login again
2. New token issued on login
3. Token valid for 3 days
4. No refresh token implemented (future enhancement)

#### Issue: "Admin features not accessible"
**Solution:**
1. Ensure logged in as admin user
2. Check user role in database
3. Admin role must be 'admin'
4. Use admin@shopnest.com for testing

#### Issue: "Images not uploading"
**Solution:**
1. Verify Cloudinary credentials
2. Check file size limits
3. Ensure correct file format (jpg, png, etc.)
4. Test Cloudinary API directly

#### Issue: "CORS errors in browser"
**Solution:**
1. Frontend and backend on correct ports
2. CORS origins include frontend URL
3. Credentials: true if needed
4. Check browser console for exact error

#### Issue: "Cart not persisting"
**Solution:**
1. Check browser localStorage
2. Ensure cartSlice saving to localStorage
3. Clear browser cache and retry
4. Check browser storage quota

#### Issue: "Products not loading"
**Solution:**
1. Run `npm run seed` to populate database
2. Check MongoDB connection
3. Verify product collection exists
4. Check for API errors in browser console

---

## Support & Maintenance

### Getting Help
- Check browser console for errors (F12)
- Check backend terminal for server logs
- Verify all environment variables set
- Review API responses in Network tab (F12)

### Maintenance Tasks
- **Weekly:** Check error logs, monitor database usage
- **Monthly:** Update dependencies, review analytics
- **Quarterly:** Backup database, security audit
- **Yearly:** Full system review, performance optimization

### Database Backup
```bash
# Using MongoDB Compass or Atlas dashboard
# Export collections as JSON
# Store backups securely
```

### Performance Monitoring
- Monitor API response times
- Track database query performance
- Check server resource usage
- Monitor Cloudinary image delivery

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-17 | Raj Malviya | Initial documentation |

---

## Appendix

### A. Useful Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:client      # Start only frontend
npm run dev:server      # Start only backend
npm run seed            # Seed database

# Production
npm run build           # Build frontend for production
npm run start           # Start backend in production

# Installation
npm run install-all     # Install all dependencies

# Backend only
cd backend && npm run dev
cd backend && npm run seed

# Frontend only
cd frontend && npm start
```

### B. File Structure Quick Reference

```
Key Files:
├── backend/server.js         # Main server entry
├── backend/controllers/       # Business logic
├── backend/routes/          # API endpoints
├── frontend/src/App.jsx      # Main React app
├── frontend/src/redux/       # State management
└── frontend/src/pages/       # Page components
```

### C. API Base Endpoints Summary

```
Auth:     POST   /api/auth/register
          POST   /api/auth/login
          POST   /api/auth/verify-email

Products: GET    /api/products
          GET    /api/products/:id
          POST   /api/products          (Admin)
          PUT    /api/products/:id      (Admin)

Orders:   POST   /api/orders
          GET    /api/orders/myorders
          GET    /api/orders            (Admin)
          PUT    /api/orders/:id/status (Admin)

Payment:  POST   /api/payment/order
          POST   /api/payment/verify

Analytics: GET   /api/analytics/dashboard (Admin)
```

---

**End of Documentation**

*For more information or updates, please contact the development team.*

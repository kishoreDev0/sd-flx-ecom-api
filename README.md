<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# E-commerce API with Security, Order Tracking, and Notifications

A comprehensive NestJS-based e-commerce API with advanced security features, order tracking, and notification systems.

## 🚀 Features

### Core E-commerce Features
- **User Management**: Registration, authentication, role-based access control
- **Product Management**: CRUD operations, categories, brands, vendors
- **Shopping Cart**: Add/remove items, quantity management
- **Wishlist**: Save favorite products
- **Order Management**: Create, track, and manage orders
- **Vendor System**: Multi-vendor marketplace support
- **Product Ratings & Reviews**: Customer feedback system

### Security Features
- **Helmet**: Security headers protection
- **Rate Limiting**: API rate limiting with different rules for different endpoints
- **CORS**: Configurable cross-origin resource sharing
- **Request Validation**: Input sanitization and validation
- **Security Logging**: Comprehensive security event logging
- **Authentication**: JWT-based authentication with role-based access

### Order Tracking System
- **Real-time Tracking**: Track order status changes
- **Multiple Status Types**: Pending, confirmed, processing, shipped, delivered, cancelled, returned, refunded
- **Tracking Numbers**: Support for shipping carrier tracking
- **Location Updates**: Track order location during transit
- **Estimated Delivery**: Delivery date estimation
- **Tracking History**: Complete order tracking timeline

### Notification System
- **Multiple Channels**: In-app notifications and email notifications
- **Notification Types**: Order status, payment, security alerts, promotional
- **Priority Levels**: Low, medium, high, urgent
- **Read/Unread Status**: Track notification read status
- **Expiration**: Configurable notification expiration
- **Bulk Operations**: Mark all as read, bulk creation

### Advanced Features
- **Multi-role System**: Admin, Vendor, User roles
- **Brand-Category Mapping**: Many-to-many relationships with additional attributes
- **Product Filtering**: Advanced filtering by brand, category, price, stock
- **Pagination**: Efficient data pagination
- **File Upload**: Image and document upload support
- **Email Integration**: Transactional email support
- **Google OAuth**: Social login integration

## 🛠️ Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: MySQL with TypeORM
- **Authentication**: JWT, Passport.js
- **Security**: Helmet, Rate Limiting, CORS
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Email**: Nodemailer
- **Validation**: Class-validator, class-transformer

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sd-flx-ecom-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=ecommerce_db

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h

   # Email Configuration
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_email_password

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Security Configuration
   ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

   # Application Configuration
   PORT=3008
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create database
   CREATE DATABASE ecommerce_db;
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3008/api
```

## 🔐 Security Features

### Rate Limiting
- **Authentication endpoints**: 5 requests per 15 minutes
- **General API**: 100 requests per 15 minutes
- **File uploads**: 10 requests per hour

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security
- Referrer-Policy
- Permissions-Policy

### Input Validation
- Request size limits (10MB)
- Content-type validation
- Input sanitization
- SQL injection prevention

## 📦 Order Tracking System

### Order Status Flow
1. **Pending** → Order created, awaiting confirmation
2. **Confirmed** → Order confirmed, payment received
3. **Processing** → Order being prepared for shipment
4. **Shipped** → Order shipped with tracking number
5. **Out for Delivery** → Order in final delivery phase
6. **Delivered** → Order successfully delivered
7. **Cancelled** → Order cancelled (if applicable)
8. **Returned** → Order returned by customer
9. **Refunded** → Order refunded

### Tracking Features
- Real-time status updates
- Shipping carrier integration
- Location tracking
- Estimated delivery dates
- Complete tracking history
- Automatic notifications

## 🔔 Notification System

### Notification Types
- **Order Status**: Status change notifications
- **Order Confirmation**: Order confirmation emails
- **Order Shipped**: Shipping notifications with tracking
- **Order Delivered**: Delivery confirmation
- **Payment Success/Failed**: Payment status notifications
- **Security Alerts**: Security-related notifications
- **Promotional**: Marketing notifications
- **System Maintenance**: System update notifications

### Features
- Priority-based notifications
- Read/unread status tracking
- Notification expiration
- Bulk operations
- Email integration
- In-app notifications

## 👥 User Roles

### Admin
- Full system access
- User management
- Order management
- Vendor approval
- System configuration

### Vendor
- Product management
- Order fulfillment
- Sales analytics
- Brand management
- Commission tracking

### User
- Product browsing
- Shopping cart
- Order placement
- Reviews and ratings
- Profile management

## 🏗️ Project Structure

```
src/
├── main/
│   ├── commons/
│   │   ├── constants/          # Response constants
│   │   ├── decorators/         # Custom decorators
│   │   ├── enumerations/       # Enums
│   │   ├── exceptions/         # Exception filters
│   │   ├── guards/             # Authentication guards
│   │   └── seeds/              # Database seeds
│   ├── config/                 # Configuration files
│   ├── controller/             # API controllers
│   ├── database/               # Database configuration
│   ├── dto/                    # Data transfer objects
│   ├── entities/               # Database entities
│   ├── middleware/             # Security middleware
│   ├── modules/                # Feature modules
│   ├── repository/             # Data access layer
│   ├── service/                # Business logic
│   └── utils/                  # Utility functions
├── swagger/                    # API documentation
└── main.ts                     # Application entry point
```

## 🔧 Configuration

### Environment Variables
- Database connection settings
- JWT configuration
- Email settings
- Google OAuth credentials
- Security settings
- Application settings

### Security Configuration
- CORS origins
- Rate limiting rules
- Security headers
- File upload limits
- Session management

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Monitoring & Logging

- **Security Logging**: Suspicious activity detection
- **Request Logging**: HTTP request/response logging
- **Error Logging**: Comprehensive error tracking
- **Performance Monitoring**: Request duration tracking
- **Audit Trail**: User action logging

## 🚀 Deployment

### Production Deployment
1. Set environment variables for production
2. Build the application: `npm run build`
3. Start the application: `npm run start:prod`
4. Configure reverse proxy (nginx)
5. Set up SSL certificates
6. Configure database backups

### Docker Deployment
```bash
# Build Docker image
docker build -t ecommerce-api .

# Run container
docker run -p 3008:3008 ecommerce-api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔄 Changelog

### v1.0.0
- Initial release with core e-commerce features
- Security middleware implementation
- Order tracking system
- Notification system
- Multi-role user management
- Product rating and review system

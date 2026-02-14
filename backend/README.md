# 🛠️ Handyman.za Backend API

A professional, production-ready backend for the Handyman.za platform 
- connecting customers with skilled handymen in South Africa.

## 📦 Tech Stack
- **Runtime:**          Node.js
- **Framework:**        Express.js
- **Database:**         MongoDB with Mongoose ODM
- **Authentication:**   JWT (Access + Refresh Token)
- **Validation:**       Joi
- **Security:**         bcrypt, helmet, CORS
- **Logging:**          Morgan
- **Architecture:**     Modular MVC pattern

## 🚀 Features Implemented (Stage 1)

### ✅ Core Infrastructure
- [x] Environment configuration with dotenv
- [x] MongoDB database connection
- [x] Express server setup with middleware
- [x] Global error handling middleware
- [x] Custom ApiError class for consistent errors
- [x] Health check endpoint

### ✅ Authentication Module
- [x] User model with role-based design (CUSTOMER, HANDYMAN, ADMIN)
- [x] Password hashing with bcrypt (pre-save middleware)
- [x] JWT token generation (access + refresh token)
- [x] Token refresh mechanism
- [x] Email verification flow (structure ready)
- [x] Password reset flow (structure ready)
- [x] Profile management (get/update)

### ✅ Validation Layer
- [x] Generic validation middleware
- [x] Joi schemas for all auth endpoints
- [x] Conditional validation for handyman-specific fields
- [x] Consistent error formatting

### ✅ Database Schema
- [x] User model with:
    - Base identity fields
    - Role-based access control
    - Nested handyman profile
    - Geo-spatial indexing
    - Refresh token storage
    - Automatic timestamps

## 📁 Project Structure

```
handyman_za-backend/
|-- src/
| |-- app.js                    # Express app configuration
| |-- config/                   
| | |-- env.js                  # Environment configuration
| | |-- db.js                   # Database connection
| |-- middlewares/              # Custom middleware (auth, error, etc.)
| |-- modules/                  
| | |-- auth/                   # Authentication modules
| | |-- users/                  # User schema module
| | |-- jobs/                   # To be implemented later
| | |-- reviews/                # To be implemented later
| | |-- service/                # To be implemented later
| |-- utils/                    
| | |-- ApiError.js             # Custom error class
|-- server.js                   # Application entry point
|-- package.json
|-- README.md
```

## 🔌 API Endpoints

### Base URL: `/api/v1`

### Core
-   GET /api/v1/health - Health check
-   GET /api/v1 - API documentation

### Authentication
```
| Method |        Endpoint         |          Description            | Auth Required |
|--------|-------------------------|---------------------------------|---------------|
|  POST  |    `/auth/register`     | Register user (client/handyman) | No  |
|  POST  |      `/auth/login`      |    Login with email/password    | No  |
|  POST  |  `/auth/refresh-token`  |       Refresh access token      | No  |
|  POST  |     `/auth/logout/`     |          Logout user            | Yes |
|  POST  |  `/auth/verify-email`   |       Verify email address      | No  |
|  POST  | `/auth/forgot-password` |      Request password reset     | No  |
|  POST  | `/auth/reset-password`  |    Reset password with token    | No  |
|  GET   |        `/auth/me`       |     Get current user profile    | Yes |
|  GET   |        `/auth/me`       |       Update user profile       | Yes |
```

## Example Requests

### Register Client
```json
POST /api/v1/auth/register
{
    "firstname": "John",
    "lastName" : "Doe",
    "email": "john@example.com",
    "password": "Password123",
    "phoneNumber": "0721234567",
    "role": "client"
}
```
### Register Handyman
```json
POST /api/v1/auth/register
{
    "firstname": "Mike",
    "lastName" : "Handyman",
    "email": "mike@example.com",
    "password": "Password123",
    "phoneNumber": "0727654321",
    "role": "handyman",
    "skills": ["Plumbing", "Electrical"],
    "bio": "Experienced handyman with 10 years in the industry",
    "yearsOfExperience": 10,
    "availability": {
        "days": ["MON", "TUE", "WED", "THUR", "FRI"],
        "timeslots": ["08:00-12:00", "13:00-17:00"]
    }
}
```
### Login
```json
POST /api/v1/auth/login
{
    "email": "john@example.com",
    "password": "Password123",
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/P-Mnguni/handyman_za-backend
    cd handyman_za-backend

2. **Install dependencies:**
    npm install

3. **Set up environment variables:**
    cp .env
    
4. **Start the development server:**
    npm run dev

## 🚦 Available Scripts

-   npm start - Start production server
-   npm run dev - Start development server with nodemon
-   npm test - Run tests (coming soon)

## 🛡️ Security Features

-   Headers - Helmet.js for security headers
-   CORS - Configured for frontend access
-   Rate limiting - Abuse prevention
-   JWT tokens - Short-lived access tokens + refresh tokens
-   Token Rotation - Refresh tokens rotated on use
-   Password hashing - bcrypt with salt rounds
-   Input validation - Joi schemas for all endpoints
-   Error handling - No stack traces in production
-   Error sanitization - Hide stack traces in production

## 📊 Database Schema

-   Users - Base identity (customers, handymen, admins)
-   Handyman Profiles - Service provider details
-   Jobs - Core business object
-   Services - Service catalog
-   Payments - Transaction records
-   Reviews - Ratings & feedback
-   Notifications - User notifications
-   Audit Logs - Security & compliance

## 🎯 Next Steps (Stage 2)

- Handyman profile management
- Job creation and broadcasting
- Payment integration (PayFast/Stripe)
- Real-time notifications with Socket.io
- Admin dashboard endpoints
- Review and rating system
- File uploads for documents
- API documentation with Swagger

## 🤝 Contributing

1.  Fork the repository
2.  Create a feature branch (
        git checkout -b feature/amazing-feature
    )
3.  Commit your changes (
        git commit -m 'Add amazing feature'
    )
4.  Push to the branch (
        git push origin feature/amazing-feature
    )
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Phakamani Bayanda Mnguni
-   Github: @P-Mnguni
-   LinkedIn: Phakamani Mnguni

## 🙏 Acknowledgements

- Inspired by real-world service platforms
- Built with scalability and security in mind
- Designed for the South African market
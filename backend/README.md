# 🛠️ Handyman.za BAckend API

A production-ready backend for the Handyman.za platform 
- connecting customers with skilled handymen in South Africa.

## 🚀 Features

- **RESTful API** with versioning ('/api/v1')
- **JWT Authentication** with refresh tokens
- **Role-Based Access Control** (Customer, Handyman, Admin)
- **MongoDB** with Mongoose ODM
- **Express.js** with modular architecture
- **Error Handling** middleware with custom error classes
- **Rate Limiting** and security headers
- **API Documentation** built-in
- **Route Aggregator** for scalable module management

## 📁 Project Structure

handyman_za-backend/
|-- src/
| |-- app.js                    # Express app configuration
| |-- config/                   # Environment & database config
| |-- middlewares/              # Custom middleware (auth, error, etc.)
| |-- modules/                  # Feature modules (auth, users, jobs, etc.)
| |-- utils/                    # Utility functions & classes
|-- server.js                   # Application entry point
|-- package.json
|-- .env.example                # Environment template
|-- README.md

## 🛠️ Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/P-Mnguni/handyman_za-backend
    cd handyman_za-backend

2. **Install dependencies:**
    npm install

3. **Set up environment variables:**
    cp .env.example .env
    
4. **Start the development server:**
    npm run dev

## 🚦 Available Scripts

-   npm start - Start production server
-   npm run dev - Start development server with nodemon
-   npm test - Run tests (coming soon)

## 🔌 API Endpoints

**CORE**
-   GET /api/v1/health - Health check
-   GET /api/v1 - API documentation

**Modules (Placeholder routes)**
-   GET /api/v1/auth - Authentication
-   GET /api/v1/users - User management
-   GET /api/v1/handymen - Handyman profiles
-   GET /api/v1/jobs - Job management
-   GET /api/v1/services - Service catalog
-   GET /api/v1/payments - Payment processing
-   GET /api/v1/reviews - Reviews & ratings
-   GET /api/v1/notifications - Notifications
-   GET /api/v1/admin - Admin endpoints

## 🛡️ Security Features

-   Helmet.js - Security headers
-   CORS - Configurable origins
-   Rate limiting - Abuse prevention
-   JWT tokens - Stateless authentication
-   Password hashing - bcrypt
-   Input validation - Zod schemas
-   Error sanitization - Hide stack traces in production

## 🧪 Testing

    npm test                            # Run all tests
    npm test -- --testPathPattern=auth  # Run specific tests

## 📊 Database Schema

-   Users - Base identity (customers, handymen, admins)
-   Handyman Profiles - Service provider details
-   Jobs - Core business object
-   Services - Service catalog
-   Payments - Transaction records
-   Reviews - Ratings & feedback
-   Notifications - User notifications
-   Audit Logs - Security & compliance

## 🔧 Tech Stack

-   Runtime: Node.js
-   Framework: Express.js
-   Database: MongoDB with Mongoose
-   Authentication: JWT + bcrypt
-   Validation: Zod
-   Security: Helmet, express-rate-limit
-   Logging: Morgan, Winston (to be added)
-   Testing: Jest, Supertest (to be added)

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
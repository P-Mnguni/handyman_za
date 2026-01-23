
# Auth Module

Authentication and authorization module for Handyman.za platform.

## Structure
- `auth.routes.js`      - Route definitions and API documentation
- `auth.controller.js`  - Request/response handling
- `auth.service.js`     - Business logic and data operations
- `auth.validation`     - Input validation schemas
- `auth.middleware.js`  - Authentication guards and utilities

## Endpoints

### Public Endpoints
- `POST /auth/register`         - Register new user (customer/handyman)
- `POST /auth/login`            - User login
- `POST /auth/verify-email`     - Verify email address
- `POST /auth/forgot-password`  - Request password reset
- `POST /auth/reset-password`   - Reset password with token
- `POST /auth/refresh-token`    - Refresh access token

### Protected Endpoints (require authentication)
- `POST /auth/logout`           - User logout
- `POST /auth/me`               - Get current user profile

## Flow

1. **Registration**: User provides email, password, role → Create user 
→ Send verification email
2. **Login**: Email + password → Validate → Generate tokens
3. **Token Refresh**: Refresh token → Validate → New access token
4. **Password Reset**: Request → Email with token → Reset with token

## Security Features
- Password hashing with bcrypt
- JWT tokens with short expiration (access) and log expiration (refresh)
- Refresh token rotation
- Email verification required for full access
- Rate limiting on auth endpoints
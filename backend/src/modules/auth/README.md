
# Auth Module

Handles user registration, login, token management, and profile 
operations for the Handyman.za platform

## Structure
- `auth.routes.js`      - Route definitions and API documentation
- `auth.controller.js`  - Request/response handling
- `auth.service.js`     - Business logic and data operations
- `auth.validation`     - Input validation schemas
- `auth.middleware.js`  - Authentication guards and utilities

## Flow

1. Register → 2. Login → 3. Receive JWT → 4. Authentication Requests
                                                        ↓
                                                    Refresh Token
                                                        ↓
                                                  New Access Token

## 📡 API Endpoints

### Base URL: `/api/v1/auth`

```
| Method |      Endpoint      |             Description             | Auth |    Request Body    |
|--------|--------------------|-------------------------------------|------|--------------------|
|  POST  | `/register`        | Register new user (client/handyman) |  No  |     User Data      |
|  POST  | `/login`           |      Login with email/password      |  No  |  email, password   |
|  POST  | `/refresh-token`   |         Get new access token        |  No  |    refreshToken    |
|  POST  | `/logout`          |       Invalidate refresh token      |  Yes |         -          |
|  POST  | `/verify-email`    |         Verify email address        |  No  |       token        |
|  POST  | `/forgot-password` |        Request password reset       |  No  |       email        |
|  POST  | `/reset-password`  |           Reset with token          |  No  | token. newPassword |
|  GET   | `/me`              |       Get current user profile      |  Yes |         -          |
|  PUT   | `/me`              |          Update user profile        |  Yes |  fields to update  |
```

## Request/Response Example

### 1. Request Client
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
### 2. Register Handyman
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
### 3. Login
```json
POST /api/v1/auth/login
{
    "email": "john@example.com",
    "password": "Password123",
}
```
### 4. Get Current User (Protected)
```json
GET /api/v1/auth/me
Authorization: Bearer 'eyJhGci01JIUzI1NiIsInR5cCI6IkpXCJ9...'
```
### 5. Update Profile (Protected)
```
PUT /api/v1/auth/me
Authorization: Bearer 'eyJhGci01JIUzI1NiIsInR5cCI6IkpXCJ9...'
{
    "firstName": "Jonathan",
    "phoneNumber": "0729999999"
}
```

## Security Features
1. **Password Hashing**: bcrypt with salt rounds (pre-save middleware)
2. **JWT Tokens**:
    - Access token: 15-minute expiry
    - Refresh token: 7-day expiry
3. **Token Rotation**: Refresh tokens invalidated after use
4. **Email Verification**: Tokens with 24-hour expiry
5. **Password Reset**: One-time tokens with 1-hour expiry
6. **Input Validation**: All requests validated before processing

## 🚀 Next Features

- OAuth2 integration (Google, Facebook)
- Two-factor authentication (2FA)
- Session management dashboard
- Login attempt limiting
- Device fingerprinting
import express from 'express';
import { asyncHandler } from '../../middlewares/error.middleware.js';
import * as authController from './auth.controller.js';
import { success } from 'zod';

// Controller imports (will be created later)
// import * as authController from './auth.controller.js
const router = express.Router();

/**
 * @api {post} /auth/register                   - Register User
 * @apiName RegisterUser
 * @apiGroup Auth
 * @apiDescription Register a new user (customer or handyman)
 * 
 * @apiBody {String} fullName                   - User's full name
 * @apiBody {String} email                      - User's email address
 * @apiBody {String} password                   - User's password (min 6 chars)
 * @apiBody {String} phone                      - User's phone number
 * @apiBody {String="CUSTOMER","HANDYMAN"} role - User role
 * 
 * @apiSuccess {Boolean} success                - Request status
 * @apiSuccess {String} message                 - Success message
 * @apiSuccess {Object} data                    - User data (without password)
 * @apiSuccess {String} data.id                 - User ID
 * @apiSuccess {String} data.email              - User email
 * @apiSuccess {String} data.role               - User role
 * @apiSuccess {String} data.accessToken        - JWT access Token
 * @apiSuccess {String} data.refreshToken       - JWT refresh Token
 */
router.post('/register', asyncHandler(authController.register));

/**
 * @api {post} /auth/login                      - User Login
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiDescription Authenticate user and return tokens
 * 
 * @apiBody {String} email                      - User email
 * @apiBody {String} password                   - User password
 * 
 * @apiSuccess {Boolean} success                - Request status
 * @apiSuccess {String} message                 - Success message
 * @apiSuccess {String} data                    - Authentication data
 * @apiSuccess {String} data.id                 - User ID
 * @apiSuccess {String} data.email              - User email
 * @apiSuccess {String} data.accessToken        - JWT access token
 * @apiSuccess {String} data.refreshToken       - JWT refresh token
 */
router.post('/login', asyncHandler(authController.login));

/**
 * @api {post} /auth/logout                     - User Logout
 * @apiName LogoutUser
 * @apiGroup Auth
 * @apiDescription Logout user and invalidate token
 * 
 * @apiHeader {String} Authorization            - Bearer token
 * 
 * @apiSuccess {Boolean} success                - Request status
 * @apiSuccess {String} message                 - Success message
 */
router.post('/logout', asyncHandler(authController.logout));

/**
 * @api {post} /auth/refresh-token              - Refresh Access Token
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiDescription Get new access token using refresh token
 * 
 * @apiBody {String} refreshToken               - Valid refresh token
 * 
 * @apiSuccess {Boolean} success                - Request status
 * @apiSuccess {String} message                 - Success message
 * @apiSuccess {Object} data                    - New tokens
 * @apiSuccess {String} data.accessToken        - New JWT access token
 * @apiSuccess {String} data.refreshToken       - New JWT refresh token
 */
router.post('/refresh-token', asyncHandler(authController.refreshToken));

/**
 * @api {post} /auth/verify-email               - Verify Email Address
 * @apiName VerifyEmail
 * @apiGroup Auth
 * @apiDescription Verify user's email address with token
 * 
 * @apiBody {String}                            - Email verification token
 * 
 * @apiSuccess {Boolean} success                - Request status
 * @apiSuccess {String} message                 - Success message
 */
router.post('/verify-email', asyncHandler(authController.verifyEmail));

/**
 * @api {post} /auth/forgot-password            - Forgot Password
 * @apiName ForgotPassword
 * @apiGroup Auth
 * @apiDescription Request password reset email
 * 
 * @apiBody {String} email                      - User's email address
 * 
 * @apiSuccess {Boolean} success                - Request status
 * @apiSuccess {String} message                 - Success message
 */
router.post('/forgot-password', asyncHandler(authController.forgotPassword));

/**
 * @api {post} /auth/reset-password             - Reset Password
 * @apiName ResetPassword
 * @apiGroup Auth
 * @apiDescription Reset password with token
 * 
 * @apiBody {String} token                      - Password reset token
 * @apiBody {String} newPassword                - New password
 * 
 * @apiSuccess {Boolean} success                - Request status
 * @apiSuccess {String} message                 - Success message
 */
router.post('/reset-password', asyncHandler(authController.resetPassword));

/**
 * @api {get} /auth/me                          - Get Current User
 * @apiName GetCurrentUser
 * @apiGroup Auth
 * @apiDescription Get authenticated user's profile
 * 
 * @apiHeader {String} Authorization            - Bearer token
 * 
 * @apiSuccess {Boolean} success                - Request status
 * @apiSuccess {String} message                 - Success message
 * @apiSuccess {Object} data                    - User profile
 */
router.get('/me', asyncHandler(authController.getCurrentUser));

/**
 * @api {put} /auth/me                          - Update Profile
 * @apiName UpdateProfile
 * @apiGroup Auth
 */
router.put('/me', asyncHandler(authController.updateProfile));

// Export the router
export default router;
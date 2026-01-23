import express from 'express';
import { asyncHandler } from '../../middlewares/error.middleware.js';
import { success } from 'zod';

// Controller imports (will be created later)
// import * as authController from './auth.controller.js
const router = express.Router();

/**
 * @api {post} /auth/register - Register User
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
router.post(
    '/register',
    asyncHandler(async (req, res) => {
        // Placeholder - will be implemented in controller
        res.status(201).json({
            success: true,
            message: 'User registration endpoint',
            implemented: false,
            endpoint: '/auth/register',
            method: 'POST',
        });
    })
);
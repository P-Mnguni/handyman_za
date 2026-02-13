import express from 'express';
import { asyncHandler } from '../../middlewares/error.middleware.js';
import * as authController from './auth.controller.js';
import { success } from 'zod';
import { authMiddleware } from './auth.middleware.js';
import { validateBody, validateQuery, validateParams } from '../../middlewares/validate.middleware.js';
import {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshTokenSchema,
    updateProfileSchema,
    idParamSchema,
    paginationQuerySchema,
    nearbyHandymanQuerySchema
} from './auth.validation.js';

const router = express.Router();

// Public routes

router.post(
    '/register', 
    validateBody(registerSchema),
    authController.register
);

router.post(
    '/login', 
    validateBody(loginSchema),
    authController.login
);

router.post(
    '/refresh-token', 
    validateBody(refreshTokenSchema),
    authController.refreshToken
);

router.post(
    '/verify-email', 
    validateBody(verifyEmailSchema),
    authController.verifyEmail
);

router.post(
    '/forgot-password', 
    validateBody(forgotPasswordSchema),
    authController.forgotPassword
);

router.post(
    '/reset-password', 
    validateBody(resetPasswordSchema),
    authController.resetPassword
);

// Protected routes (require authentication)

router.post(
    '/logout', 
    authMiddleware, 
    authController.logout
);

router.get(
    '/me', 
    authMiddleware, 
    authController.getCurrentUser
);

router.put(
    '/me', 
    authMiddleware, 
    validateBody(updateProfileSchema),
    authController.updateProfile
);

// Query validation (for future use)
router.get(
    '/nearby',
    validateQuery(nearbyHandymanQuerySchema),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Nearby handyman endpoint - to be implemented',
            query: req.query
        });
    }
);

// Param validation (for future use)
router.get(
    '/user/:id',
    validateParams(idParamSchema),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Get user by ID - to be implemented',
            userId: req.params.id
        });
    }
);

// Export the router
export default router;
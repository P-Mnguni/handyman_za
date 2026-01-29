import express from 'express';
import { asyncHandler } from '../../middlewares/error.middleware.js';
import * as authController from './auth.controller.js';
import { success } from 'zod';
import { authMiddleware } from './auth.middleware.js';

const router = express.Router();

// Public routes

router.post('/register/client', authController.registerClient);

router.post('/register/handyman', authController.registerHandyman);

router.post('/login', authController.login);

router.post('/refresh-token', authController.refreshToken);

router.post('/verify-email', authController.verifyEmail);

router.post('/forgot-password', authController.forgotPassword);

router.post('/reset-password', authController.resetPassword);

// Protected routes (require authentication)

router.post('/logout', authMiddleware, authController.logout);

router.get('/me', authMiddleware, authController.getCurrentUser);

router.put('/me', authMiddleware, authController.updateProfile);

// Export the router
export default router;
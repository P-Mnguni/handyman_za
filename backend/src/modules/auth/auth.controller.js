//import { use } from 'react';
import { success } from 'zod';
import { ApiError } from '../../utils/ApiError.js';
import authService from './auth.service.js';
import { da } from 'zod/v4/locales';
import { token } from 'morgan';

/**
 * @desc    Register a new user (customer or handyman)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const deviceInfo = req.headers["user-agent"] || "unknown";

        // Combine firstName and lastName for storage in User model
        const fullName = `${req.body?.firstName} ${req.body?.lastName}`.trim();

        // Prepare data for service
        const registrationData = {
            ...req.body,
            deviceInfo,
            fullName
        };

        const result = await authService.register(registrationData);

        res.status(201).json({
            success: true,
            message: result.message || 'Customer registered successfully. Please verify email.',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Authenticate user and get tokens
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw ApiError.badRequest('Please provide email and password');
        }

        const deviceInfo = req.headers["user-agent"] || "unknown";

        const result = await authService.login({ email, password, deviceInfo });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout user / invalidate token
 * @route   POST /api/v1/auth/logout
 * @access  Private (requires authentication)
 */
export const logout = async (req, res, next) => {
    try {
        // Get token from request (will be in middleware)
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw ApiError.badRequest('No token provided');
        }

        await authService.logout(token);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout from all devices
 * @route   POST /api/v1/auth/logout
 * @access  Private (requires authentication)
 */
export const logoutAll = async (req, res, next) => {
    try {
        // Get userId from authenticated user
        const { userId } = req.user;

        await authService.logoutAllDevices(userId);

        res.status(200).json({
            success: true,
            message: 'Logged out from all devices successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public (but requires valid refresh token)
 */
export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw ApiError.badRequest('Refresh token is required');
        }

        const deviceInfo = req.headers["user-agent"] || "unknown";
        const result = await authService.refreshToken(refreshToken, deviceInfo);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Verify user's email address
 * @route   POST /api/v1/auth/verify-email
 * @access  Public
 */
export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            throw ApiError.badRequest('Verification token is required');
        }

        const result = await authService.verifyEmail(token);

        res.status(200).json({
            success: true,
            message: result.message,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Request password reset email
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            throw ApiError.badRequest('Email is required');
        }

        const result =  await authService.forgotPassword(email);

        // Security: Always return some message regardless of email existence
        res.status(200).json({
            success: true,
            message: result.message,
            ...ApiError(env.nodeEnv === 'development' && {
                data: { resetToken: result.resetToken }
            })
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            throw ApiError.badRequest('Token and new password are required');
        }

        const result = await authService.resetPassword(token, newPassword);
        
        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current authenticated user's profile
 * @route   GET /api/v1/auth/me
 * @access  Private (requires authentication)
 */
export const getCurrentUser = async (req, res, next) => {
    try {
        // User will be attached to request by auth middleware (later)
        const userId = req.user?._id || req.user?.userId;

        if (!userId) {
            throw ApiError.unauthorized('Not authenticated');
        }

        const user = await authService.getCurrentUser(userId);

        res.status(200).json({
            success: true,
            message: 'User profile retrieved successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update current user's profile
 * @route   PUT /api/v1/auth/me
 * @access  Private (requires authentication)
 */
export const updateProfile = async (req, res, next) => {
    try {
        // User will be attached to request by auth middleware (later)
        const userId = req.user?.id || req.user?.userId;

        if (!userId) {
            throw ApiError.unauthorized('Not authenticated');
        }

        const updateData = req.body;

        // Validate that there's data to update
        if (updateData.firstName || updateData.lastName) {
            const user = await authService.getCurrentUser(userId);
            updateData.fullName = `${updateData.firstName || user.firstName} 
                                    ${updateData.lastName || user.lastName}`.trim();
        }

        const result = await authService.updateProfile(userId, updateData);

        res.status(200).json({
            success: true,
            message: result.message,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// Export all controllers
export default {
    register,
    login,
    logout,
    refreshToken,
    verifyEmail,
    forgotPassword,
    resetPassword,
    getCurrentUser,
    updateProfile,
};
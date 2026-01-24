import { ApiError } from '../../utils/ApiError.js';

// Service import (will be implemented later)
// import * as authService from './auth.service.js';

/**
 * @desc    Register a new user (customer or handyman)
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { fullName, email, password, phone, role } = req.body;

        // Input validation (basic - detailed validation will be implemented)
        if (!fullName || !email || !password || !role) {
            throw ApiError.badRequest('Missing required fields: fullName, email, password, role');
        }

        // Validate role
        const validRoles = ['CUSTOMER', 'HANDYMAN'];
        if (!validRoles.includes(role.toUpperCase())) {
            throw ApiError.badRequest(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
        }

        // Call service (placeholder for now)
        // const user = await authService.registerUser({ fullName, email, password, phone, role });

        // Placeholder response until service is implemented
        const user = {
            id: 'placeholder-id',
            fullName,
            email,
            phone: phone || null,
            role: role.toUpperCase(),
            isEmailVerified: false,
            createdAt: new Date().toISOString(),
        };

        // Generate tokens (placeholder)
        const tokens = {
            accessToken: 'placeholder-jwt-token',
            refreshToken: 'placeholder-refresh-token',
        };

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.',
            data: {
                user,
                tokens,
            },
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

        // Call service (placeholder for now)
        // const user = await authService.loginUser({ email, password });

        // Placeholder response
        const user = {
            id: 'placeholder-id',
            fullName: 'John Doe',
            email,
            role: 'CUSTOMER',
            isEmailVerified: true,
        };

        const tokens = {
            accessToken: 'placeholder-jwt-token',
            refreshToken: 'placeholder-refresh-token',
        };

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                tokens,
            },
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

        // Call service to invalidate token (placeholder)
        // await authService.logoutUser(token);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
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

        // Call service (placeholder)
        // const tokens = await authService.refreshAccessToken(refreshToken);

        const tokens = {
            accessToken: 'new-placeholder-jwt-token',
            refreshToken: 'new-placeholder-refresh-token',      // Optional: rotate refresh token
        };

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: { 
                tokens, 
            },
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

        // Call service (placeholder)
        // await authService.verifyEmail(token);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully. You can now log in',
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
        const { email } = res.body;

        if (!email) {
            throw ApiError.badRequest('Email is required');
        }

        // Call service (placeholder)
        // await authService.sendPasswordResetEmail(email);

        // Security: Always return some message regardless of email existence
        res.status(200).json({
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.',
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

        if (newPassword.length < 6) {
            throw ApiError.badRequest('Password must be at least 6 characters long');
        }

        // Call service (placeholder)
        // await authService.resetPassword(token, newPassword);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now log in with your new password.',
        });
    } catch (error) {
        next(error);
    }
};
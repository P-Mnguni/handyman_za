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
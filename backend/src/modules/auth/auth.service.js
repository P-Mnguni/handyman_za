import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import ApiError from '../../utils/ApiError';
import { email, success } from 'zod';

// Mock database (temporary - will be replaced with real model later)
const mockUsers = [];
const mockRefreshTokens = new Set();

class AuthService {
    /**
     * Register a new client (customer)
     */
    async registerClient(userData) {
        // Validation
        if (!userData.email || !userData.password || !userData.fullName) {
            throw ApiError.badRequest('Email, password, and full name are required');
        }

        // Check if user exists
        const existingUser = mockUsers.find(user => user.email === userData.email.toLowerCase());
        if (existingUser) {
            throw ApiError.conflict('User with this email already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(userData.password, 10);

        // Create user object
        const user = {
            _id: `user_${Date.now()}`,
            fullName: userData.fullName,
            email: userData.email.toLowerCase(),
            phone: userData.phone || null,
            passwordHash,
            role: 'CUSTOMER',
            isEmailVerified: false,
            isPhoneVerified: false,
            status: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: null,
        };

        // Save to mock DB (temporary)
        mockUsers.push(user);

        // Remove password from response
        const { passwordHash: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            message: 'Client registered successfully. Please verify your email.',
        };
    }

    /**
     * Register a new handyman
     */
    async registerHandyman(handymanData) {
        // Validation
        if (!handymanData.email || !handymanData.password || !handymanData.fullName || !handymanData.skills) {
            throw ApiError.badRequest('Email, password, full name, and skills are required');
        }

        // Check if user exists
        const existingUser = mockUsers.find(user => user.email === handymanData.email.toLowerCase());
        if (existingUser) {
            throw ApiError.conflict('User with this email already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(handymanData.password, 10);

        // Create user object
        const user = {
            _id: `user_${Date.name()}`,
            fullName: handymanData.fullName,
            email: handymanData.email.toLowerCase(),
            phone: handymanData.phone || null,
            passwordHash,
            role: 'HANDYMAN',
            isEmailVerified: false,
            isPhoneVerified: false,
            status: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: null,
        };

        // Save to mock DB (temporary)
        mockUsers.push(user);

        // Create handyman profile (in real implementation, this would be a separate model)
        const handymanProfile = {
            userId: user._id,
            bio: handymanData.bio || '',
            skills: Array.isArray(handymanData.skills) ? handymanData.skills : [handymanData.skills],
            yearsOfExperience: handymanData.yearsOfExperience || 0,
            verificationStatus: 'PENDING',
            rating: 0,
            totalJobsCompleted: 0,
            availability: handymanData.availability || {
                days: ['MON', 'TUE', 'WED', 'THUR', 'FRI'],
                timeSlots: ['08:00-12:00', '13:00-17:00'],
            },
            location: handymanData.location || {
                type: 'Point',
                coordinates: [28.0473, -26.2041]            // Default Johannesburg
            },
            documents: handymanData.documents || {},
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Remove password from response
        const { passwordHash: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            handymanProfile,
            message: 'Handyman registered successfully. Please wait for verification.',
        };
    }

    /**
     * Authenticate user login
     */
    async login(credentials) {
        const { email, password } = credentials;

        if (!email || !password) {
            throw ApiError.badRequest('Email and password are registered');
        }

        // Find user
        const user = mockUsers.find(u => u.email === email.toLowerCase());
        if (!user) {
            throw ApiError.unauthorized('Invalid credentials');
        }

        // Check status
        if (user.status !== 'ACTIVE') {
            throw ApiError.forbidden('Account is not active');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            throw ApiError.unauthorized('Invalid credentials');
        }

        // Update last login
        user.lastLoginAt = new Date();

        // Generate tokens
        const tokens = this.generateTokens(user);

        // Store refresh tokens (in real app, this would be in database)
        mockRefreshTokens.add(tokens.refreshToken);

        // Remove password from response
        const { passwordHash: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            tokens
        };
    }

    /**
     * Logout user by invalidating refresh token
     */
    async logout(token) {
        // Remove refresh token from valid set
        mockRefreshTokens.delete(token);

        // In real implementation, we would also blacklist the access token
        return { success: true };
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw ApiError.badRequest('Refresh token is required');
        }

        // Check if refresh token is valid
        if (!mockRefreshTokens.has(refreshToken)) {
            throw ApiError.unauthorized('Invalid refresh token');
        }

        try {
            // Verify refresh token
            const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret);

            // Find user
            const user = mockUsers.find(u => u._id === decoded.userId);
            if (!user || user.status !== 'ACTIVE') {
                throw ApiError.unauthorized('User not found or inactive');
            }

            // Generate new tokens
            const tokens = this.generateTokens(user);

            // Replace old refresh token with new one
            mockRefreshTokens.delete(refreshToken);
            mockRefreshTokens.add(tokens.refreshToken);

            return tokens;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw ApiError.unauthorized('Refresh token expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw ApiError.unauthorized('Invalid refresh token');
            }
            throw error;
        }
    }

    /**
     * Generate JWT tokens for a user
     */
    generateTokens(user) {
        const accessToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role
            },
            env.jwtSecret,
            { expiresIn: env.jwtExpiresIn },
        );

        const refreshToken = jwt.sign(
            {
                userId: user._id,
                type: 'refresh'
            },
            env.jwtRefreshSecret,
            { expiresIn: env.jwtRefreshExpiresIn },
        );

        return {
            accessToken,
            refreshToken,
            expiresIn: env.jwtExpiresIn,
        };
    }
}
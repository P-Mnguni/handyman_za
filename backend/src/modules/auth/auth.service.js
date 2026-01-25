import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import ApiError from '../../utils/ApiError';
import { email } from 'zod';

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

    
}
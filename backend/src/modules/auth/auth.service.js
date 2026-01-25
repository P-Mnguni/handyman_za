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

    
}
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import { email, success } from 'zod';
//import { useId } from 'react';

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
     * Get current user profile
     */
    async getCurrentUser(userId) {
        if (!userId) {
            throw ApiError.unauthorized('User not authenticated');
        }

        // Find user
        const userIndex = mockUsers.findIndex(u => u._id === userId);
        if (userIndex === -1) {
            throw ApiError.notFound('User not found');
        }

        // Check status
        if (mockUsers[userIndex].status !== 'ACTIVE') {
            throw ApiError.forbidden('Account is not active');
        }

        // Return user with password
        const { passwordHash, ...userWithoutPassword } = mockUsers[userIndex];

        // If user is a handyman, add profile data
        if (userWithoutPassword.role === 'HANDYMAN') {
            // In real implementation, we would fetch from HandymanProfile model
            userWithoutPassword.handymanProfile = {
                // Placeholder handyman profile data
                verificationStatus: 'PENDING',
                rating: 0
            };
        }

        return userWithoutPassword;
    }

    /**
     * Update current user profile
     */
    async updateProfile(userId, updateData) {
        if (!userId) {
            throw ApiError.unauthorized('User not authenticated');
        }

        // Find user
        const userIndex = mockUsers.findIndex(u => u._id === userId);
        if (userIndex === -1) {
            throw ApiError.notFound('User not found');
        }

        // Check status
        if (mockUsers[userIndex].status !== 'ACTIVE') {
            throw ApiError.forbidden('Account is not active');
        }

        // Fields that cannot be updated via this endpoint
        const restrictedFields = ['_id', 'email', 'passwordHash', 'role', 'status', 'createdAt'];
        for (const field of restrictedFields) {
            if (updateData[field] !== undefined) {
                throw ApiError.badRequest(`Cannot update ${field} via this endpoint`);
            }
        }

        // Update allowed fields
        const allowedUpdates = ['fullName', 'phone'];
        let updatedFields = [];

        for (const field of allowedUpdates) {
            if (updateData[field] !== undefined) {
                mockUsers[userIndex][field] = updateData[field];
                updatedFields.push(field);
            }
        }

        // Update timestamp
        mockUsers[userIndex].updatedAt = new Date();

        // Return updated user without password
        const { passwordHash, ...updatedUser } = mockUsers[userIndex];

        return {
            user: updatedUser,
            message: `Profile updated successfully. Updated fields: ${updatedFields.join(', ')}`
        };
    }

    /**
     * Verify email address
     */
    async verifyEmail(verificationToken) {
        if (verificationToken) {
            throw ApiError.badRequest('Verification token is required');
        }

        try {
            // Decode the verification token
            const decoded = jwt.verify(verificationToken, env.jwtSecret);

            // Find user
            const userIndex = mockUsers.findIndex(u => u._id === decoded.userId);
            if (userIndex === -1) {
                throw ApiError.notFound('User not found');
            }

            // Check if already verified
            if (mockUsers[userIndex].isEmailVerified) {
                throw ApiError.conflict('Email is already verified');
            }

            // Update user
            mockUsers[userIndex].isEmailVerified = true;
            mockUsers[userIndex].updatedAt = new Date();

            const { passwordHash, ...userWithoutPassword } = mockUsers[userIndex];

            return {
                user: userWithoutPassword,
                message: 'Email verified successfully',
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw ApiError.badRequest('Verification token has expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw ApiError.badRequest('Invalid verification token');
            }
        }
    }

    /**
     * Request password reset email
     */
    async forgotPassword(email) {
        if (!email) {
            throw ApiError.badRequest('Email is required');
        }

        // Find user
        const user = mockUsers.find(u => u.email === email.toLowerCase());
        if (!user) {
            // For security, don'n reveal if user exists or not
            return {
                message: 'If an account exists with this email, a password reset link has been sent'
            };
        }

        // Generate a password reset token (valid for 1 hour)
        const resetToken = jwt.sign(
            {
                useId: user._id,
                type: 'password_reset',
                email: user.email,
            },
            env.jwtSecret,
            { expiresIn: '1h' },
        );

        // In production, this would send an email
        console.log(`Password reset link: ${env.frontendUrl}/reset-password?token=${resetToken}`);

        return {
            message: 'If an account exists with this email, a password reset link has been sent',
            // In development, we return the token for testing
            ...(env.nodeEnv === 'development' && { resetToken }),
        };
    }

    /**
     * Reset password with token
     */
    async resetPassword(resetToken, newPassword) {
        if (!resetToken || !newPassword) {
            throw ApiError.badRequest('Reset token and new password are required');
        }

        if (newPassword.length < 6) {
            throw ApiError.badRequest('Password must be at least 6 characters');
        }

        try {
            // Verify the reset token
            const decoded = jwt.verify(resetToken, env.jwtSecret);

            if (decoded.type !== 'password_reset') {
                throw ApiError.badRequest('Invalid token type');
            }

            // Find user
            const userIndex = mockUsers.findIndex(u => u._id === decoded.userId);
            if (userIndex === -1) {
                throw ApiError.notFound('User not found');
            }

            // Hash new password
            const passwordHash = await bcrypt.hash(newPassword, 10);

            // Update user password
            mockUsers[userIndex].passwordHash = passwordHash;
            mockUsers[userIndex].updatedAt = new Date();

            // Invalidate all refresh tokens for this user (security measure)
            // In real implementation, we would query the database

            return {
                message: 'Password reset successfully. You can now login with your new password.',
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw ApiError.badRequest('Password reset token has expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw ApiError.badRequest('Invalid password reset token');
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

    /**
     * Verify JWT token (for middleware use later)
     */
    verifyToken(token) {
        try {
            return jwt.verify(token, env.jwtSecret);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw ApiError.unauthorized('Token expired');
            }
            throw ApiError.unauthorized('Invalid token');
        }
    }
}

export default new AuthService();
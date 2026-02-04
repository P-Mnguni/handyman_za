import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import User from '../users/user.model.js';
import { email, success } from 'zod';
//import { useId } from 'react';

// Remove the mock database since we'll use real MongoDB
// const mockUsers = [];
// const mockRefreshTokens = new Set();
class AuthService {
    /**
     * Register a new client (customer)
     */
    async registerClient(userData) {
        try {    
            // Validation
            if (!userData.email || !userData.password || !userData.fullName) {
                throw ApiError.badRequest('Email, password, and full name are required');
            }

            // Check if user exists
            const existingUser = await User.findOne({
                email: userData.email.toLowerCase()
            });

            if (existingUser) {
                throw ApiError.conflict('User with this email already exists');
            }

            // Create new customer user
            const user = await User.create({
                fullName: userData.fullName,
                email: userData.email.toLowerCase(),
                phone: userData.phone || null,
                passwordHash: userData.password,        // hashed by pre-save middleware
                role: 'CUSTOMER',
                isEmailVerified: false,
                isPhoneVerified: false,
                status: 'ACTIVE'
            });

            // The toJSON() method automatically remove passwordHash
            const userResponse = user.toJSON();
        
            return {
                user: userResponse,
                message: 'Client registered successfully. Please verify email.'
            };
        } catch (error) {
            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                throw ApiError.badRequest('Validation failed', errors);
            }

            // Handle MongoDB duplicate key
            if (error.code === 11000) {
                throw ApiError.conflict('User with this email already exists');
            }

            // Re-throw ApiError instances
            if (error instanceof ApiError) {
                throw error;
            }

            // Convert other errors to internal server error
            console.error('Registration error:', error);
            throw ApiError.internal('Registration failed. Please try again');
        }
    }

    /**
     * Register a new handyman
     */
    async registerHandyman(handymanData) {
        try {
            // Validation
            if (!handymanData.email || !handymanData.password || !handymanData.fullName || !handymanData.skills) {
                throw ApiError.badRequest('Email, password, full name, and skills are required');
            }

            // Check if user exists
            const existingUser = await User.findOne({
                email: handymanData.email.toLowerCase()
            });
            
            if (existingUser) {
                throw ApiError.conflict('User with this email already exists');
            }

            // Create handyman user
            const user = await User.create({
                fullName: handymanData.fullName,
                email: handymanData.email.toLowerCase(),
                phone: handymanData.phone || null,
                passwordHash: handymanData.password,
                role: 'HANDYMAN',
                isEmailVerified: false,
                isPhoneVerified: false,
                status: 'ACTIVE',
                handymanProfile: {
                    bio: handymanData.bio || '',
                    skills: Array.isArray(handymanData.skills) ? handymanData.skills : [handymanData.skills],
                    yearsOfExperience: 'PENDING',
                    rating: 0,
                    totalJobsCompleted: 0,
                    availability: handymanData.availability || {
                        days: ['MON', 'TUE', 'WED', 'THUR', 'FRI'],
                        timeSlots: ['08:00-12:00', '13:00-17:00']
                    },
                    location: handymanData.location || {
                        type: 'Point',
                        coordinates: [28.0473, -26.2041]        // Default: Johannesburg
                    },
                    documents: handymanData.documents || {}
                }
            });

            const userResponse = user.toJSON();
        
            return {
                user: userResponse,
                handymanProfile: userResponse.handymanProfile,
                message: 'Handyman registered successfully. Please wait for verification.',
            };
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                throw ApiError.badRequest('Validation failed', errors);
            }

            if (error.code === 11000) {
                throw ApiError.conflict('User with this email already exists');
            }

            if (error instanceof ApiError) {
                throw error;
            }

            console.error('Handyman registration error:', error);
            throw ApiError.internal('Registration failed. Please try again.');
        }
    }

    /**
     * Authenticate user login
     */
    async login(credentials) {
        try {
            const { email, password } = credentials;

            if (!email || !password) {
                throw ApiError.badRequest('Email and password are registered');
            }

            // Find user
            const user = await User.findByEmail(email.toLowerCase());
            
            if (!user) {
                throw ApiError.unauthorized('Invalid credentials');
            }

            // Check status
            if (user.status !== 'ACTIVE') {
                throw ApiError.forbidden('Account is not active');
            }

            // Verify password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                throw ApiError.unauthorized('Invalid credentials');
            }

            // Update last login
            user.lastLoginAt = new Date();
            await user.save();

            // Generate tokens
            const tokens = this.generateTokens(user);

            // Store refresh tokens (in real app, this would be in database)
            const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 100);    // 7 days
            await user.addRefreshToken(tokens.refreshToken, refreshTokenExpiresAt);

            const userResponse = user.toJSON();

            return {
                user: userResponse,
                tokens
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error('Login error:', error);
            throw ApiError.internal('Login failed. Please try again.');
        }
    }

    /**
     * Logout user by invalidating refresh token
     */
    async logout(token) {
        try {
            if (!token) {
                throw ApiError.badRequest('Token is required');
            }

            // Find user with refresh token
            const user = await User.findOne({
                'refreshTokens.token': token
            });

            if (user) {
                // Remove the specific refresh token
                await user.removeRefreshToken(token);
            }

            // In real implementation, we would also blacklist the access token
            return { success: true };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error('Logout error:', error);
            throw ApiError.internal('Logout failed. Please try again.');
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(refreshToken) {
        try {
            if (!refreshToken) {
                throw ApiError.badRequest('Refresh token is required');
            }

            const user = await User.findOne({
                'refreshTokens.token': refreshToken,
                'refreshTokens.expiresAt': { $gt: new Date() }          // Token not expired
            });
            
            if (!user) {
                throw ApiError.unauthorized('Invalid or expired refresh token');
            }

            // Check if user is active
            if (user.status !== 'ACTIVE') {
                throw ApiError.forbidden('Account is not active');
            }

            // Generate new tokens
            const tokens = this.generateTokens(user);

            // Update refresh token in database
            const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 100);

            // Remove old token and add new one
            await user.removeRefreshToken(refreshToken);
            await user.addRefreshToken(tokens.refreshToken, refreshTokenExpiresAt);

            return tokens;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            if (error.name === 'TokenExpiredError') {
                throw ApiError.unauthorized('Token expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw ApiError.unauthorized('Invalid token');
            }
            
            console.error('Refresh token error:', error);
            throw ApiError.internal('Token refresh failed. Please try again.');
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

    /**
     * Verify email address
     */
    async verifyEmail(verificationToken) {
        try {
            if (!verificationToken) {
                throw ApiError.badRequest('Verification token is required');
            }

            // Decode the verification token
            const decoded = jwt.verify(verificationToken, env.jwtSecret);

            // Find user
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw ApiError.notFound('User not found');
            }

            // Check if already verified
            if (user.isEmailVerified) {
                throw ApiError.conflict('Email is already verified');
            }

            // Update user
            user.isEmailVerified = true;
            await user.save();

            const userResponse = user.toJSON();

            return {
                user: userResponse,
                message: 'Email verified successfully',
            };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw ApiError.badRequest('Verification token has expired');
            }
            if (error.name === 'JsonWebTokenError') {
                throw ApiError.badRequest('Invalid verification token');
            }

            if (error instanceof ApiError) {
                throw error;
            }

            throw error;
        }
    }

    /**
     * Request password reset email
     */
    async forgotPassword(email) {
        try {
            if (!email) {
                throw ApiError.badRequest('Email is required');
            }

            // Find user
            const user = await User.findByEmail(email.toLowerCase());
            
            // For security, always return success even if user doesn't exist
            if (!user) {
                return {
                    message: 'If an account exists with this email, a password reset link has been sent'
                };
            }

            // Check if user is active
            if (user.status !== 'ACTIVE') {
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
            // For now, log it (in dev/test we'll return it)
            console.log(`Password reset link: ${env.frontendUrl}/reset-password?token=${resetToken}`);

            return {
                message: 'If an account exists with this email, a password reset link has been sent',
                // In development, we return the token for testing
                ...(env.nodeEnv === 'development' && { resetToken }),
            };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error('Forgot password error:', error);
            throw ApiError.internal('Password reset request failed. Please try again.');
        }
    }

    /**
     * Reset password with token
     */
    async resetPassword(resetToken, newPassword) {
        try {
            if (!resetToken || !newPassword) {
                throw ApiError.badRequest('Reset token and new password are required');
            }

            if (newPassword.length < 6) {
                throw ApiError.badRequest('Password must be at least 6 characters');
            }

            // Verify the reset token
            const decoded = jwt.verify(resetToken, env.jwtSecret);

            if (decoded.type !== 'password_reset') {
                throw ApiError.badRequest('Invalid token type');
            }

            // Find user
            const user = await User.findById(decoded.userId);
            if (!user) {
                throw ApiError.notFound('User not found');
            }

            // Update user password (pre-save middleware will hash it)
            user.passwordHash = newPassword;

            // Invalidate all refresh tokens for this user (security measure)
            await user.removeRefreshToken();

            await user.save();

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

            if (error instanceof ApiError) {
                throw error;
            }

            console.error('Reset password error:', error);
            throw ApiError.internal('Password reset failed. Please try again.');
        }
    }

    /**
     * Get current user profile
     */
    async getCurrentUser(userId) {
        try {
            if (!userId) {
                throw ApiError.unauthorized('User not authenticated');
            }

            // Find user
            const user = await User.findById(userId);
            if (!user) {
                throw ApiError.notFound('User not found');
            }

            // Check status
            if (user.status !== 'ACTIVE') {
                throw ApiError.forbidden('Account is not active');
            }

            // Return user with password
            return user.toJSON()
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            console.error('Get current user error:', error);
            throw ApiError.internal('Failed to retrieve user profile. Please try again.');
        }
    }

    /**
     * Update current user profile
     */
    async updateProfile(userId, updateData) {
        try {
            if (!userId) {
                throw ApiError.unauthorized('User not authenticated');
            }

            // Find user
            const user = await User.findById(userId);
            if (!user) {
                throw ApiError.notFound('User not found');
            }

            // Check status
            if (user.status !== 'ACTIVE') {
                throw ApiError.forbidden('Account is not active');
            }

            // Fields that cannot be updated via this endpoint
            const restrictedFields = ['_id', 'email', 'passwordHash', 'role', 'status', 'createdAt', 'updatedAt'];
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
                    user[field] = updateData[field];
                    updatedFields.push(field);
                }
            }

            // If user is a handyman, allow updating handyman profile fields
            if (user.role === 'HANDYMAN' && updateData.handymanProfile) {
                const handymanAllowedUpdates = ['bio', 'skills', 'yearsOfExperience', 'availability'];
                for (const field of handymanAllowedUpdates) {
                    if (updateData.handymanProfile[field] !== undefined) {
                        user.handymanProfile[field] = updateData.handymanProfile[field];
                        updatedFields.push(`handymanProfile.${field}`);
                    }
                }
            }

            await user.save();
            const userResponse = user.toJSON();

            return {
                user: userResponse,
                message: `Profile updated successfully. Updated fields: ${updatedFields.join(', ')}`
            };
        } catch (error) {
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                throw ApiError.badRequest('Validation failed', errors);
            }

            if (error instanceof ApiError) {
                throw error;
            }

            console.error('Update profile error:', error);
            throw ApiError.internal('Profile update failed. Please try again.');
        }
    }
}

export default new AuthService();
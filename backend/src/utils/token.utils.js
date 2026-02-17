import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import ApiError from "./ApiError";
import { email } from "zod";

/**
 * Generate access token (short-lived)
 * @param {Object} user - User object
 * @returns {string} JWT access token
 */
export const generateAccessToken = (user) => {
    // Payload minimal
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        tokenType: 'access'
    };

    return jwt.sign(
        payload,
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
    );
};

/**
 * Generate refresh token (long-lived)
 * @param {Object} user - User object
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (user) => {
    // Refresh token carries minimal payload
    const payload = {
        userId: user._id,
        tokenType: 'refresh'
        // Role not included - role changes require re-login
    };

    return jwt.sign(
        payload,
        env.jwtRefreshSecret,
        { expiresIn: env.jwtRefreshExpiresIn }
    );
};

/**
 * Generate both tokens (convenience function)
 * @param {Object} user - User object
 * @returns {Object} Object containing access and refresh tokens
 */
export const generateTokens = (user) => {
    return {
        accessToken: generateAccessToken(user),
        refreshToken: generateRefreshToken(user)
    };
};

/**
 * Verify access token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, env.jwtSecret);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw ApiError.unauthorized('Access token expired.  Please refresh your session.');
        }
        if (error.name === 'JsonWebTokenError') {
            throw ApiError.unauthorized('Invalid access token. Please login again.');
        }
        // Catch any other unexpected errors
        throw ApiError.unauthorized('Authentication failed. Please login again.');
    }
};
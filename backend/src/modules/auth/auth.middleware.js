import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import ApiError from '../../utils/ApiError.js';
import { email } from 'zod';


/**
 * Authentication middleware
 * Extracts and verifies JWT token from Authorization header
 */
export const authenticate = (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw ApiError.unauthorized('No token provided');
        }

        // Check bearer format
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            throw ApiError.unauthorized('Invalid token format. Use: Bearer [token]');
        }

        const token = parts[1];

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, env.jwtSecret);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw ApiError.unauthorized('Access token expired');
            }
            if (error.name === "JsonWebTokenError") {
                throw ApiError.unauthorized('Invalid access token');
            }
            throw ApiError.unauthorized('Authentication failed');
        }

        // Attach user to request
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        // Pass to global error handler
        next(error);
    }
};

/**
 * Extract token without verifying
 */
export const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;

    return parts[1];
};


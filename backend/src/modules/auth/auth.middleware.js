import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import ApiError from '../../utils/ApiError.js';


/**
 * Authentication middleware
 * Extracts and verifies JWT token from Authorization header
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw ApiError.unauthorized('No token provided');
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw ApiError.unauthorized('No token provided');
        }

        // Verify token
        const decoded = jwt.verify(token, env.jwtSecret);

        // Attach user to request object
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            next(ApiError.unauthorized('Token expired'));
        } else if (error.name === 'JsonWebTokenError') {
            next(ApiError.unauthorized('Invalid token'));
        } else {
            next(error);
        }
    }
};

/**
 * Role-based authorization middleware
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError.unauthorized('Not authenticated'));
        }

        if (!roles.includes(req.user.role)) {
            return next(ApiError.forbidden('Insufficient permissions'));
        }

        next();
    };
};


export { authMiddleware, authorize };
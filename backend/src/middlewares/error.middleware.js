import { th } from 'zod/v4/locales';
import { env } from '../config/env.js';
import { success } from 'zod';

/**
 * Custom AppError class for consistent error handling
 * @extends Error
 */
export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true, errors = null) {
        super (message);

        this.name = this.constructor.name;
        this.statusCode= statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational;
        this.errors = errors;
        this.timestamp = new Date().toISOString();

        // Capture stack trace (excluding constructor call)
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Custom error types for specific scenarios
 */
export class ValidationError extends AppError {
    constructor(message, errors = null) {
        super(message, 400, true, errors);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends AppError {
    constructor(message = 'You do not have permission to perform this action') {
        super(message, 403);
        this.name = 'AuthorizationError'
    }
}

export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404);
        this.name = 'NotFoundError';
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

export class RateLimitError extends AppError {
    constructor(message = 'Too many requests, please try again later') {
        super(message, 429);
        this.name = 'RateLimitError';
    }
}

/**
 * MongoDB duplicate key error handler
 */
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${value}. Please use another value.`;

    return new AppError(message, 400);
};

/**
 * MongoDB validation error handler
 */
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(el => ({
        field: el.path,
        message: el.message,
    }));

    const message = `Invalid input data: ${errors.map(e => e.field).join(', ')}`;
    return new AppError(message, 400, true, errors);
};

/**
 * JWT error handler
 */
const handleJWTError = () => {
    return new AuthenticationError('Invalid token. Please log in again.');
};

const handleJWTExpiredError = () => {
    return new AuthenticationError('Your token has expired. Please log in again.');
};

/**
 * Global error handler middleware
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
    // Set default values
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    err.message = err.message || 'Something went wrong';

    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    // Log the error (with different detail levels based on environment)
    logError(error, req);

    // Handle specific error types
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.code === 11000) error = handleDuplicateKeyError();
    if (error.name === 'ValidationError' || error._message?.includes('validation')) {
        error = handleValidationError(error);
    }

    // Format the error response
    const response = {
        success: false,
        error: {
            message: error.message,
            status: error.status,
            statusCode: error.statusCode,
            timestamp: error.timestamp || new Date().toISOString(),
            path: req.originalUrl,
            method: req.method,
        },
    };

    // Includes validation errors if they exist
    if (error.errors) {
        response.error.errors = error.errors;
    }

    // Include stack trace in development only
    if (env.isDevelopment) {
        response.error.stack = error.stack;

        // Additional debugging info in development
        response.error.name = error.name;
        response.error.isOperational = error.isOperational;
    }

    // Send the error response
    res.status(error.statusCode).json(response);
};

/**
 * Log errors with appropriate detail
 */
const logError = (error, req) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        error: {
            name: error.name,
            message: error.message,
            statusCode: error.statusCode,
            stack: error.stack,
        },
    };

    if (env.isProduction) {
        // Production: Log minimal info to console, 
        // send full details to monitoring service
        console.error(`[${logEntry.timestamp}] ${error.statusCode} 
                        ${req.method} ${req.originalUrl} - ${error.message}`);
        
        // Send to Sentry/DataDog/etc.
        // if (env.sentryDsn) {
        //      Sentry.captureException(error);
        // }
    } else {
        // Development: Full detailed logging
        console.error('\n🚨 ========== ERROR DETAILS ==========');
        console.error(`Timestamp: ${logEntry.timestamp}`);
        console.error(`Request: ${req.method} ${req.originalUrl}`);
        console.error(`IP: ${req.ip}`);
        console.error(`Status Code: ${error.statusCode}`);
        console.error(`Error Name: ${error.name}`);
        console.error(`Error Message: ${error.message}`);

        if (error.stack) {
            console.error('\nStack Trace:');
            console.error(error.stack);
        }

        console.error('========================================\n');
    }
};

/**
 * 404 Not Found handler middleware
 */
export const notFoundHandler = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
};

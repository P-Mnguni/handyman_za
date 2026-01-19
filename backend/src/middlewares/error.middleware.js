import { th } from 'zod/v4/locales';
import { env } from '../config/env.js';
import { object, success } from 'zod';

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
    // Extract field and value from various possible structures
    let field = 'unknown';
    let value = '';

    if (err.keyValue) {
        // Mongoose style: { keyValue: { email: 'test@example.com' } }
        field = Object.keys(err.keyValue)[0];
        value = err.keyValue[field];
    } else if (err.keyPattern) {
        // Alternatively Mongoose style: { keyPattern: { email: 1 } }
        field = Object.keys(err.keyPattern)[0];
        value = 'provided value';
    } else if (err.errmsg) {
        // MongoDB driver style: parse from error message
        const match = err.errmsg.match(/index: (.+?) dup key:/);
        if (match) {
            field = match[1].split('_')[1] || 'unknown';        // Extract field from index name
        }
    }

    const message = field !== 'unknown' 
                ? `Duplicate field value for '${field}': ${value}. Please Use another value.`
                : 'Duplicate key error. The resource already exists.';

    return new AppError(message, 400);
};

/**
 * MongoDB validation error handler
 */
const handleValidationError = (err) => {
    let errors = [];

    // Handle Mongoose validation errors
    if (err.errors && typeof err.errors === 'object') {
        errors = Object.values(err.errors).map(el => ({
            field: el.path || el.field || 'unknown',
            message: el.message || 'Validation failed',
        }));
    }
    // Handle generic validation errors with errors array
    else if (Array.isArray(err.errors)) {
        errors = err.errors;
    }

    const message = errors.length > 0 
                    ? `Invalid input data: ${errors.map(e => e.field).join(', ')}`
                    : 'Validation failed';
    
    return new AppError(message, 400, true, errors);
};

/**
 * JWT error handler
 */
const handleJWTError = (originalError) => {
    const error = new AppError('Invalid token. Please log in again.', 401);
    error.name = originalError.name || 'JsonWebTokenError';         // Preserve original name
    return error;
};

const handleJWTExpiredError = (originalError) => {
    const error = new AppError('Your token has expired. Please log in again.', 401);
    error.name = originalError.name || 'TokenExpiredError';
    return error;
};

/**
 * Global error handler middleware
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
    // Start with the original error
    let error = {
        // Copy all properties including non-enumerable ones
        name: err.name,
        message: err.message,
        stack: err.stack,
        ...err,             // Spread enumerable properties
    };

    // Handle specific error types FIRST 
    if (error.name === 'JsonWebTokenError') {
        error = handleJWTError(error);
    }
    if (error.name === 'TokenExpiredError') {
        error = handleJWTExpiredError(error);
    }
    if (error.code === 11000 || error.code === 11001) {
        error = handleDuplicateKeyError(error);
    }
    if (error.name === 'ValidateError' || error._message?.includes('validation')) {
        error = handleValidationError(error);
    }
    if (error.name === 'CastError') {
        error = new AppError(`Invalid ${error.path}: ${error.value}`, 400);
    }

    // NOW set defaults (only if not already set by handlers)
    error.statusCode = error.statusCode || 500;
    error.status = error.status || `${error.statusCode}`.startsWith('4') ? 'fail' : 'error';
    error.message = error.message || 'Something went wrong';
    error.timestamp = error.timestamp || new Date().toISOString();

    // Log the error (now it will show the correct status code)
    logError(error, req);

    // Format the error response
    const response = {
        success: false,
        error: {
            message: error.message,
            status: error.status,
            statusCode: error.statusCode,
            timestamp: error.timestamp,
            path: req.originalUrl,
            method: req.method,
        },
    };

    // Include validation errors if they exist
    if (error.errors) {
        response.error.errors = error.errors;
    }

    // Include stack trace in development only
    if (env.isDevelopment) {
        response.error.stack = error.stack;
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

/**
 * Async handler wrapper to avoid try/catch in controllers
 * @param {Function} fn - Async controller function
 * @returns {Function} Wrapped function with error handling
 */
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Export all error types and handlers
 */
export default {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    errorHandler,
    notFoundHandler,
    asyncHandler,
};
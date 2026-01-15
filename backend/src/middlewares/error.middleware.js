import { th } from 'zod/v4/locales';
import { env } from '../config/env.js';

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


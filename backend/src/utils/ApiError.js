/**
 * Custom API Error class for consistent error handling throughout the application
 * @extends Error
 */
export class ApiError extends Error {
    /**
     * Create a new ApiError
     * @param {string} message - Human-readable error message
     * @param {number} statusCode - HTTP status code
     * @param {boolean} isOperational - Whether the error is operational (true) or programming (false)
     * @param {Array|null} errors - Optional array of validation/sub-errors
     */
    constructor(
        message,
        statusCode = 500,
        isOperational = true,
        errors = null
    ) {
        super(message);

        // Ensure the class name is correct
        this.name = this.constructor.name;

        // HTTP status code (400, 401, 403, 404, 409, 422, 500, etc.)
        this.statusCode = statusCode;

        // Categories as 'fail' for client errors (4xx) or 'error' for server errors (5xx)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // Operational errors are trusted errors that we anticipate and handle gracefully
        // Programming errors (bugs) should be treated as isOperational - false
        this.isOperational = isOperational;

        // Additional error details (useful for validation errors)
        this.errors = errors;

        // TTimestamp for when the error occurred
        this.timestamp = new Date().toISOString();

        // Capture stack trace (excluding constructor call from stack)
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Create an Unauthorized error (403)
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static forbidden(message = 'Forbidden') {
        return new ApiError(message, 403);
    }

    
}
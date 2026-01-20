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
     * Create a Bad Request error (400)
     * @param {string} message - Error message
     * @param {Array|null} errors - Optional validation errors
     * @returns {ApiError}
     */
    static badRequest(message = 'Bad Request', errors = null) {
        return new ApiError(message, 400, true, errors);
    }

    /**
     * Create an Unauthorized error (401)
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static unauthorized(message = 'Unauthorized') {
        return new ApiError(message, 401);
    }

    /**
     * Create an Forbidden error (403)
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static forbidden(message = 'Forbidden') {
        return new ApiError(message, 403);
    }

    /**
     * Create a Not Found error (404)
     * @param {string} resource - Name of the resource not found
     * @returns {ApiError}
     */
    static notFound(resource = 'Resource') {
        return new ApiError(`${resource} not found`, 404);
    }

    /**
     * Create a Conflict error (409)
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static conflict(message = 'Conflict') {
        return new ApiError(message, 409);
    }

    /**
     * Create a Validation error (422)
     * @param {string} message - Error message 
     * @param {Array} errors - Validation error details
     * @returns {ApiError}
     */
    static validation(message = 'Validation Failed', errors = []) {
        return new ApiError(message, 422, true, errors);
    }

    /**
     * Create an Internal Server Error (500)
     * @param {string} message - Error message
     * @returns {ApiError}
     */
    static internal(message = 'Internal Server Error') {
        return new ApiError(message, 500, false);       // Not operational
    }

    /**
     * Convert the error to a plain object 
     * (useful for logging or sending to client in development)
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            status: this.status,
            timestamp: this.timestamp,
            isOperational: this.isOperational,
            ...(this.errors && { errors: this.errors }),
            ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
        };
    }

    /**
     * Convert to string representation
     * @returns {string} String representation of the error
     */
    toString() {
        return `[${this.name}] ${this.statusCode} ${this.status}: ${this.message}`;
    }
}
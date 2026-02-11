import ApiError from '../utils/ApiError.js';

/**
 * Validation middleware factory
 * Creates a middleware function that validates request data against a Joi schema
 * 
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware
 */
const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        // Skip validation if no schema provided
        if (!schema) {
            return next();
        }

        // Get the data to validate from the request
        const data = req[property];

        // Validate the data against the schema
        const { error, value } = schema.validate(data, {
            abortEarly: false,                  // Return all errors, not just the first
            stripUnknown: true,                 // Remove unknown fields
            allowUnknown: false                 // Don't allow fields not defined in schema
        });

        // If validation fails, format and throw error
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return next(ApiError.badRequest('Validation failed', errors));
        }

        // Replace request property with validated and sanitized data
        req[property] = value;

        return next();
    };
};
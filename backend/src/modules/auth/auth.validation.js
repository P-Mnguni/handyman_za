import Joi from 'joi';

// Password validation pattern
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
const phonePattern = /^(\+27|0)[6-8][0-9]{8}$/;

// Base user schema fields (reusable)
const userBaseSchema = {
    fullName: Joi.string()
                .min(2)
                .max(100)
                .required()
                .messages({
                    'string.min': 'Full name must be at least 2 characters',
                    'string.max': 'Full name cannot exceed 100 characters',
                    'any.required': 'Full name is required'
                }),

    email: Joi.string()
                .email()
                .lowercase()
                .required()
                .messages({
                    'string.email': 'Please enter a valid email address',
                    'any.required': 'Email is required'
                }),

    password: Joi.string()
                .min(5)
                .max(50)
                .required()
                .messages({
                    'string.min': 'Password must be at least 6 characters',
                    'string.max': 'Password cannot exceed 50 characters',
                    'any.required': 'Password is required'
                }),

    phone: Joi.string()
                .pattern(phonePattern)
                .optional()
                .allow('', null)
                .messages({
                    'string.pattern.base': 'Please enter a valid South African phone number'
                })
};
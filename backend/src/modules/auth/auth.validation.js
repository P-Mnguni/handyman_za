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

// Register schemas
export const registerClientSchema = Joi.object({
    fullName: userBaseSchema.fullName,
    email: userBaseSchema.email,
    password: userBaseSchema.password,
    phone: userBaseSchema.phone
});

export const registerHandymanSchema = Joi.object({
    fullName: userBaseSchema.fullName,
    email: userBaseSchema.email,
    password: userBaseSchema.password,
    phone: userBaseSchema.phone,

    // Handyman specific fields
    skills: Joi.array()
                .items(Joi.string())
                .min(1)
                .required()
                .messages({
                    'array.min': 'At least one skill is required',
                    'any.required': 'Skills are required'
                }),

    bio: Joi.string()
                .max(500)
                .optional()
                .allow('', null)
                .messages({
                    'string.max': 'Bio cannot exceed 500 characters'
                }),

    yearsOfExperience: Joi.number()
                .integer()
                .min(0)
                .max(60)
                .optional()
                .messages({
                    'number.base': 'Years of experience must be a number',
                    'number.min': 'Years of experience cannot be negative',
                    'number.max': 'Years of experience cannot exceed 60'
                }),

    availability: Joi.object({
        days: Joi.array()
                .items(Joi.string().valid('MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'))
                .optional(),
        timeSlots: Joi.array()
                .items(Joi.string().pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]-([0-1][0-9]|2[0-3]):[0-5][0-9]$/))
                .optional()
    }).optional(),

    location: Joi.object({
        type: Joi.string().valid('Point').default('Point'),
        coordinates: Joi.array()
                        .items(Joi.number())
                        .length(2)
                        .optional()
    }).optional()
});

// Login schema
export const loginSchema = Joi.object({
    email: userBaseSchema.email,
    password: userBaseSchema.password
});

// Email verification schema
export const verifyEmailSchema = Joi.object({
    token: Joi.string()
                .required()
                .messages({
                    'any.required': 'Verification token is required'
                })
});

// Forgot password schema
export const forgotPasswordSchema = Joi.object({
    email: userBaseSchema.email
});

//
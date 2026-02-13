import Joi from 'joi';

// Validation pattern
const phonePattern = /^(\+27|0)[6-8][0-9]{8}$/;
const timeSlotPattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]-([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

// Base user schema fields (reusable)
const nameSchema = Joi.string()
                        .min(2)
                        .max(50)
                        .required()
                        .messages({
                            'string.min': 'First name must be at least 2 characters',
                            'string.max': 'First name cannot exceed 50 characters',
                            'any.required': 'First name is required'
                        });

const lastNameSchema = Joi.string()
                        .min(2)
                        .max(50)
                        .required()
                        .messages({
                            'string.min': 'Last name must be at least 2 characters',
                            'string.max': 'Last name cannot exceed 50 characters',
                            'any.required': 'Last name is required'
                        });

const emailSchema = Joi.string()
                        .email()
                        .lowercase()
                        .required()
                        .messages({
                            'string.email': 'Please enter a valid email address',
                            'any.required': 'Email is required'
                        });

const passwordSchema = Joi.string()
                        .min(6)
                        .max(50)
                        .required()
                        .messages({
                            'string.min': 'Password must be at least 6 characters',
                            'string.max': 'Password cannot exceed 50 characters',
                            'any.required': 'Password is required'
                        });

const phoneNumberSchema = Joi.string()
                        .pattern(phonePattern)
                        .optional()
                        .messages({
                            'string.pattern.base': 'Please enter a valid South African phone number',
                            'any.required': 'Phone number is required'
                        });

const roleSchema = Joi.string()
                        .valid('client', 'handyman')
                        .required()
                        .messages({
                            'any.only': 'Role must ne either client or handyman',
                            'any.required': 'Role is required'
                        });

const handymanSkillsSchema = Joi.array()
                        .items(Joi.string())
                        .min(1)
                        .messages({
                            'array.min': 'At least one skills is required'
                        });

const handymanBioSchema = Joi.string()
                        .max(500)
                        .messages({
                            'string.max': 'Bio cannot exceed 500 characters'
                        });

const handymanYearsExperienceSchema = Joi.number()
                        .integer()
                        .min(0)
                        .max(60)
                        .messages({
                            'number.base': 'Years of experience must be a number',
                            'number.min': 'Years of experience cannot be negative',
                            'number.max': 'Years of experience cannot exceed 60'
                        });

const handymanAvailabilitySchema = Joi.object({
    days: Joi.array()
            .items(Joi.string().valid('MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN'))
            .min(1)
            .messages({
                'array.min': 'At least one day must be selected'
            }),
    timeSlots: Joi.array()
            .items(Joi.string().pattern(timeSlotPattern))
            .min(1)
            .messages({
                'array.min': 'At least one time slot must be provided',
                'string.pattern.base': 'Time slots must be in format HH:MM-HH:MM (e.g., 08:00-12:00)'
            })
});

const handymanLocationSchema = Joi.object({
    type: Joi.string()
            .valid('Point')
            .default('Point'),
    coordinates: Joi.array()
            .items(Joi.number())
            .length(2)
            .messages({
                'array.length': 'Coordinates must have exactly 2 values [longitude, latitude]'
            })
});

/**
 * Register schemas
 * Validates: firstName, lastName, email, password, phoneNumber, role
 * Handyman-specific: skills, bio, yearsOfExperience, availability, location (all optional)
 */
export const registerSchema = Joi.object({
    firstName: nameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    password: passwordSchema,
    phoneNumber: phoneNumberSchema,
    role: roleSchema,

    // Handyman specific fields
    ...(['skills', 'bio', 'yearsOfExperience', 'availability', 'location'].reduce((acc, field) => {
        acc[field] = Joi.when('role', {
            is: 'handyman',
            then: getHandymanFieldSchema(field),
            otherwise: Joi.forbidden().messages({
                'any.unknown': `${field} is only allowed for handymen`
            })
        });
        return acc;
    }, {}))
});

// Helper function to get schema for each handyman field
function getHandymanFieldSchema(field) {
    switch(field) {
        case 'skills':
            return handymanSkillsSchema.optional();
        case 'bio':
            return handymanBioSchema.optional();
        case 'yearsOfExperience':
            return handymanYearsExperienceSchema.optional();
        case 'availability':
            return handymanAvailabilitySchema.optional();
        case 'location':
            return handymanLocationSchema.optional();
        default:
            return Joi.any().optional();
    }
}

/**
 * Login schema
 */
export const loginSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema
});

/**
 * Email verification schema
 */
export const verifyEmailSchema = Joi.object({
    token: Joi.string()
                .required()
                .messages({
                    'any.required': 'Verification token is required'
                })
});

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = Joi.object({
    email: emailSchema
});

/**
 * Reset password schema
 */
export const resetPasswordSchema = Joi.object({
    token: Joi.string()
                .required()
                .messages({
                    'any.required': 'Reset token is required'
                }),
    newPassword: passwordSchema
});

/**
 * Refresh token schema
 */
export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
                        .required()
                        .messages({
                            'any.required': 'Refresh token is required'
                        })
});

/**
 * Update profile schema
 * All fields optional, but at least one required
 */
export const updateProfileSchema = Joi.object({
    // Basic fields (any role)
    firstName: nameSchema.optional(),
    lastName: lastNameSchema.optional(),
    phoneNumber: phoneNumberSchema.optional(),

    // Handyman profile updates
    skills: handymanSkillsSchema.optional(),
    bio: handymanBioSchema.optional(),
    yearsOfExperience: handymanYearsExperienceSchema.optional(),
    availability: handymanAvailabilitySchema.optional()
})
.min(1)
.messages({
    'object-min': 'At least one field to update is required'
});

/**
 * ID params schema 
 */
export const idParamSchema = Joi.object({
    id: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .required()
            .messages({
                'string.pattern.base': 'Invalid ID format',
                'any.required': 'ID is required'
            })
});

/**
 * Pagination Query Schemas
 */
export const paginationQuerySchema = Joi.object({
    page: Joi.number()
            .integer()
            .min(1)
            .default(1)
            .optional(),
    limit: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .optional(),
    sort: Joi.string()
            .optional(),
    order: Joi.string()
            .valid('asc', 'desc')
            .default('asc')
            .optional()
});

/**
 * Nearby Handyman Query Schema
 */
export const nearbyHandymanQuerySchema = Joi.object({
    lat: Joi.number()
            .min(-90)
            .max(90)
            .required()
            .messages({
                'any.required': 'Latitude is required for nearby search'
            }),
    lng: Joi.number()
            .min(-180)
            .max(180)
            .required()
            .messages({
                'any.required': 'Longitude is required for nearby search'
            }),
    radius: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .default(10)
            .optional(),
    serviceId: Joi.string()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .optional()
}).and('lat', 'lng');

// Export all schemas
export default {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    updateProfileSchema,
    idParamSchema,
    paginationQuerySchema,
    nearbyHandymanQuerySchema
};
import mongoose from 'mongoose';

// Job status enum - defines all possible states a job can be in
export const JobStatus = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    CANCELED: "canceled"
};

// Service categories enum - expand this based on your platform's offerings
export const ServiceCategory = {
    PLUMBING: "plumbing",
    ELECTRICAL: "electrical",
    CARPENTRY: "carpentry",
    PAINTING: "painting",
    CLEANING: "cleaning",
    MOVING: "moving",
    GARDENING: "gardening",
    HVAC: "hvac",
    APPLIANCE_REPAIR: "appliance_repair",
    GENERAL_MAINTENANCE: "general_maintenance",
    OTHER: "other"
};

const jobSchema = new mongoose.Schema({
    // 🆔 Basic information
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
        minlength: [5, "Title must be at least 5 characters long"],
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Job description is required"],
        trim: true,
        minlength: [20, "Description must be at least 20 characters long"],
        maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    serviceCategory: {
        type: String,
        required: [true, "Service category is required"],
        enum: {
            values: Object.values(ServiceCategory),
            message: "Please select a valid service category"
        }
    },
    images: [{
        type: String,                                                           // URLs to uploaded images
        validate: {
            validator: function(url) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);   // Basic URL validation
            },
            message: "Please provide valid image URLs"
        }
    }],

    // 📍 Location Information 
    location: {
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true
        },
        province: {
            type: String,
            required: [true, "Province is required"],
            trim: true
        },
        coordinates: {
            // GeoJSON format for future map integration
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                index: '2dsphere'
            }
        },
        suburb: String,
        postalCode: String
    },

    // 💰 Pricing
    budget: {
        type: Number,
        min: [0, "Budget cannot be negative"],
        validate: {
            validator: function(value) {
                // Budget can be null/undefined, but if provided must be > 0
                return value === null || value === undefined || value > 0;
            },
            message: "Budget must be greater than 0 if provided"
        }
    },
    isNegotiable: {
        type: Boolean,
        default: false
    },

    // 👤 Relationships
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Job must have a client"],
        index: true
    },
    handyman: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true
    },

    // 📊 Status
    status: {
        type: String,
        enum: {
            values: Object.values(JobStatus),
            message: "Please select a valid job status"
        },
        default: JobStatus.PENDING,
        index: true
    },

    // ⭐ Review Tracking
    clientReviewed: {
        type: Boolean,
        default: false
    },
    handymanReviewed: {
        type: Boolean,
        default: false
    },

    // 📆 Dates that matter
    acceptedAt: Date,
    startedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cancellationReason: {
        type: String,
        trim: true,
        maxlength: [500, "Cancellation reason cannot exceed 500 characters"]
    },

    // ⏱️ Scheduling 
    preferredDate: Date,
    preferredTimeSlot: String,
    deadline: Date

}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.__v;
            return ret;
        }
    }
});
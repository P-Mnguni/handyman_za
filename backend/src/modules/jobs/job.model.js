import mongoose from 'mongoose';
import { JobStatus, ServiceCategory, JobValidationMessage } from "./job.constants.js";

const jobSchema = new mongoose.Schema({
    // 🆔 Basic information
    title: {
        type: String,
        required: [true, JobValidationMessage.TITLE_REQUIRED],
        trim: true,
        minlength: [5, JobValidationMessage.TITLE_MIN_LENGTH],
        maxlength: [100, JobValidationMessage.TITLE_MAX_LENGTH]
    },
    description: {
        type: String,
        required: [true, JobValidationMessage.DESCRIPTION_REQUIRED],
        trim: true,
        minlength: [20, JobValidationMessage.DESCRIPTION_MIN_LENGTH],
        maxlength: [2000, JobValidationMessage.DESCRIPTION_MAX_LENGTH],
    },
    serviceCategory: {
        type: String,
        required: [true, JobValidationMessage.CATEGORY_REQUIRED],
        enum: {
            values: Object.values(ServiceCategory),
            message: JobValidationMessage.CATEGORY_INVALID
        }
    },
    images: [{
        type: String,                                                           // URLs to uploaded images
        validate: {
            validator: function(url) {
                return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);   // Basic URL validation
            },
            message: JobValidationMessage.IMAGE_INVALID
        }
    }],

    // 📍 Location Information 
    location: {
        address: {
            type: String,
            required: [true, JobValidationMessage.ADDRESS_REQUIRED],
            trim: true
        },
        city: {
            type: String,
            required: [true, JobValidationMessage.CITY_REQUIRED],
            trim: true
        },
        province: {
            type: String,
            required: [true, JobValidationMessage.PROVINCE_REQUIRED],
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
        min: [0, JobValidationMessage.BUDGET_MIN_PRICE],
        validate: {
            validator: function(value) {
                // Budget can be null/undefined, but if provided must be > 0
                return value === null || value === undefined || value > 0;
            },
            message: JobValidationMessage.BUDGET_POSITIVE
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
        required: [true, JobValidationMessage.CLIENT_REQUIRED],
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
            message: JobValidationMessage.STATUS_INVALID
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
        maxlength: [500, JobValidationMessage.CANCELLATION_REASON_MAX_LENGTH]
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

// 🖼️ Creates geospatial index for location-based queries
jobSchema.index({ "location.coordinates": "2dsphere" });

// 📊 Compound indexes for common queries
jobSchema.index({ client: 1, createdAt: -1 })           // Get client's jobs, newest first
jobSchema.index({ handyman: 1, status: 1 });            // Get handyman's jobs by status
jobSchema.index({ status: 1, createdAt: -1 });          // Get recent jobs by status
jobSchema.index({ serviceCategory: 1, status: 1 });     // Find available jobs by category

// 🔍 Virtual for checking if job is available for handymen to accept
jobSchema.virtual('isAvailable').get(function() {
    return this.status === JobStatus.PENDING && !this.handyman;
});

// 🔍 Virtual for checking if job is active (not completed or cancelled)
jobSchema.virtual('isActive').get(function() {
    return [JobStatus.ACCEPTED, JobStatus.IN_PROGRESS].includes(this.status);
});

// 🔍 Virtual for checking if job can be reviewed
jobSchema.virtual('canBeReviewed').get(function() {
    return this.status === JobStatus.COMPLETED;
});

// 📝 Pre-save middleware to update timestamps based on status change
jobSchema.pre('save', async function() {
    // When status changes to ACCEPTED
    if (this.isModified('status') && this.status === JobStatus.ACCEPTED && !this.acceptedAt) {
        this.acceptedAt = new Date();
    }

    // When status changes to IN_PROGRESS
    if (this.isModified('status') && this.status === JobStatus.IN_PROGRESS && !this.startedAt) {
        this.startedAt = new Date();
    }

    // When status changes to COMPLETED
    if (this.isModified('status') && this.status === JobStatus.COMPLETED && !this.completedAt) {
        this.completedAt = new Date();
    }

    // When status changes to CANCELLED
    if (this.isModified('status') && this.status === JobStatus.CANCELED && !this.cancelledAt) {
        this.cancelledAt = new Date();
    }

});

// 📝 Instance method to check if user can modify this job
jobSchema.methods.canBeModifiedBy = function(userId, userRole) {
    // Client can modify their own pending jobs
    if (userRole === 'client' && this.client.toString() === userId.toString()) {
        return this.status === JobStatus.PENDING;
    }

    // Handyman can modify jobs they've accepted
    if (userRole === 'handyman' && this.handyman && this.handyman.toString() === userId.toString()) {
        return [JobStatus.ACCEPTED, JobStatus.IN_PROGRESS].includes(this.status);
    }

    // Admins can modify anything (if you have admin role)
    if (userRole === 'admin') {
        return true;
    }

    return false;
};

// Create and export the model
export const Job = mongoose.model("Job", jobSchema);
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    // 🆔 Identity
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [2, 'Full name must be at least 2 characters'],
        maxlength: [100, 'Full name cannot exceed 100 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+.\S+$/, 'Please enter a valid email address']
    },

    phone: {
        type: String,
        trim: true,
        match: [/^(\+27|0)[6-8][0-9]{8}$/, 'Please enter a valid South African phone number']
    },

    passwordHash: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },

    // 👤 Profile
    isEmailVerified: {
        type: Boolean,
        default: false
    },

    isPhoneVerified: {
        type: Boolean,
        default: false
    },

    status: {
        type: String,
        enum: ['ACTIVE', 'SUSPENDED', 'DELETED'],
        default: 'ACTIVE'
    },

    lastLoginAt: {
        type: Date
    },

    refreshTokens: [{
        token: String,
        expiresAt: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    // 🛠️ Handyman-specific fields (only when role = HANDYMAN)
    handymanProfile: {
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        },
        skills: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }],
        yearsOfExperience: {
            type: Number,
            min: 0,
            max: 60
        },
        verificationStatus: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING'
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        totalJobsCompleted: {
            type: Number,
            default: 0,
            min: 0
        },
        availability: {
            days: [{
                type: String,
                enum: ['MON', 'TUE', 'WED', 'THUR', 'FRI', 'SAT', 'SUN']
            }],
            timeSlots: [String]                 // e.g., ["08:00-12:00", "13:00-17:00"]
        },
        location: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],                     // [longitude, latitude]
            required: false
        }
    },
    documents: {
        idCopy: String,
        certificate: String,
        insurance: String,
        otherDocs: [String]
    }
}, {
    // 🕒 Metadata
    timestamps: true,                           // Adds createdAt and updatedAt automatically
    toJSON: {
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.passwordHash;
            delete ret.refreshTokens;
            return ret;
        }
    }
});
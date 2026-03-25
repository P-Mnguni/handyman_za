import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
// import { startTransition } from 'react';

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

    role: {
        type: String,
        enum: ['client', 'handyman', 'admin'],
        default: 'client',
        required: true
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
        token: {
            type: String,
            required: false
        },
        deviceInfo: { 
            type: String 
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    maxRefreshTokens: {
        type: Number,
        default: 5
    },

    // 🛠️ Handyman-specific fields (only when role = HANDYMAN)
    handymanProfile: {
        type: {
            skills: [{
                type: String,                   // NOT ObjectID, unless you have a separate Skills model
                enum: ['PLUMBER', 'ELECTRICIAN', 'CARPENTER', 'PAINTER', 'GARDENER', 'OTHER'],
                trim: true
            }],
            experienceYears: {
                type: Number,
                min: 0,
                default: 0
            },
            hourlyRate: {
                type: Number,
                min: 0
            },
            description: String,
            // FIXED: location should only exist when explicitly set
            location: {
                type: {
                    type: String,
                    enum: ['Point'],
                },
                coordinates: {
                    type: [Number],
                    validate: {
                        validator: function(coords) {
                            // Only validate if coordinates exist
                            if (!coords) return true;       // Allow undefined/null
                            return Array.isArray(coords) && 
                            coords.length === 2 && 
                            typeof coords[0] === 'number' && 
                            typeof coords[1] === 'number';
                        },
                        message: 'Coordinates must be an array of two numbers [longitude, latitude]'
                    }
                },
            },
            serviceAreas: [String],
            isVerified: {
                type: Boolean,
                default: false
            },
            rating: {
                type: Number,
                default: 0,
                min: 0,
                max: 5
            },
            reviewCount: {
                type: Number,
                default: 0
            }
        },
        // CRITICAL: This should be undefined, not an empty object
        default: undefined
    },
    documents: {
        idCopy: String,
        certificate: String,
        insurance: String,
        otherDocs: [String]
    },                              // Add this to prevent nested _id
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
},
{ _id: false }
);

// 📊 Indexes for better query performance
//userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'handymanProfile.verificationStatus': 1 });
// Geo-spatial index for location-based queries (handyman location search)
userSchema.index({ 'handymanProfile.location.coordinates': 1});

// 🔧 Virtuals (computed properties)
userSchema.virtual('isActive').get(function() {
    return this.status === 'ACTIVE';
});

userSchema.virtual('isHandyman').get(function() {
    return this.role === 'handyman';
});

userSchema.virtual('isClient').get(function() {
    return this.role === 'client';
});

userSchema.virtual('isAdmin').get(function() {
    return this.role === 'admin';
});

// 🔐 Password hashing middleware
userSchema.pre('save', function() {
    // Only HANDYMEN should have handymanProfile
    if (this.role !== 'HANDYMAN') {
        this.handymanProfile = undefined;
        return;
    }

    // For handymen: ensure location is either valid or removed
    if (this.handymanProfile && this.handymanProfile.location) {
        const loc = this.handymanProfile.location;

        // If location exists but has empty/invalid coordinates, remove it
        if (!loc.coordinates || 
            !Array.isArray(loc.coordinates) || 
            loc.coordinates.length !== 2 || 
            typeof loc.coordinates[0] !== 'number' || 
            typeof loc.coordinates[1] !== 'number') {
                // Remove the location field entirely
                delete this.handymanProfile.location;
        } else if (loc.coordinates.length === 2 && 
            typeof loc.coordinates[0] === 'number' && 
            typeof loc.coordinates[1] === 'number') {
                // Ensure the type is set
                if (!loc.type) {
                    this.handymanProfile.location.type = 'Point';
                }
        }
    }
});

// 🔐 Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// 🔐 Method to add refresh token
userSchema.methods.addRefreshToken = function(token, expiresAt) {
    this.refreshTokens.push({ token, expiresAt });
    return this.save();
};

// 🔐 Method to remove refresh token
userSchema.methods.removeRefreshToken = function(token) {
    this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
    return this.save();
};

// 🔐 Method to remove all refresh tokens (for logout all devices)
userSchema.methods.removeAllRefreshTokens = function() {
    this.refreshTokens = [];
    return this.save();
};

// 🔐 Static method to find by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// 📋 Static method to get customers
userSchema.statics.findCustomers = function(query = {}) {
    return this.find({ ...query, role: 'CUSTOMER' });
};

// 📋 Static method to get handyman
userSchema.statics.findHandymen = function(query = {}) {
    return this.find({ ...query, role: 'HANDYMAN' });
};

// 📋 Static method to get active users
userSchema.statics.findActive = function(query = {}) {
    return this.find({ ...query, status: 'ACTIVE' });
};

// 📋 Static method to get users by verification status (for handymen)
userSchema.statics.findByVerificationStatus = function(status) {
    return this.find({
        role: 'HANDYMAN',
        'handymanProfile.verificationStatus': status,
    });
};

const User = mongoose.model('User', userSchema);

export default User;
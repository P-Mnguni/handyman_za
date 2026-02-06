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
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],                 // [longitude, latitude]
                required: false,
                default: undefined              // Important: don't default to empty array
            }
        },
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
    return this.role === 'HANDYMAN';
});

userSchema.virtual('isCustomer').get(function() {
    return this.role === 'CUSTOMER';
});

userSchema.virtual('isAdmin').get(function() {
    return this.role === 'ADMIN';
});

// 🔐 Password hashing middleware
userSchema.pre('save', async function() {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('passwordHash')) return;

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        
        // Hash the password along with the new salt
        this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    
    } catch (error) {
        throw error;
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
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
})
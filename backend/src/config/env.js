import dotenv from 'dotenv';
import { z } from 'zod';            // for runtime validation

// Load environment variables from .env file
dotenv.config();

// Define schema for validation 
const envSchema = z.object({
    // Core
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().transform(Number).default("5000"),

    // Database
    MONGO_URI: z.string().url(),

    // Authentication
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

    // Payment Gateway
    PAYFAST_MERCHANT_ID: z.string().optional(),
    PAYFAST_MERCHANT_KEY: z.string().optional(),
    PAYFAST_PASSPHRASE: z.string().optional(),
    PAYFAST_ENV: z.enum(["test", "production"]).default("test"),

    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),

    // Email Service (SendGrid/Resend)
    EMAIL_PROVIDER: z.enum(["sendgrid", "resend"]).default("sendgrid"),
    SENDGRID_API_KEY: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    SYSTEM_EMAIL: z.string().email(),

    // SMS Service (Twilio)
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_PHONE_NUMBER: z.string().optional(),

    // Redis for rate limiting/caching
    REDIS_URL: z.string().url().optional(),

    // File Upload (Cloudinary/AWS S3)
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    // Frontend URLs for CORS
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),
    ADMIN_URL: z.string().url().default("http://localhost:3001"),

    // Monitoring & Logging
    SENTRY_DSN: z.string().optional(),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),

    // Platform Settings
    PLATFORM_COMMISSION_PERCENT: z.string().transform(Number).default("15"),
    MAX_RADIUS_KM: z.string().transform(Number).default("50")
});

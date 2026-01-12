import dotenv from 'dotenv';
import { url, z } from 'zod';            // for runtime validation

// Load environment variables from .env file
dotenv.config();

// Define schema for validation 
// Catches missing/invalid env variables Early
// Prevents runtime errors in production
const envSchema = z.object({
    // Core
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().transform(Number).default("5000"),

    // Database
    MONGO_URI: z.string()
                .min(1, 'MONGO_URI is required')
                .refine((uri) => uri.startsWith('mongo://') || uri.startsWith('mongodb+srv://'), {
                    message: "MONGO_URI must start with mongodb:// or mongodb+srv://"
                }),

    // Authentication
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at 32 characters"),
    JWT_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
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
    SYSTEM_EMAIL: z.string()
                    .optional()
                    .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                    .test(email), {
                        message: "SYSTEM_EMAIL must be a valid email address"
                    }),

    // SMS Service (Twilio)
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_PHONE_NUMBER: z.string().optional(),

    // Redis for rate limiting/caching
    REDIS_URL: z.string()
                .optional()
                .refine((url) => !url || url.startsWith('redis://') || url.startsWith('rediss://'), {
                    message: "REDIS_URL must start with redis:// or rediss://"
                }),

    // File Upload (Cloudinary/AWS S3)
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    // Frontend URLs for CORS
    FRONTEND_URL: z.string()
                    .default('http://localhost:3000')
                    .refine((url) => /^https?:\/\/[^\s$.?#].[^\s]*$/
                    .test(url), {
                        message: "FRONTEND_URL must be a valid URL"
                    }),

    ADMIN_URL: z.string()
                .default("http://localhost:3001")
                .refine((url) => /^https?:\/\/[^\s$.?#].[^\s]*$/
                .test(url), {
                    message: "ADMIN_URL must be a valid URL"
                }),

    // Monitoring & Logging
    SENTRY_DSN: z.string().optional(),
    LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),

    // Platform Settings
    PLATFORM_COMMISSION_PERCENT: z.string().transform(Number).default("15"),
    MAX_RADIUS_KM: z.string().transform(Number).default("50")
});

// Parse and validate environment variables
let parsedEnv;
try {
    parsedEnv = envSchema.parse(process.env);
} catch (error) {
    console.error("❌ Invalid environment variables:", error.errors);
    
    if (error.errors) {
        error.errors.forEach(err => {
            console.log(`   - ${err.path.join('.')}: ${err.message}`);

            // Show current value if available
            const currentValue = process.env[err.path[0]];
            if (currentValue) {
                console.log(`       Current: "${currentValue.substring(0, 50)}${currentValue.length > 50 ? '...' : ''}"`);
            }
        });
    }

    console.log("\n💡 Check your .env file for these variables.");

    // In development, we can exit gracefully
    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    } else {
        console.log("⚠️ Using development defaults for missing/invalid variables...");
        // Fall back to process.env with defaults
        parsedEnv = {
            NODE_ENV: 'development',
            PORT: '5000',
            MONGO_URI: process.env.MONGO_URI,
            JWT_SECRET: process.env.JWT_SECRET,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
            // .. other variables from process.env with defaults
        };
    }
}

// Export typed environment variables
export const env = {
    nodeEnv: parsedEnv.NODE_ENV,
    port: parsedEnv.PORT,
    isProduction: parsedEnv.NODE_ENV === "production",
    isDevelopment: parsedEnv.NODE_ENV === "development",

    // Database
    mongoUri: parsedEnv.MONGO_URI,

    // Authentication
    jwtSecret: parsedEnv.JWT_SECRET,
    jwtExpiresIn: parsedEnv.JWT_EXPIRES_IN,
    jwtRefreshSecret: parsedEnv.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: parsedEnv.JWT_REFRESH_EXPIRES_IN,

    // Payment Gateways
    // PayFast (SA-focused), Stripe (International)
    payfast: {
        merchantId: parsedEnv.PAYFAST_MERCHANT_ID,
        merchantKey: parsedEnv.PAYFAST_MERCHANT_KEY,
        passphrase: parsedEnv.PAYFAST_PASSPHRASE,
        environment: parsedEnv.PAYFAST_ENV,
        isEnabled: !!parsedEnv.PAYFAST_MERCHANT_ID
    },

    stripe: {
        secretKey: parsedEnv.STRIPE_SECRET_KEY,
        webhookSecret: parsedEnv.STRIPE_WEBHOOK_SECRET,
        isEnabled: !!parsedEnv.STRIPE_SECRET_KEY
    },

    // Email Service
    email: {
        provider: parsedEnv.EMAIL_PROVIDER,
        sendgridApiKey: parsedEnv.SENDGRID_API_KEY,
        resendApiKey: parsedEnv.RESEND_API_KEY,
        systemEmail: parsedEnv.SYSTEM_EMAIL
    },

    // SMS Service
    sms: {
        twilioAccountSid: parsedEnv.TWILIO_ACCOUNT_SID,
        twilioAuthToken: parsedEnv.TWILIO_AUTH_TOKEN,
        twilioPhoneNumber: parsedEnv.TWILIO_PHONE_NUMBER,
        isEnabled: !!parsedEnv.TWILIO_ACCOUNT_SID
    },

    // Redis
    redisUrl: parsedEnv.REDIS_URL,

    // File Storage
    // For handyman verification documents
    // Matches schema's documents field
    cloudinary: {
        cloudName: parsedEnv.CLOUDINARY_CLOUD_NAME,
        apiKey: parsedEnv.CLOUDINARY_API_KEY,
        apiSecret: parsedEnv.CLOUDINARY_API_SECRET,
        isEnabled: !!parsedEnv.CLOUDINARY_CLOUD_NAME
    },

    // Frontend
    frontendUrl: parsedEnv.FRONTEND_URL,
    adminUrl: parsedEnv.ADMIN_URL,
    corsOrigins: [parsedEnv.FRONTEND_URL, parsedEnv.ADMIN_URL],

    // Monitoring
    sentryDsn: parsedEnv.SENTRY_DSN,
    logLevel: parsedEnv.LOG_LEVEL,

    // Platform Settings
    // Business logic in config
    platformCommissionPercent: parsedEnv.PLATFORM_COMMISSION_PERCENT,       // Revenue model
    maxRadiusKm: parsedEnv.MAX_RADIUS_KM,                                   // Job matching radius

};

console.log(`✅ Environment loaded: ${env.nodeEnv}`);
console.log(`📦 Database: ${env.mongoUri ? env.mongoUri.split('/').pop().split('?')[0] : 'Not set'}`);
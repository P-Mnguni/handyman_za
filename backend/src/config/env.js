import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { z } from 'zod';            // for runtime validation

// Load environment variables from .env file
dotenv.config();

console.log('🔧 Environment configuration loading...');

// Define schema for validation 
// Catches missing/invalid env variables Early
// Prevents runtime errors in production
const envSchema = z.object({
    // Core
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().transform(Number).default("5000"),

    // Database
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),

    // Authentication
    JWT_ACCESS_SECRET: z.string().min(32, "JWT_SECRET is required"),
    JWT_ACCESS_EXPIRES: z.string().default('15m'),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET is required"),
    JWT_REFRESH_EXPIRES: z.string().default('7d'),
    BCRYPT_ROUNDS: z.string().transform(Number).default("12"),

    // Frontend URLs for CORS
    FRONTEND_URL: z.string().default('http://localhost:5173'),
    ADMIN_URL: z.string().default("http://localhost:3001"),
});

// Parse and validate environment variables
const result = envSchema.safeParse(process.env);

let parsedEnv;

if (result.success) {
    parsedEnv = result.data;
    console.log('✅ Environment validation successful!');
} else { 
    console.error('❌ Invalid environment variables:');

    // result.error is guaranteed to be a ZodError with issues
    result.error.issues.forEach((issue, i) => {
        console.error(` ${i + 1}. ${issue.path.join('.')}: ${issue.message}`);

        // Show current value
        const currentValue = process.env[issue.path[0]];
        if (currentValue) {
            const displayValue = issue.path[0].includes('SECRET')
                                    ? '[HIDDEN]'
                                    : currentValue;
            console.log(`     Current value: "${displayValue}"`);
        }
    });

    console.log('\n💡 Please check your env file');

    if (process.env.NODE_ENV === 'production') {
        process.exit(1);
    } else {
        console.log('⚠️ Using development defaults...');

        // Creates minimal defaults
        parsedEnv = {
            NODE_ENV: 'development',
            PORT: 5000,
            MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/handyman_za',
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev-jwt-secret-change-in-production',
            JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
            JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',
            FRONTEND_URL: 'http://localhost:5173',
            ADMIN_URL: 'http://localhost:3001',
            BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS
        };
    }
}

// Export typed environment variables
export const env = {
    // Core
    nodeEnv: parsedEnv.NODE_ENV,
    port: parsedEnv.PORT,
    isProduction: parsedEnv.NODE_ENV === "production",
    isDevelopment: parsedEnv.NODE_ENV === "development",

    // Database
    mongoUri: parsedEnv.MONGO_URI,

    // Authentication
    jwtSecret: parsedEnv.JWT_ACCESS_SECRET,
    jwtExpiresIn: parsedEnv.JWT_ACCESS_EXPIRES,
    jwtRefreshSecret: parsedEnv.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: parsedEnv.JWT_REFRESH_EXPIRES,
    bcryptRounds: parseInt(parsedEnv.BCRYPT_ROUNDS || "12", 10),

    // Frontend
    frontendUrl: parsedEnv.FRONTEND_URL,
    adminUrl: parsedEnv.ADMIN_URL,
    corsOrigins: [parsedEnv.FRONTEND_URL, parsedEnv.ADMIN_URL],

};

console.log(`📦 Environment: ${env.nodeEnv}`);
console.log(`🔐 JWT configured: ${env.jwtSecret ? 'Yes' : 'No'}`);
console.log(`🌍 Frontend URL: ${env.frontendUrl}`);
import dotenv from 'dotenv';
import { z } from 'zod';

console.log('🧪 Debugging environment validation...\n');

// 1. First check what dotenv loads
dotenv.config();

console.log('1. Dotenv loaded variables count:', Object.keys(process.env).length);
console.log('   Sample variables:');
console.log('   - NODE_ENV:', process.env.NODE_ENV);
console.log('   - PORT:', process.env.PORT);
console.log('   - MONGO_URI present:', !!process.env.MONGO_URI);

// 2. Test the schema piece by piece
console.log('\n2. Testing schema piece by piece:');

// Test MONGO_URI validation
const mongoUriSchema = z.string()
                        .min(1, "MONGO_URI is required")
                        .refine((uri) => uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'), {
                            message: "MONGO_URI must start with mongodb:// or mongodb+srv://"
                        });

try {
    const mongoResult = mongoUriSchema.parse(process.env.MONGO_URI);
    console.log('   ✅ MONGO_URI validation passed');
} catch (error) {
    console.log('   ❌ MONGO_URI validation failed:', error.errors?.[0]?.message || error.message);
    console.log('   Current value:', process.env.MONGO_URI);
}

// Test JWT_SECRET validation
const jwtSecretSchema = z.string().min(32, "JWT_SECRET must be at least 32 characters");
try {
    const jwtResult = jwtSecretSchema.parse(process.env.JWT_SECRET);
    console.log('   ✅ JWT_SECRET validation passed (length:', jwtResult.length, ')');
} catch (error) {
    console.log('   ❌ JWT_SECRET validation failed:', error.errors?.[0]?.message || error.message);
    console.log('   Current value length:', process.env.JWT_SECRET?.length || 0);
}

// 3. Try to parse everything
console.log('\n3. Testing full schema parse:');

const testSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('5000'),
    MONGO_URI: z.string()
                .min(1, "MONGO_URI is required")
                .refine((uri) => uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'), {
                    message: "MONGO_URI must start with mongodb:// or mongodb+srv://"
                }),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
});

try {
    const result = testSchema.parse({
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        MONGO_URI: process.env.MONGO_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    });

    console.log('   ✅Full schema validation passed!');
    console.log('   NODE_ENV:', result.NODE_ENV);
    console.log('   PORT:', result.PORT);
    console.log('   MONGO_URI:', result.MONGO_URI.substring(0, 50) + '...');
} catch (error) {
    console.log('   ❌ Full schema validation failed');

    if (error.errors) {
        error.errors.forEach(err => {
            console.log(`       - ${err.path.join('.')}: ${err.message}`);
        });
    } else {
        console.log('       Error:', error.message);
        console.log('       Full error:', error);
    }
}

console.log('\n🔧 Troubleshooting:');
console.log('   - Check .env file exists in:', process.cwd());
console.log('   - Check MONGO_URI format:', process.env.MONGO_URI);
console.log('   - Check JWT_SECRET length:', process.env.JWT_SECRET?.length);
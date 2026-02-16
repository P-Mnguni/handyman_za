import { jwt } from "zod";
import { env } from "../src/config/env.js";

console.log('=== TEST 1: JWT CONFIGURATION ===\n');

// Test 1.1: Check if env is loaded
console.log('1.1 Environment Check:');
console.log(`   env object exists: ${!!env}`);
console.log(`   env.jwtSecret: ${env.jwtSecret ? '✓ Present' : '✕ MISSING'}`);
console.log(`   env.jwtExpiresIn: ${env.jwtExpiresIn || 'not set'}`);
console.log(`   env.jwtRefreshSecret: ${env.jwtRefreshSecret ? '✓ Present' : '✕ MISSING'}`);
console.log(`   env.jwtRefreshExpiresIn: ${env.jwtRefreshExpiresIn|| 'not set'}\n`);

// Test 1.2: Check actual process.env values
console.log('1.2 Raw process.env Check:');
console.log(`   process.env.JWT_SECRET: ${process.env.JWT_SECRET ? '✓ Present' : '✕ MISSING'}`);
console.log(`   process.env.JWT_REFRESH_SECRET: ${process.env.JWT_REFRESH_SECRET ? '✓ Present' : '✕ MISSING'}\n`);

// Test 1.3: try to sign a token with the secret
if (env.jwtSecret) {
    console.log('1.3 JWT Signing Test:');
    try {
        import('jsonwebtoken').then(jwt => {
            const token = jwt.default.sign(
                { test: 'data' },
                env.jwtSecret,
                { expiresIn: '1h' }
            );
            console.log(`   ✓ Successfully signed token`);
            console.log(`   Token preview: ${token.substring(0, 20)}...\n`);

            // Test 1.4: Verify the Token
            try {
                const decoded = jwt.default.verify(token, env.jwtSecret);
                console.log('1.4 JWT Verification Test:');
                console.log(`   ✓ Successfully verified token`);
                console.log(`   Decoded payload:`, decoded);
            } catch (verifyError) {
                console.error(` ✕ Token verification failed:`, verifyError.message);
            }
        });
    } catch (signError) {
        console.error(' ✕ Token signing failed:', signError.message);
    }
} else {
    console.log('1.3 Skipping JWT tests - no secret available');
}

console.log('\n=== TEST 1 COMPLETE ===');
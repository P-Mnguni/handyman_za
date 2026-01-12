import { z } from 'zod';

console.log('🧪 Testing Zod validators...\n');

// Test validators
const testScheme = z.object({
    EMAIL: z.string()
            .optional()
            .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^s@]+$/
        .test(email), {
            message: "Must be a valid email"
        }),
    
    URL: z.string()
            .refine((url) => /^https?:\/\/[^\s$.?#].[^\s]*$/
            .test(url), {
                message: "Must be a valid URL"
            }),
});

const tests = [
    { EMAIL: 'test@example.com', URL: 'http://localhost:3000' },
    { EMAIL: 'invalid-email', URL: 'http://localhost:3000' },
    { EMAIL: 'test@example.com', URL: 'not-a-url' },
];

tests.forEach((test, i) => {
    try {
        testScheme.parse(test);
        console.log(`✅ Test ${i+1}: PASS`);
    } catch (error) {
        const errorMsg = error.errors?[0]?.message || error.message : 'Unknown error';
        console.log(`❌ Test ${i+1}: FAIL - ${errorMsg}`);
    }
});
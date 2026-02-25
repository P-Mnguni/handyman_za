import Joi from 'joi';
import { registerSchema } from '../src/modules/auth/auth.validation.js';

// Test data that should work
const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'Test123!',
    phoneNumber: '0723334567',
    role: 'client'
};

console.log("🔍 Testing Registration Validation");
console.log("==================================");

// Function to test validation
const testValidation = (data, testName) => {
    console.log(`\n📋 Test: ${testName}`);

    // Validate using Joi schema
    const { error, value } = registerSchema.validate(data, { abortEarly: false });

    if (error) {
        console.log('❌ FAILED:');
        error.details.forEach((err, index) => {
            console.log(`   ${index + 1}. ${err.message} (at ${err.path.join('.')})`);
        });
    } else {
        console.log('✅ PASSED');
        console.log(`   Cleaned data:`, value);
    }
    console.log("---------------------------------");
};

// Run Tests
//testValidation(testUser, "Complete valid user");

// Test missing fields
//testValidation({ ...testUser, email: undefined }, "Missing email");
//testValidation({ ...testUser, password: undefined }, "Missing password");
//testValidation({ ...testUser, firstName: undefined }, "Missing first name");
//testValidation({ ...testUser, lastName: undefined }, "Missing last name");
//testValidation({ ...testUser, role: undefined }, "Missing role");
//testValidation({ ...testUser, phoneNumber: undefined }, "Missing phone number");

// Test invalid formats
//testValidation({ ...testUser, email: "not-an-email" }, "Invalid email");
//testValidation({ ...testUser, password: "nouppercaseornumbers" }, "Password no uppercase/numbers");
//testValidation({ ...testUser, role: "superadmin" }, "Invalid role");
//testValidation({ ...testUser, phoneNumber: "abc" }, "Invalid phone number");

console.log("\n📝 Register Schema Rules:");
console.log(registerSchema.describe());
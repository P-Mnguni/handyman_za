import mongoose from 'mongoose';
import authService from '../src/modules/auth/auth.service.js';
import { env } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';

// Simulate exactly what your controller sends
const testData = {
    fullName: "Test User",
    //lastName: "User",
    email: "test1@example.com",
    password: "Test123!",
    role: "client",
    phone: "1234567890"
};

console.log("🔍 DEBUG: Registration Flow Test");
console.log("=================================");

const runTests = async () => {
    try {
        // Step 1: Connect to database first
        console.log('📡 Connecting to database...');
        await connectDB();
        console.log('✅ Database connected');

        // Step 2: Show what data is going in
        console.log('\n📤 Calling registerUSer...');
        const result = await authService.register(testData);
        console.log('✅ SUCCESS! User registered:');
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.log('\n❌ ERROR CAUGHT:');
        console.log('   Name:', error.name);
        console.log('   Message:', error.message);
        console.log('   Stack:', error.stack);

        // Check for bcrypt error
        if (error.message && error.message.includes('Invalid salt')) {
            console.log('\n🔴 BCRYPT ERROR DETECTED');
            console.log("   This means password isn't reaching bcrypt correctly");
        }
    } finally {
        // Step 4: Close database connection
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
    }
};

// Run the test
runTests();
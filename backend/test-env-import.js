console.log('🧪 Testing env.js import chain...\n');

// Test 1: Check if we can import dotenv and zod
try {
    const dotenv = await import('dotenv');
    console.log('✅ dotenv import successful');

    const zod = await import('zod');
    console.log('✅ zod import successful');

    // Load environment
    dotenv.config();
    console.log('✅ dotenv.config() executed');

    // Test a simple schema
    const testSchema = zod.z.object({
        TEST: zod.z.string(),
    });

    const result = testSchema.parse({ 
        TEST: 'hello' 
    });
    console.log('✅ Zod schema parsing works:', result);

} catch (error) {
    console.log('❌ Import test failed:', error.message);
    console.log('Stack:', error.stack);
}

// Test 2: Try to import actual env.js
console.log('\n🔍 Testing actual env.js imports...');
try {
    const { env } = await import('./src/config/env.js');
    console.log('✅ env.js import SUCCESSFUL!');
    console.log('   NODE_ENV:', env.nodeEnv);
    console.log('   MONGO_URI presents:', !!env.mongoUri);
    console.log('   JWT_SECRET present:', !!env.jwtSecret);
    console.log('\n🎉 Environment is fully loaded!');

} catch (error) {
    console.log('❌ env.js import FAILED:');
    console.log('   Error:', error.message);

    // Check if it's a Zod error
    if (error.errors) {
        console.log('   Zod errors:', error.errors);
    }

    console.log('   Stack trace:');
    console.log(error.stack);

    // Check if its a path issue
    console.log('\n🔧 Checking file paths:');
    const fs = await import('fs');
    const path = await import('path');

    const envJsPath = path.join(process.cwd(), 'src', 'config', 'env.js');
    console.log('   Expected env.js path:', envJsPath);
    console.log('   File exists:', fs.existsSync(envJsPath))
}
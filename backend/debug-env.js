import dotenv from 'dotenv';

console.log('🧪 Debugging environment variables...\n');

// Manually load .env
dotenv.config();

console.log('1. Raw process.env values:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   PORT:', process.env.PORT);
console.log('   MONGO_URI:', process.env.MONGO_URI ? 'Set (hidden)' : 'Missing');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'Set (hidden)' : 'Missing');
console.log('   JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET ? 'Set (hidden)' : 'Missing');

console.log('\n2. Testing dotenv load:');
console.log('   .env file exists?', process.env.NODE_ENV ? '✅' : '❌');

console.log('\n3. Current working directory:');
console.log('   ', process.cwd());

console.log('\n4. Trying to import env.js...');

try {
    const { env } = await import('./src/config/env.js');
    console.log('✅ env.js imported successfully');
    console.log('   env.mongoUri:', env.mongoUri ? 'Set (hidden)' : 'Missing');
} catch (error) {
    console.log('❌ Error importing env.js:', error.missing);
    console.log('   Stack:', error.stack);
}
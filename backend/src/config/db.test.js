// Simple test file to verify database connection
import { connectDB, disconnectDB, isConnected, getDBStats } from './db.js';
import { env } from './env.js';

async function testDatabaseConnection() {
    console.log('🧪 Testing Database Connection...');
    console.log(`Environment: ${env.nodeEnv}`);
    console.log(`Database: ${env.mongoUri.split('/').pop().split('?')[0]}`);

    try {
        // Test connection
        await connectDB();

        // Check connection status
        if (isConnected()) {
            console.log('✅ Database connection test PASSED');

            // Show stats
            const stats = getDBStats();
            console.log('\n📊 Database Stats:');
            console.log(`   Host: ${stats.host}`);
            console.log(`   Database: ${stats.database}`);
            console.log(`   Collections: ${stats.collectionsCount}`);

            if (stats.collections.length > 0) {
                console.log('   Collection List:');
                stats.collections.forEach(col => console.log(`      - ${col}`));
            }
        } else {
            console.log('❌ Database connection test FAILED');
        }

        // Clean up
        await disconnectDB();

    } catch (error) {
        console.error('❌ Database test failed with error:'. error.message);
        process.exit(1);
    }
}


import { createApp } from './src/app.js';
import { connectDB } from './src/config/db.js';
import { env } from './src/config/env.js';

/**
 * Application startup sequence
 */
async function bootstrap() {
    console.log(`
        ||==============================================================================||
        ||                                                                              ||
        ||                          Handyman.za API                                     ||
        ||                         Starting Server ...                                  ||
        ||                                                                              ||
        ||==============================================================================||
    `);

    // =======================
    // 1. Display Startup Info
    // =======================
    console.log('📋 Startup Configuration');
    console.log(`   Environment: ${env.nodeEnv}`);
    console.log(`   Port: ${env.port}`);
    console.log(`   Database: ${env.mongoUri.split('/').pop().split('?')[0]}`);
    console.log(`   Frontend: ${env.frontendUrl}`);
    console.log(`   Admin: ${env.adminUrl}`);

    if (env.isDevelopment && env.isUsingDevDefaults) {
        console.log(`   ⚠️ Using development JWT secrets`);
    }

    // ======================
    // 2. Connect to Database
    // ======================
    console.log('\n🔌 Step 1: Connecting to database...');
    try {
        await connectDB();
        console.log('   ✅ Database connection established');
    } catch (error) {
        console.error(' ❌ Database connection failed:', error.message);
        console.error('\nTroubleshooting:');
        console.error(' 1. Check if MongoDB is running');
        console.error(' 2. Verify MONGO_URI in .env file');
        console.error(' 3. Check firewall settings for port 27017');
        process.exit(1);
    }

    // =====================
    // 3. Create Express App
    // =====================
    console.log('⚙️ Step 2: Configuring Express application...');
    let app;
    try {
        app = createApp();
        console.log('   ✅ Express app configured');
    } catch (error) {
        console.error(' ❌ Express configuration failed:', error.message);
        process.exit(1);
    }

    // ====================
    // 4. Start HTTP Server
    // ====================
    console.log('🚀 Step 3: Starting HTTP server...');
    const server = app.listen(env.port, () => {
        console.log(`
            ||==============================================================================||
            ||                                                                              ||
            ||                                                                              ||
            ||                       Server Started Successfully!                           ||
            ||                                                                              ||
            ||                                                                              ||
            ||==============================================================================||
        `);

        console.log('🌐 Server Information:');
        console.log(`   URL: http://localhost:${env.port}`);
        console.log(`   API Base: http://localhost:${env.port}/api/v1`);
        console.log(`   Health: http://localhost:${env.port}/api/v1/health`);

        if (env.isDevelopment) {
            console.log('\n🔧 Development Tools:');
            console.log(`   Frontend: ${env.frontendUrl}`);
            console.log(`   Admin: ${env.adminUrl}`);
        }

        console.log('\n📡 Ready to handle requests!');
    });
}
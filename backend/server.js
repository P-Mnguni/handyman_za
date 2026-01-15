import { createApp } from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
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

    // ====================
    // 5. Graceful Shutdown
    // ====================
    const shutdown = async (signal) => {
        console.log(`\n${signal} received. Initiating graceful shutdown...`);

        // Stop accepting new connections
        server.close(async () => {
            console.log('   ✅ HTTP server closed');

            // Close database connection
            try {
                await disconnectDB();
                console.log('   ✅ Database connection closed');
            } catch (dbError) {
                console.error(' ❌ Error closing database:', dbError.message);
            }

            console.log('\n👋 Shutdown complete. Goodbye!');
            process.exit(0);
        });

        // Force shutdown after 10 seconds
        setTimeout(() => {
            console.error('\n⏰ Force shutdown after timeout');
            process.exit(1);
        }, 10000);
    };

    // Handle termination signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
        console.error('🚨 Uncaught Exception:', error);
        shutdown('UNCAUGHT_EXCEPTION');
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('🚨 Unhandled Rejection at:', promise);
        console.error('Reason', reason);
        shutdown('UNHANDLED_REJECTION');
    });

    // =======================
    // 6. Development Features
    // =======================
    if (env.isDevelopment) {
        // Display memory usage periodically
        setInterval(() => {
            const memoryUsage = process.memoryUsage();
            const mbUsed = Math.round(memoryUsage.heapUsed / 1024 / 1024);
            const mbTotal = Math.round(memoryUsage.heapTotal / 1024 / 1024);
            console.log(`🧠 Memory: ${mbUsed}MB / ${mbTotal}MB`);
        }, 60000);              // Every minute
    }
}

// =====================
// Start the application
// =====================
bootstrap().catch((error) => {
    console.error('💥 Failed to bootstrap application:', error);
    process.exit(1);
});
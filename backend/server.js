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

}
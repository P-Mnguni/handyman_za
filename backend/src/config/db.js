import mongoose from 'mongoose';
import { env } from './env.js';
import { promise } from 'zod';

/**
 * Global is used to maintain a cached connection across hot reloads in development.
 * Prevents connections growing exponentially during API Route usage
 */
const globalWithMongo = global;
let cached = globalWithMongo.mongoose;

if (!cached) {
    cached = globalWithMongo.mongoose = { 
        conn: null,
        promise: null
    };
}

/**
 * Connect to MongoDB using Mongoose
 * @returns {Promise<mongoose.Connection>} MongoDB connection
 */
export async function connectDB() {
    // If we have a cached connection, return it
    if (cached.conn) {
        console.log('📚 Using cached MongoDB connection');
        return cached.conn;
    }

    // If no cached promise, create a new connection
    if (!cached.promise) {
        const options = {
            bufferCommands: false,                  // Disable mongoose buffering
            maxPoolSize: 10,                        // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000,         // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000,                 // Close sockets after 45 seconds of inactivity
            family: 4,                              // Use IPv4, skip trying IPv6
        };

        // Log connection attempt (without exposing full URI)
        const uri = env.mongoUri;
        const dbName = uri.split('/').pop().split('7')[0];
        console.log(`🔌 Attempting MongoDB connection to database: ${dbName}`);

        cached.promise = mongoose.connect(uri, options).then((mongooseInstance) => {
            console.log(`✅ MongoDB connected successfully to: ${dbName}`);
            return mongooseInstance;
        });
    }

    try {
        // Wait for the connection promise resolve
        cached.conn = await cached.promise;
    } catch (error) {
        // Reset the cached promise on error so we can retry
        cached.promise = null;

        console.error('❌ MongoDB connection failed:', error.message);
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Check if MongoDB is running: mongod --version');
        console.log('2. Verify connection URI in .env file');
        console.log('3. Check firewall settings for port 27017');
        console.log('4. Ensure MongoDB service is started');

        // Exit process with failure code in production
        if (env.nodeEnv === 'production') {
            process.exit(1);
        }

        throw error;
    }

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown handling
    process.on('SIGHT', async () => {
        await mongoose.connection.close();
        console.log('👋 MongoDB connection closed through app termination');
        process.exit(0);
    });

    return cached.conn;
}

/** Disconnect from MongoDB
 * Useful for testing and graceful shutdown
 */
export async function disconnectDB() {
    try {
        if (cached.conn) {
            await mongoose.disconnect();
            cached.conn = null;
            cached.promise = null;
            console.log('✅ MongoDB disconnected successfully');
        }
    } catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error.message);
        throw error;        
    }
}

/**
 * Check if MongoDB is connected
 * @returns {boolean} Connection status
 */
export function isConnected() {
    return mongoose.connection.readyState === 1;
}

/**
 * Get MongoDB connection stats
 * @returns {Object} Connection statistics
 */
export function getDBStats() {
    if (!isConnected) {
        return { connected: false };
    }

    const { host, port, name } = mongoose.connection;
    const collections = mongoose.connection.collections
                                ? Object.keys(mongoose.connection.collections)
                                : [];
    return {
        connected: true,
        host: `${host}:${port}`,
        database: name,
        collectionsCount: collections.length,
        collections,
        readyState: mongoose.connection.readyState,
    };
}
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../src/config/env.js';
import User from '../src/modules/users/user.model.js';
import { Job } from '../src/modules/jobs/job.model.js';
import { generateAccessToken } from '../src/utils/token.utils.js';
import { email } from 'zod';
import { ServiceCategory } from '../src/modules/jobs/job.constants.js';

/**
 * Connect to test database before running tests
 */
export const setupTest = async () => {
    try {
        // Use a separate test database to avoid polluting dev data
        const testMongoUri = process.env.TEST_MONGO_URI 
                            || env.mongoUri.replace(/\/[^/]+$/, '/handyman_test') 
                            || 'mongodb://localhost:27017/handyman_test';
        
        console.log(`📡 Connecting to test database: ${testMongoUri}`);

        await mongoose.connect(testMongoUri);

        // Clear all collections before tests to ensure clean state
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }

        console.log('✅ Test database connected and cleared');
        return mongoose.connection;
    } catch (error) {
        console.error('❌ Test database connection failed:', error);
        throw error;
    }
};

/**
 * Disconnect from test database after tests
 */
export const teardownTest = async () => {
    try {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        console.log("🔌 Test database disconnected");
    } catch (error) {
        console.error('❌ Error disconnecting test database:', error.message);
        throw error;
    }
};

/**
 * Clear specific collections between tests
 */
export const clearCollections = async (collectionNames = []) => {
    const collections = mongoose.connection.collections;

    if (collectionNames.length === 0) {
        // Clear all collections
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
        console.log('🧹 All collections cleared');
    } else {
        // Clear specific collections
        for (const name of collectionNames) {
            if (collections[name]) {
                await collections[name].deleteMany({});
                console.log(`🧹 Collection '${name}' cleared`);
            }
        }
    }
};

/**
 * Create a test user helper
 */
export const createTestUser = async (userData = {}) => {
   // const { User } = await import("../src/modules/users/user.model.js");
    //const bcrypt = await import("bcrypt");

    const defaultUser = {
        email: "test@example.com",
        password: "Test123!",
        firstName: "Test",
        lastName: "User",
        role: "client",
        phone: "0712345678"
    };

    const userToCreate = { ...defaultUser, ...userData };

    // Hash password
    const hashedPassword = await bcrypt.hash(userToCreate.password, 12);

    const user = await User.create({
        email: userToCreate.email,
        firstName: userToCreate.firstName,
        lastName: userToCreate.lastName,
        passwordHash: hashedPassword,
        role: userToCreate.role,
        phone: userToCreate.phone,
        refreshToken: []
    });

    return user;
};

/**
 * Create a test job helper
 */
export const createTestJob = async (clientId, jobData = {}) => {
   // const { Job } = await import('../src/modules/jobs/job.model.js');

    const defaultJob = {
        title: "Test Job",
        description: "This is a test job description that is long enough to pass validation.",
        ServiceCategory: "plumbing",
        location: {
            address: "123 Test Street",
            city: "Cape Town",
            province: "Western Cape"
        },
        budget: 500,
        isNegotiable: true
    };

    const jobToCreate = { ...defaultJob, ...jobData, client: clientId };

    const job = await Job.create(jobToCreate);
    return job;
};

/**
 * Get auth token for user
 */
export const getAuthToken = async (user) => {
    //const { generateAccessToken } = await import("../src/utils/token.utils.js");
    return generateAccessToken(user);
};

export default {
    setupTest,
    teardownTest,
    clearCollections,
    createTestUser,
    createTestJob,
    getAuthToken
};
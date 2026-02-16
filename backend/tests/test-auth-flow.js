// test-auth-flow.js
import express from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { env } from '../src/config/env.js';
import User from '../src/modules/users/user.model.js';
import authRouter from '../src/modules/auth/auth.routes.js';
import { custom, email } from 'zod';
import { hash } from 'bcrypt';

async function testAuthFlow() {
    try {
        console.log('🚀 Starting Auth Flow Tests...\n');

        // Import your Express app
        const app = express();
        app.use(express.json());
        app.use('/auth', authRouter);

        // Connect to MongoDB
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(env.mongoUri);
        console.log('✅ Connected to MongoDB\n')

        // Clear any existing test users
        await User.deleteMany({
            email: { $in: [
                /test-handyman/, 
                /test-customer/,
                /test-login/
            ]}
        });
        console.log('🧹 Cleared previous test users\n');

        // =======================================================
        // 1. TEST CUSTOMER REGISTRATION
        //========================================================

        console.log('\n=== TEST 1: CUSTOMER REGISTRATION ===\n');
        const customerData = {
            fullName: 'Test Customer',
            email: 'test-customer@example.com',
            password: 'CustomerPass123',
            phone: '0712345678'
        };

        const customerRes = await request(app)
                                .post('/auth/register/client')
                                .send(customerData);

        if (customerRes.status === 201 || customerRes.status === 200) {
            console.log(`✅ Customer registered successfully (${customerRes.status})`);
            console.log(`   Email: ${customerRes.body.user?.email}`);
            console.log(`   Role: ${customerRes.body.user?.role}`);
            console.log(`   handymanProfile:`, customerRes.body.user?.handymanProfile);
            console.log(`   Token: ${customerRes.body.token ? '✓' : '✕'}`);
        } else {
            console.log(`❌ Customer registration failed (${customerRes.status})`);
            console.log(`   Error: ${customerRes.body.message || customerRes.text}`);
        }

        // ======================================================
        // 2. REGISTER HANDYMAN
        // ======================================================

        console.log('\n=== TEST 2: HANDYMAN REGISTRATION ===');
        const handymanData = {
            fullName: 'Test Handyman',
            email: 'test-handyman@example.com',
            password: 'HandymanPass123!',
            phone: '0729999999',
            role: 'HANDYMAN',
            handymanProfile: {
                skills: ['PLUMBER', 'ELECTRICIAN'],
                experienceYears: 5,
                hourlyRate: 50,
                location: {
                    type: 'Point',
                    coordinates: [28.0473, -26.2041]
                }
            }
        };

        const handymanRes = await request(app)
                                .post('/auth/register/handyman')
                                .send(handymanData)

        let handymanToken;
        if (handymanRes.status === 201 || handymanRes.status === 200) {
            handymanToken = handymanRes.body.token;
            console.log(`✅ Handyman registered successfully (${handymanRes.status})`);
            console.log(`   Email: ${handymanRes.body.user?.email}`);
            console.log(`   Role: ${handymanRes.body.user?.role}`);
            console.log(`   Skills: ${handymanRes.body.user?.handymanProfile?.skills?.join(', ')}`);
            console.log(`   Location: ${handymanRes.body.user?.handymanProfile?.location ? '✓' : '✕'}`);
            console.log(`   Token: ${handymanToken ? '✓' : '✕'}`);
        } else {
            console.log(`❌ Handyman registration failed (${handymanRes.status})`);
            console.log(`   Error: ${handymanRes.body.message || handymanRes.text}`);
            if (handymanRes.body.errors) {
                handymanRes.body.errors.forEach(err => console.log(`    - ${err}`));
            }
        }

        // ============================================================
        // 3. TEST GET CURRENT USER (WITH HANDYMAN TOKEN)
        // ============================================================

        console.log('\n=== TEST 3: GET CURRENT USER (Handyman) ===');
        if (handymanToken) {
            const meRes = await request(app)
                                .get('/auth/me')
                                .set('Authorization', `Bearer ${handymanToken}`);

            if (meRes.status === 200) {
                console.log(`✅ Got current user(${meRes.status})`);
                console.log(`   User: ${meRes.body.fullName} (${meRes.body.email})`);
                console.log(`   Role: ${meRes.body.role}`);
                if (meRes.body.handymanProfile) {
                    console.log(`   Skills: ${meRes.body.handymanProfile.skills?.join(', ')}`);
                    console.log(`   Rate: R${meRes.body.handymanProfile.hourlyRate}/hour`);
                }
            } else {
                console.log(`❌ Get current user failed (${meRes.status})`);
                console.log(`   Error: ${meRes.body.message || meRes.text}`);
            }
        } else {
            console.log('⚠️ Skipping get current user - no token available');
        }

        // ===========================================================
        // 4. LOGIN
        // ===========================================================

        console.log('\n=== TEST 4: LOGIN ===');
        const loginData = {
            email: 'test-handyman@example.com',
            password: 'HandymanPass123!'
        };

        const loginRes = await request(app)
                            .post('/auth/login')
                            .send(loginData);

        if (loginRes.status === 200) {
            console.log(`✅ Login successful (${loginRes.status})`);
            console.log(`   Token: ${loginRes.body.token ? '✓' : '✕'}`);
            console.log(`   User: ${loginRes.body.user?.fullName}`);
        } else {
            console.log(`❌ Login failed (${loginRes.status})`);
            console.log(`   Error: ${loginRes.body.message || loginRes.text}`);
        }

        // ==========================================================
        // 5. UNAUTHORIZED ACCESS
        // ==========================================================

        console.log('\n=== TEST 5: UNAUTHORIZED ACCESS ===');
        const unauthRes = await request(app)
                                .get('/auth/me');

        if (unauthRes.status === 401) {
            console.log(`✅ Unauthorized access correctly blocked (${unauthRes.status})`);
            console.log(`   Message: ${unauthRes.body.message}`);
        } else {
            console.log(`⚠️ Unexpected response(${unauthRes.status})`);
        }

        // ==========================================================
        // 6. DIRECT DATABASE VERIFICATION
        // ==========================================================
        
        console.log('\n=== TEST 6: DATABASE VERIFICATION ===');
        const handymanInDB = await User.findOne({ email: 'test-handyman@example.com' });
        if (handymanInDB) {
            console.log('✅ Handyman found in database');
            console.log(`   Role: ${handymanInDB.role}`);
            console.log(`   handymanProfile exists: ${!!handymanInDB.handymanProfile}`);
            console.log(`   Skills: ${handymanInDB.handymanProfile?.skills?.join(', ') || 'none'}`);
            console.log(`   Location: ${handymanInDB.handymanProfile?.location ? 
                                        JSON.stringify(handymanInDB.handymanProfile.location) : 'none'}`);
        } else {
            console.log('❌ Handyman NOT found in database');
        }

        const customerInDb = await User.findOne({ email: 'test-customer@example.com' });
        if (customerInDb) {
            console.log('\n✅ Customer found in database');
            console.log(`   Role: ${customerInDb.role}`);
            console.log(`   handymanProfile:`, customerInDb.handymanProfile);
        }

        // ============================================================
        // SUMMARY
        // ============================================================

        console.log('\n=== SUMMARY ===');
        console.log(`✅ Customer Registration: ${customerRes.status === 200 || customerRes.status === 201 ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Handyman Registration: ${handymanRes.status === 200 || handymanRes.status === 201 ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Get Current User: ${handymanToken && meRes?.status === 200 ? 'PASS' : 'SKIPPED/FAIL'}`);
        console.log(`✅ Login: ${loginRes.status === 200 ? 'PASS' : 'FAIL'}`);
        console.log(`✅ Unauthorized: ${unauthRes.status === 401 ? 'PASS' : 'FAIL'}`);

    } catch (error) {
        console.error('❌ Test execution failed:', error.message);
        console.error(error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the test
testAuthFlow();
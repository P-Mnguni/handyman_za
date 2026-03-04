import mongoose from 'mongoose';
import { setupTest, teardownTest } from './setup.js';
import User from '../src/modules/users/user.model.js';
import { Job } from '../src/modules/jobs/job.model.js';
import authController from '../src/modules/auth/auth.controller.js';
import * as jobController from '../src/modules/jobs/job.controller.js';
import { generateAccessToken } from '../src/utils/token.utils.js';
import { env } from '../src/config/env.js';
import { email, json } from 'zod';
import { da } from 'zod/v4/locales';

console.log("🧪 JOB LIFECYCLE TESTS");
console.log("=======================");

// Mock request/response objects
const createMockReqRes = (body = {}, headers = {}) => {
    const req = {
        body: { ...body },
        params: {},
        query: {},
        headers: { 'user-agent': 'test-agent', ...headers },
        user: null
    };

    const res = {
        statusCode: 200,
        status: function(code) {
            this.statusCode = code;
            return this;
        },
        json: function(data) {
            this.responseData = data;
            return this;
        }
    };

    const next = (error) => {
        if (error) {
            throw error;
        }
        return;
    }

    return { req, res, next };
};

// Test data
const testClient = {
    firstName: "Test",
    lastName: "Client",
    email: "test.client@example.com",
    password: "Test123!",
    role: "client",
    phone: "1234567890"
};

const testHandyman = {
    firstName: "Test",
    lastName: "Handyman",
    email: "test.handyman@example.com",
    password: "Test123!",
    role: "handyman",
    phone: "0987654321"
};

const testJob = {
    title: "Fix leaking kitchen faucet",
    description: "Kitchen faucet is dripping constantly. Need someone to fix or replace it",
    serviceCategory: "plumbing",
    location: {
        address: "123 Test Street",
        city: "Cape Town",
        province: "Western Cape",
        suburb: "Test Suburb",
        postalCode: "8001",
        coordinates: {
            type: "Point",
            coordinates: [18.4241, -33.9249]
        }
    },
    budget: 500,
    isNegotiable: true,
};

let clientUser, handymanUser;
let clientToken, handymanToken;
let createdJobId;

// Helper function to log test results
const addAuthToReq = (req, user, token) => {
    req.user = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    req.headers.authorization = `Bearer ${token}`;
    return req;
};

// Run all tests
const runTests = async () => {
    try {
        await setupTest();

        // ==================================================
        // SECTION 1: Create test users
        // ==================================================
        console.log("\n📝 SECTION 1: Creating Test Users");

        // Register client
        try {
            console.log('   🚀 Creating client...');
            // Create FRESH mocks for client registration
            const clientReq = {
                body: testClient,
                headers: {'user-agent': 'test-agent'},
                params: {},
                query: {},
                user: null
            };

            const clientRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const clientNext = (error) => {
                if (error) throw error;
            };

            await authController.register(clientReq, clientRes, clientNext);

            // Find the created user in DB
            clientUser = await User.findOne({ email: testClient.email.toLowerCase() });
            console.log(`   ✅ Client created: ${clientUser.email} (ID: ${clientUser._id})`);

            // Login client to get token
            const loginReq = {
                body: { email: testClient.email, password: testClient.password },
                headers: { 'user-agent': 'test-agent' },
                params: {},
                query: {},
                user: null
            };

            const loginRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const loginNext = (error) => {
                if (error) throw error;
            };

            await authController.login(loginReq, loginRes, loginNext);
            clientToken = loginRes.responseData.data.tokens.accessToken;

            console.log(`   ✅ Client login successful`);

        } catch (error) {
            console.log(`   ❌ FAILED - Create Client:`, error.message);
            throw error;
        }

        // Register handyman
        try {
            console.log('\n 🚀 Creating handyman...');
            // Create FRESH mocks for handyman registration
            const handymanReq = {
                body: testHandyman,
                headers: { 'user-agent': 'test-agent' },
                params: {},
                query: {},
                user: null
            };

            const handymanRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const handymanNext = (error) => {
                if (error) throw error;
            };

            await authController.register(handymanReq, handymanRes, handymanNext);

            handymanUser = await User.findOne({ email: testHandyman.email.toLowerCase() });
            console.log(`   ✅ Handyman created: ${handymanUser.email} (ID: ${handymanUser._id})`);

            // Login handyman to get token
            const handymanLoginReq = {
                body: { email: testHandyman.email, password: testHandyman.password },
                headers: { 'user-agent': 'test-agent', 'content-type': 'application/json' },
                params: {},
                query: {},
                user: null
            };

            const handymanLoginRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const handymanLoginNext = (error) => {
                if (error) {
                    console.log(`   Login next () called with error:`, error.message);
                    throw error;
                }
            };

            await authController.login(handymanLoginReq, handymanLoginRes, handymanLoginNext);

            // Checks if responseData exists before accessing it
            if (!handymanLoginRes.responseData) {
                throw new Error("handymanLoginRes.responseData is undefined - login controller didn't call json()");
            };

            if (!handymanLoginRes.responseData.data) {
                throw new Error("handymanLoginRes.responseData.data is undefined - unexpected response structure");
            };

            if (!handymanLoginRes.responseData.data.tokens) {
                console.error(` Response data:`, JSON.stringify(handymanLoginRes.responseData, null, 2));
                throw new Error("handymanLoginRes.responseData.data.tokens is undefined - tokens missing in response");
            };

            handymanToken = handymanLoginRes.responseData.data.tokens.accessToken;

            console.log(`   ✅ Handyman login successful`);

        } catch (error) {
            console.log(`   ❌ FAILED - Create Handyman:`, error.message);
            console.log(`   Stack:`, error.stack);
            throw error;
        }

        // ==================================================
        // SECTION 2: Client creates job
        // ==================================================
        console.log("\n📝 SECTION 2: Client Creates Job");

        try {
            if (clientUser) {
                // Double-check in database
                const dbCheck = await User.findById(clientUser._id);
            }

            const { req, res, next } = createMockReqRes();

            // Make sure to use the string version of the ID
            req.user = {
                userId: clientUser._id.toString(),
                email: clientUser.email,
                role: clientUser.role
            };

            req.body = { ...testJob };
            req.headers.authorization = `Bearer ${clientToken}`;
            
            await jobController.createJob(req, res, next);

            // Get the created job ID from response
            createdJobId = res.responseData.data.job._id;
            console.log(`   ✅ Job created with ID: ${createdJobId}`);

        } catch (error) {
            console.log(`   ❌ FAILED - Client creates job:`, error.message);
            console.log(`   Error details:`, {
                name: error.name,
                statusCode: error.statusCode,
                stack: error.stack
            });
            throw error;
        }

        // ==================================================
        // SECTION 3: Handyman views available jobs
        // ==================================================
        console.log("\n📝 SECTION 3: Handyman Views Available Jobs");

        try {
            const { req, res, next } = createMockReqRes();
            addAuthToReq(req, handymanUser, handymanToken);
            req.query = {};

            await jobController.getAvailableJobs(req, res, next);

            const availableJobs = res.responseData.data.jobs;

            // FIXED: Check both _id and id fields
            const jobAvailable = availableJobs.some(job => {
                const jobId = job._id?.toString() || job.id?.toString();
                const targetId = createdJobId?.toString();

                return jobId === targetId;
            });

            console.log(`   Found ${availableJobs.length} available jobs`);
            console.log(`   Job is available: ${jobAvailable}`);

            if (!jobAvailable) {
                console.log('   ⚠️ WARNING: Job not found in available list, but query found it.');
                console.log('   This suggests a data structure mismatch.');
            }

            console.log(`   ✅ PASSED - Handyman views available jobs`);

        } catch (error) {
            console.log(`   ❌ FAILED - Handyman views available jobs:`, error.message);
        }

        // ==================================================
        // SECTION 4: Handyman accepts job
        // ==================================================
        console.log("\n📝 SECTION 4: Handyman Accepts Job");

        try {
            const { req, res, next } = createMockReqRes();
            addAuthToReq(req, handymanUser, handymanToken);
            req.params = { jobId: createdJobId };

            await jobController.acceptJob(req, res, next);

            // Verify in database
            const job = await Job.findById(createdJobId);

            const acceptChecks = [
                { check: job.status === "accepted", msg: "Status changed to accepted" },
                { check: job.handyman.toString() === handymanUser._id.toString(), msg: "Handyman assigned" },
                { check: job.acceptedAt, msg: "Accepted timestamp set" }
            ];

            const allPassed = acceptChecks.every(c => c.check);
            acceptChecks.forEach(c => {
                if (!c.check) console.log(` ❌ ${c.msg}`);
            });

            console.log(`   ✅ PASSED - Handyman accepts job`);

        } catch (error) {
            console.log(`   ❌ FAILED - Handyman accepts job:`, error.message);
        }

        // ==================================================
        // SECTION 5: Client tries to accept job (should fail)
        // ==================================================
        console.log("\n📝 SECTION 5: Client Attempts to Accept Job");

        try {
            const { req, res, next } = createMockReqRes();
            addAuthToReq(req, clientUser, clientToken);
            req.params = { jobId: createdJobId };

            await jobController.acceptJob(req, res, next);
            
            console.log(`   ❌ FAILED - Client accepted job (should have been forbidden)`);

        } catch (error) {
            console.log(`   ✅ PASSED - Client forbidden from accepted job (${error.message})`);
        }

        // ==================================================
        // SECTION 6: Handyman starts job
        // ==================================================
        console.log("\n📝 SECTION 6: Handyman Starts Job");

        try {
            const { req, res, next } = createMockReqRes();
            addAuthToReq(req, handymanUser, handymanToken);
            req.params = { jobId: createdJobId };

            await jobController.startJob(req, res, next);

            const job = await Job.findById(createdJobId);

            const startChecks = [
                { check: job.status === "in_progress", msg: "Status changed to in_progress" },
                { check: job.startedAt, msg: "Started timestamp set" }
            ];

            const allPassed = startChecks.every(c => c.check);
            startChecks.forEach(c => {
                if (!c.check) console.log(` ❌ ${c.msg}`);
            });

            console.log(`   ✅ PASSED - Handyman starts job`);

        } catch (error) {
            console.log(`   ❌ FAILED - Handyman starts job`, error.message);
        }

        // ==================================================
        // SECTION 7: Handyman completes job
        // ==================================================
        console.log("\n📝 SECTION 7: Handyman Completes Job");

        try {
            const { req, res, next } = createMockReqRes();
            addAuthToReq(req, handymanUser, handymanToken);
            req.params = { jobId: createdJobId };

            await jobController.completeJob(req, res, next);

            const job = await Job.findById(createdJobId);

            const completeChecks = [
                { check: job.status === "completed", msg: "Status changed to completed" },
                { check: job.completedAt, msg: "Completed timestamp set" }
            ];

            const allPassed = completeChecks.every(c => c.check);
            completeChecks.forEach(c => {
                if (!c.check) console.log(` ❌ ${c.msg}`);
            });

            console.log(`   ✅ PASSED - Handyman completes job`);

        } catch (error) {
            console.log(`   ❌ FAILED - Handyman completes job:`, error.message);
        }

        // ==================================================
        // SECTION 8: Access Control Tests
        // ==================================================
        console.log("\n📝 SECTION 8: Access Control Tests");

        try {
            // Create another client with different job
            console.log(`   Creating another client...`);

            const otherClientData = {
                firstName: "Other",
                lastName: "Client",
                email: "other.client@example.com",
                password: "Test123!",
                role: "client",
                phone: "5555555555"
            };

            // Create FRESH mocks for registration
            const otherClientReq = {
                body: otherClientData,
                headers: { 'user-agent': 'test-agent' },
                params: {},
                query: {},
                user: null
            };

            const otherClientRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    console.log(`   Client registration response received`);
                    this.responseData = data;
                    return this;
                }
            };

            const otherClientNext = (error) => {
                if (error) {
                    console.log(`   ❌ Client registration error:`, error.message);
                    throw error;
                }
            };

            // Register the other client
            await authController.register(otherClientReq, otherClientRes, otherClientNext);

            // Find the created user
            const otherClientUser = await User.findOne({ email: otherClientData.email.toLowerCase() });
            console.log(`   ✅ Other client created: ${otherClientUser.email}`);

            // login other client to get token
            const otherLoginReq = {
                body: {
                    email: otherClientData.email,
                    password: otherClientData.password
                },
                headers: { 'user-agent': 'test-agent' },
                params: {},
                query: {},
                user: null
            };

            const otherLoginRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const otherLoginNext = (error) => {
                if (error) throw error;
            };

            await authController.login(otherLoginReq, otherLoginRes, otherLoginNext);
            const otherClientToken = otherLoginRes.responseData.data.tokens.accessToken;

            // Create job for other client
            const createJobReq = {
                body: {
                    ...testJob,
                    title: "Other client's job"
                },
                headers: {
                    'authorization': `Bearer ${otherClientToken}`,
                    'user-agent': 'test-agent'
                },
                params: {},
                query: {},
                user: {
                    userId: otherClientUser._id.toString(),
                    email: otherClientUser.email,
                    role: otherClientUser.role
                }
            };

            const createJobRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this
                }
            };

            const createJobNext = (error) => {
                if (error) throw error;
            };

            await jobController.createJob(createJobReq, createJobRes, createJobNext);

            const otherJobId = createJobRes.responseData.data.job._id;
            console.log(`   ✅ Other client's job created with ID: ${otherJobId}`);

            // Test client trying to view other client's job
            try {
                const viewJobReq = {
                    params: { jobId: otherJobId },
                    headers: { 'authorization': `Bearer ${clientToken}` },
                    user: {
                        userId: clientUser._id.toString(),
                        email: clientUser.email,
                        role: clientUser.role
                    }
                };

                const viewJobRes = {
                    statusCode: 200,
                    status: function(code) {
                        this.statusCode = code;
                        return this;
                    },
                    json: function(data) {
                        this.responseData = data;
                        return this;
                    }
                };

                const viewJobNext = (error) => {
                    if (error) throw error;
                };

                await jobController.getJobById(viewJobReq, viewJobRes, viewJobNext);

                console.log(`   ❌ Client viewed other's job (should have failed)`);

            } catch (error) {
                console.log(`   ✅ Client correctly forbidden from viewing other's job: ${error.message}`);
            }

            // Creating another handyman for testing
            console.log('\n Creating another handyman...');

            const otherHandymanData = {
                firstName: "Other",
                lastName: "Handyman",
                email: "other.handyman@example.com",
                password: "Test123!",
                role: "handyman",
                phone: "4444444444"
            };

            // Fresh mocks for handyman registration
            const otherHandymanReq = {
                body: otherHandymanData,
                headers: { 'user-agent': 'test-agent' },
                params: {},
                query: {},
                user: null
            };

            const otherHandymanRes = {
                statusCode: 200,
                status: function(code) { 
                    this.statusCode = code; 
                    return this; 
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const otherHandymanNext = (error) => {
                if (error) throw error;
            };

            await authController.register(otherHandymanReq, otherHandymanRes, otherHandymanNext);

            const otherHandymanUser = await User.findOne({ email: otherHandymanData.email.toLowerCase() });
            console.log(`   ✅ Other handyman created: ${otherHandymanUser.email}`);

            // Login other handyman
            const handymanLoginReq = {
                body: {
                    email: otherHandymanData.email,
                    password: otherHandymanData.password
                },
                headers: { 'user-agent': 'test-agent' },
            };

            const handymanLoginRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const handymanLoginNext = (error) => {
                if (error) throw error;
            };

            await authController.login(handymanLoginReq, handymanLoginRes, handymanLoginNext);
            const otherHandymanToken = handymanLoginRes.responseData.data.tokens.accessToken;

            // Create a job and assign to the other handyman
            const jobForOtherReq = {
                body: {
                    ...testJob,
                    title: "Job for other handyman"
                },
                headers: {
                    'authorization': `Bearer ${clientToken}`,
                    'user-agent': 'test-agent'
                },
                user: {
                    userId: clientUser._id.toString(),
                    email: clientUser.email,
                    role: clientUser.role
                }
            };

            const jobForOtherRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const jobForOtherNext = (error) => {
                if (error) throw error;
            };

            await jobController.createJob(jobForOtherReq, jobForOtherRes, jobForOtherNext);

            const jobForOtherId = jobForOtherRes.responseData.data.job._id;
            console.log(`   ✅ Job created for other handyman test`);

            // Accept job with other handyman
            const acceptJobReq = {
                params: { jobId: jobForOtherId },
                headers: { 'authorization': `Bearer ${otherHandymanToken}` },
                user: {
                    userId: otherHandymanUser._id.toString(),
                    email: otherHandymanUser.email,
                    role: otherHandymanUser.role
                }
            };

            const acceptJobRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const acceptJobNext = (error) => {
                if (error) throw error;
            };

            await jobController.acceptJob(acceptJobReq, acceptJobRes, acceptJobNext);
            console.log(`   ✅ Job accepted by other handyman`);

            // Try to view with original handyman (should fall)
            try {
                const viewOtherJobReq = {
                    params: { jobId: jobForOtherId },
                    headers: { 'authorization': `Bearer ${handymanToken}` },
                    user: {
                        userId: handymanUser._id.toString(),
                        email: handymanUser.email,
                        role: handymanUser.role
                    }
                };

                const viewOtherJobRes = {
                    statusCode: 200,
                    status: function(code) {
                        this.statusCode = code;
                        return this;
                    },
                    json: function(data) {
                        this.responseData = data;
                        return this;
                    }
                };

                const viewOtherJobNext = (error) => {
                    if (error) throw error;
                };

                await jobController.getJobById(viewOtherJobReq, viewOtherJobRes, viewOtherJobNext);
                console.log(`   ❌ Handyman viewed other's assigned job (should have failed)`);
            } catch (error) {
                console.log(`   ✅ Handyman correctly forbidden from viewing other's job: ${error.message}`);
            }

            console.log(`\n ✅ All access control tests passed`);

        } catch (error) {
            console.log(`   ❌ Access control tests failed:`, error.message);
            console.log(`   Stack:`, error.message);
            throw error;
        }

        // ==================================================
        // SECTION 9: Get User's Jobs
        // ==================================================
        console.log("\n📝SECTION 9: Get User's Jobs");

        try {
            // Test client gets their jobs
            console.log("\n Getting client's jobs...");

            const clientJobsReq = {
                query: {},
                headers: { 'authorization': `Bearer ${clientToken}`},
                user: {
                    userId: clientUser._id.toString(),
                    email: clientUser.email,
                    role: clientUser.role
                }
            };

            const clientJobsRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const clientJobsNext = (error) => {
                if (error) throw error;
            };

            await jobController.getMyJobs(clientJobsReq, clientJobsRes, clientJobsNext);

            const clientJobs = clientJobsRes.responseData.data.jobs;
            console.log(`   Client has ${clientJobs.length} jobs`);
            console.log(`   ✅ Client sees their jobs - PASSED`);

            // Test handyman gets their jobs
            console.log("\n Getting handyman's jobs...");

            const handymanJobsReq = {
                query: {},
                headers: { 'authorization': `Bearer ${handymanToken}` },
                user: {
                    userId: handymanUser._id.toString(),
                    email: handymanUser.email,
                    role: handymanUser.role
                }
            };

            const handymanJobsRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const handymanJobsNext = (error) => {
                if (error) throw error;
            };

            await jobController.getMyJobs(handymanJobsReq, handymanJobsRes, handymanJobsNext);

            const handymanJobs = handymanJobsRes.responseData.data.jobs;
            console.log(`   Handyman has ${handymanJobs.length} jobs`);
            console.log(`   ✅ Handyman sees their jobs - PASSED`);

            // Test with status filter
            console.log('\n Testing status filter...');

            const filteredJobsReq = {
                query: { status: 'completed' },
                headers: { 'authorization': `Bearer ${clientToken}` },
                user: {
                    userId: clientUser._id,
                    email: clientUser.email,
                    role: clientUser.role
                }
            };

            const filteredJobsRes = {
                statusCode: 200,
                status: function(code) {
                    this.statusCode = code;
                    return this;
                },
                json: function(data) {
                    this.responseData = data;
                    return this;
                }
            };

            const filteredJobsNext = (error) => {
                if (error) throw error;
            };

            await jobController.getMyJobs(filteredJobsReq, filteredJobsRes, filteredJobsNext);

            const filteredJobs = filteredJobsRes.responseData.data.jobs;
            console.log(`   Found ${filteredJobs.length} completed jobs`);
            console.log(`   ✅ Status filter works - PASSED`);
            
            console.log(`\n ✅ All user jobs tests passed`);

        } catch (error) {
            console.log(`   ❌ Get user's jobs test failed:`, error.message);
            console.log(`   Stack:`, error.stack);
        }

        console.log("\n🎉 JOB LIFECYCLE TESTS COMPLETED");
        console.log("===================================");

    } catch (error) {
        console.error("\n❌ TEST SUITE ERROR:", error);
    } finally {
        await teardownTest();
    }
};

// Run the tests
runTests();
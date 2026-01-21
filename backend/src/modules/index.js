import express from 'express';
import { env } from '../config/env.js';
import { success } from 'zod';

/**
 * Route Aggregator - Central hub for all API modules
 * This file serves as a single entry point for mounting all feature routes
 */

const router = express.Router();

// ===============================
// 1. API METADATA & DOCUMENTATION
// ===============================

/**
 * @api {get} / API Information
 * @apiName GetAPIInfo
 * @apiGroup APT
 * @apiDescription Returns API version and available endpoints
 */
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🚀 Handyman.za API v1',
        version: '1.0.0',
        environment: env.nodeEnv,
        documentation: 'https://docs.handyman.za',
        timestamp: new Date().toISOString(),
        endpoints: {
            auth: {
                path: '/auth',
                description: 'Authentication endpoints',
                methods: ['POST'],
            },
            users: {
                path: '/users',
                description: 'User management',
                methods: ['GET', 'PUT', 'PATCH'],
            },
            handymen: {
                path: '/handymen',
                description: 'Handyman profiles and services',
                methods: ['GET', 'POST', 'PUT'],
            },
            jobs: {
                path: '/jobs',
                description: 'Job management and matching',
                methods: ['GET', 'POST', 'PUT', 'PATCH'],
            },
            services: {
                path: '/services',
                description: 'Service catalog',
                methods: ['GET', 'POST', 'PUT'],
            },
            payments: {
                path: '/payments',
                description: 'Payment processing',
                methods: ['POST', 'GET'],
            },
            reviews: {
                path: '/reviews',
                description: 'Reviews and ratings',
                methods: ['GET', 'POST'],
            },
            notifications: {
                path: '/notifications',
                description: 'User notifications',
                methods: ['GET', 'PATCH'],
            },
            admin: {
                path: '/admin',
                description: 'Administration endpoints',
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            },
        },
    });
});

// ============================
// 2. MODULE ROUTE PLACEHOLDERS
// ============================

// Authentication Module
const authRouter = express.Router();
authRouter.get('/', (req, res) => placeholderResponse(res, 'Authentication endpoints coming soon'));
authRouter.post('/register', (req, res) => placeholderResponse(res, 'User registration endpoint'));
authRouter.post('/login', (req, res) => placeholderResponse(res, 'User login endpoint'));
authRouter.post('/logout', (req, res) => placeholderResponse(res, 'User logout endpoint'));
authRouter.post('/refresh-token', (req, res) => placeholderResponse(res, 'Token refresh endpoint'));
authRouter.post('/verify-email', (req, res) => placeholderResponse(res, 'Email verification endpoint'));
router.use('/auth', authRouter);
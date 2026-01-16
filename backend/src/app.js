import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { success } from 'zod';
//import { version } from 'react';

/**
 * Create and configure Express application
 * @returns {express.Application} Configured Express app
 */
export function createApp() {
    const app = express();

    // ======================
    // 1. Security Middleware
    // ======================

    // Set security HTTP headers
    app.use(helmet());                      // Default security headers
    /*
    app.use(helmet({
        crossOriginEmbedderPolicy: { policy: false },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'", env.frontendUrl],
            },
        },
    }));
*/
    // Enable CORS
    app.use(cors({
        origin: env.corsOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // ==================
    // 2. Request Parsing
    // ==================

    // Parse JSON bodies (with size limit)
    app.use(express.json({ 
        limit: '10mb' 
    }));

    // Parse URL-encoded bodies
    app.use(express.urlencoded({ 
        extended: true,
        limit: '10mb'
    }));

    // ========================
    // 3. Performance & Logging
    // ========================

    // Compress responses
    app.use(compression());

    // HTTP request logging
    if (env.isDevelopment) {
        app.use(morgan('dev'));                     // Colored, concise logs for development
    } else {
        app.use(morgan('combined'));                // Standard Apache combined log for production
    }

    // ================
    // 4. Rate Limiting
    // ================

    // Apply rate limiting to all requests
    const limiter = rateLimit({
        windowMs: 17 * 60 * 1000,                   // 15 minutes
        max: env.isDevelopment ? 1000 : 100,        // Limit each IP to 100 requests per windowMs
        standardHeaders: true,                      // Return rate limit info in the 'RateLimit-*' headers
        legacyHeaders: false,                       // Disable the 'X-RateLimit-*' headers
        message: {
            success: false,
            error: 'Too many requests from this IP, please try again later.',
        },
        skip: (req) => {
            // Skip rate limiting for health checks in development
            if (env.isDevelopment && req.path === '/api/v1/health') return true;
            return false;
        },
    });

    // Apply to all requests
    app.use(limiter);

    // =====================
    // 5. Health Check Route
    // =====================

    app.get('/api/v1/health', (req, res) => {
        res.status(200).json({
            success: true,
            message: '🟢 Handyman.za API is running',
            timestamp: new Date().toISOString(),
            environment: env.nodeEnv,
            version: process.env.npm_package_version || '1.0.0',
            uptime: process.uptime(),
        });
    });

    // ====================
    // 6. API Documentation
    // ====================

    app.get('/api/v1', (req, res) => {
        res.status(200).json({
            success: true,
            message: '🚀 Handyman.za API v1',
            document: 'https://docs.handyman.za',
            endpoints: {
                auth: '/api/v1/auth',
                users: '/api/v1/users',
                handymen: '/api/v1/handymen',
                jobs: '/api/v1/jobs',
                services: '/api/v1/services',
                payments: '/api/v1/payments',
                reviews: '/api/v1/reviews',
                notifications: '/api/v1/notifications',
                admin: '/api/v1/admin',
            },
        });
    });

    // ===========================
    // 7. Request Logging (Custom)
    // ===========================

    // Custom request logger for development
    if (env.isDevelopment) {
        app.use((req, res, next) => {
            const start = Date.now();

            // Log when response finishes
            res.on('finish', () => {
                const duration = Date.now() - start;
                console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
            });

            next();
        });
    }

    // =======================
    // 8. Error Handling Setup
    // =======================

    // 404 handler for undefined routes
    app.use(notFoundHandler);
    /*
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            error: '🔍 Route not found',
            message: `Cannot ${req.method} ${req.originalUrl}`,
            suggestion: 'Check the API documentation at /api/v1',
        });
    });
    */

    // Global error handler (will be enhanced later)
    app.use(errorHandler);
    /*
    app.use((error, req, res, next) => {
        console.error('🚨 Unhandled error:', error);

        const statusCode = error.statusCode || 500;
        const message = env.isProduction && statusCode === 500 
                                        ? 'Internal server error'
                                        : error.message || 'Something went wrong';
        
        res.status(statusCode).json({
            success: false,
            error: message,
            ...(env.isDevelopment && { stack: error.stack }),
        });
    });
    */
    return app;
}

// Export the createApp function
export default createApp;
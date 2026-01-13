import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';

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
    app.use(helmet({
        crossOriginEmbedderPolicy: { policy: "cross-origin" },
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
}
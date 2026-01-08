import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,

    mongoUri: process.env.MONGO_URI,

    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',

    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};
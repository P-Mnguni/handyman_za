import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { email } from "zod";

/**
 * Generate access token (short-lived)
 * @param {Object} user - User object
 * @returns {string} JWT access token
 */
export const generateAccessToken = (user) => {
    // Payload minimal
    const payload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        tokenType: 'access'
    };

    return jwt.sign(
        payload,
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn }
    );
};
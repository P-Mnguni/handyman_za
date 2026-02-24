import { ApiError } from '../utils/ApiError.js';

/**
 * Role-based authorization middleware factory
 * @param {...string} allowedRoles - List of roles allowed to access the route
 * @returns {Function} Express middleware
 * 
 * @example
 * // allow only clients
 * authorize("client")
 * 
 * @example
 * // allow both clients and handymen
 * authorize("client", "handyman")
 * 
 * @example
 * // allow only admins
 * authorize("admin")
 */
export const authorize = (...allowedRoles) => {
    // Return the middleware function
    return (req, res, next) => {
        try {
            // 1️⃣ Check if user exists (authentication middleware should have run first)
            if (!req.user) {
                throw ApiError.forbidden("Authentication required. Please login.");
            }

            // 2️⃣ Get user's role from the authenticated request
            const userRole = req.user.role;

            // 3️⃣ Check if user's role is in the allowed roles first
            if (!allowedRoles.includes(userRole)) {
                // User is authenticated but doesn't have the required role
                throw ApiError.forbidden(`Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${userRole}`);
            }

            // 4️⃣ User has required role - proceed
            next();
        } catch (error) {
            // Pass any errors to global error handler
            next(error);
        }
    };
};
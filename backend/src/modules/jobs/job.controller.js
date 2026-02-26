import * as jobService from './job.service.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * Create a new job
 * @route   POST /api/v1/jobs
 * @access  Private - Client only
 */
export const createJob = async (req, res, next) => {
    try {
        // Get client ID from authenticated user
        const clientId = req.user.userId;

        // Extract job data from request body
        const jobData = {
            ...req.body,
            client: clientId
        };

        // Call service layer
        const job = await jobService.createJob(jobData);

        // Return created job
        res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: { job }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all jobs with optional filters
 * @route   GET /api/v1/jobs
 * @access  Private - All authenticated users
 */
export const getAllJobs = async (req, res, next) => {
    try {
        // Extract query parameters for filtering
        const filters = {
            status: req.query.status,
            category: req.query.category,
            city: req.query.city,
            province: req.query.province,
            clientId: req.query.clientId,
            handymanId: req.query.handymanId,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
        };

        // Get user role and ID from authenticated user
        const user = {
            id: req.user.userId,
            role: req.user.role,
        };

        // Call service layer
        const result = await jobService.getAllJobs(filters, user);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get job by ID
 * @route   GET /api/v1/jobs/:jobId
 * @access  Private - All authenticated users
 */
export const getJobById = async (req, res, next) => {
    try {
        const { jobId } = req.params;

        if (!jobId) {
            throw ApiError.badRequest("Job ID is required");
        }

        // Get user info for permission checks in service
        const user = {
            id: req.user.userId,
            role: req.user.role
        };

        const job = await jobService.getJobById(jobId, user);

        res.status(200).json({
            success: true,
            data: { job }
        });
    } catch (error) {
        next(error);
    }
};
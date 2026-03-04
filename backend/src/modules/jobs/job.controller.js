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
        const clientId = req.user?.userId;
        
        if (!clientId) {
            throw ApiError.badRequest("User ID not found in request. Authentication middleware may be misconfigured.");
        }

        // Extract job data from request body
        const jobData = {
            ...req.body,
            //client: clientId
        };

        // Call service layer
        const job = await jobService.createJob(jobData, clientId);

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

/**
 * Update job
 * @route   PATCH /api/v1/jobs/:jobId
 * @access  Private - Client only (own pending jobs)
 */
export const updateJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;
        const updateData = req.body;

        if (!jobId) {
            throw ApiError.badRequest("Job ID is required");
        }

        const updatedJob = await jobService.updateJob(jobId, updateData, userId, userRole);

        res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: { job: updatedJob }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete/cancel job
 * @route   DELETE /api/v1/jobs/:jobId
 * @access  Private - Client only (own pending jobs)
 */
export const deleteJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;
        const { cancellationReason } = req.body;

        if (!jobId) {
            throw ApiError.badRequest("Job ID is required");
        }

        const result = await jobService.deleteJob(jobId, userId, userRole, cancellationReason);

        res.status(200).json({
            success: true,
            message: result.message || "Job cancelled successfully"
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Accept job (handyman accepts a job)
 * @route   POST /api/v1/jobs/:jobId/accept
 * @access  Private - Handyman only
 */
export const acceptJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const handymanId = req.user.userId;

        if (!jobId) {
            throw ApiError.badRequest("Job ID is required");
        }

        const job = await jobService.acceptJob(jobId, handymanId);

        res.status(200).json({
            success: true,
            message: "Job accepted successfully",
            data: { job }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Start job (handyman starts work)
 * @route   POST /api/v1/jobs/:jobId/start
 * @access  Private - Handyman only (assigned job)
 */
export const startJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const handymanId = req.user.userId;

        if (!jobId) {
            throw ApiError.badRequest("Job ID is required");
        }

        const job = await jobService.startJob(jobId, handymanId);

        res.status(200).json({
            success: true,
            message: "Job started successfully",
            data: { job }
        });

    } catch (error) {        
        next(error);
    }
};

/**
 * Complete job (handyman completes work)
 * @route   POST /api/v1/jobs/:jobId/complete
 * @access  Private - Handyman only (assigned job)
 */
export const completeJob = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const handymanId = req.user.userId;

        if (!jobId) {
            throw ApiError.badRequest("Job ID is required");
        }

        const job = await jobService.completeJob(jobId, handymanId);

        res.status(200).json({
            success: true,
            message: "Job completed successfully",
            data: { job }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get jobs for current user (either as client or handyman)
 * @route   GET /api/v1/jobs/my-jobs
 * @access  Private - All authenticated users
 */
export const getMyJobs = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;

        const filters = {
            status: req.query.status,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc'
        };

        const result = await jobService.getUserJobs(userId, userRole, filters);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get available jobs for handymen (pending jobs with no handyman)
 * @route   GET /api/v1/jobs/available
 * @access  Private - Handyman only
 */
export const getAvailableJobs = async (req, res, next) => {
    try {
        const filters = {
            category: req.query.category,
            city: req.query.city,
            province: req.query.province,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc'
        };

        const result = await jobService.getAvailableJobs(filters);

        res.status(200).json({
            success: true,
            data: {
                jobs: result.jobs,
                pagination: result.pagination
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Add review to completed job
 * @route   POST /api/v1/jobs/:jobId/review
 * @access  Private - Client or Handymen (who completed the job)
 */
export const addReview = async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const userId = req.user.userId;
        const userRole = req.user.role;
        const reviewData = req.body;

        if (!jobId) {
            throw ApiError.badRequest("Job ID is required");
        }

        const result = await jobService.addJobReview(jobId, userId, userRole, reviewData);

        res.status(200).json({
            success: true,
            message: "Review added successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};
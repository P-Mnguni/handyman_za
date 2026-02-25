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
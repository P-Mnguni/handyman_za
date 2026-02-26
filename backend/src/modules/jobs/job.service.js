import { Job } from './job.model.js';
import { JobStatus } from './job.constants.js';
import User  from '../users/user.model.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Create a new Job
 * @param {Object} jobData - Job data from controller
 * @param {string} clientId - ID of the client creating the job
 * @returns {Promise<Object>} Created job
 */
export const createJob = async (jobData, clientId) => {
    // Verify client exists
    const client = await User.findById(clientId);
    if (!client) {
        throw ApiError.notFound("Client not found");
    }

    // Verify client role (double-check, though middleware should have handled this)
    if (client.role !== 'client') {
        throw ApiError.forbidden("Only clients can create jobs");
    }

    // Create jow with pending status
    const job = await Job.create({
        ...jobData,
        client: clientId,
        status: JobStatus.PENDING,
        handyman: null                      // Explicitly set to null
    });

    return job;
};

/**
 * Get all jobs with role-based filtering
 * @param {Object} filters - Query filters (status, category, location, pagination)
 * @param {Object} user - User object { id, role }
 * @returns {Promise<Object>} Paginated jobs
 */
export const getAllJobs = async (filters, user) => {
    const { status, category, city, province, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    // Build query based on user role
    let query = {};

    // Role-based filtering
    if (user.role === 'client') {
        // Clients see only their own jobs
        query.client = user.id;
    } else if (user.role === 'handyman') {
        // Handyman see only pending jobs (available to accept)
        query.status = JobStatus.PENDING;
        query.handyman = null;              // Not assigned to anyone
    }
    // Admin sees all jobs (no additional filters)

    // Apply additional filters
    if (status) query.status = status;
    if (category) query.serviceCategory = category;
    if (city) query['location.city'] = city;
    if (province) query['location.province'] = province;

    // Pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const jobs = await Job.find(query)
                            .populate('client', 'name email phone')
                            .populate('handyman', 'name email phone')
                            .sort(sort)
                            .skip(skip)
                            .limit(limit)
                            .lean();        // Convert to plain JS objects for performance

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    return {
        jobs,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

/**
 * Get job by ID with permission check
 * @param {string} jobId - Job ID
 * @param {Object} user - User object { id, role }
 * @returns {Promise<Object>} Job object
 */
export const getJobById = async (jobId, user) => {
    // Find job 
    const job = await Job.findById(jobId)
                            .populate('client', 'name email phone')
                            .populate('handyman', 'name email phone');

    if (!job) {
        throw ApiError.notFound("Job not found");
    }

    // Permission check based on role
    if (user.role === 'client' && job.client._id.toString() !== user.id) {
        throw ApiError.forbidden("You can only view your own jobs");
    }

    if (user.role === 'handyman') {
        // Handymen can view pending jobs OR jobs they're assigned to
        const isAssigned = job.handyman && job.handyman._id.toString() === user.id;
        const isPending = job.status === JobStatus.PENDING && !job.handyman;

        if (!isAssigned && !isPending) {
            throw ApiError.forbidden("You can only view pending jobs or jobs assigned to you");
        }
    }

    // Admin has no restrictions

    return job;
};

/**
 * Update job (client only, pending only)
 * @param {string} jobId - Job ID
 * @param {Object} updateData - Fields to update
 * @param {string} userId - User ID making the request
 * @param {string} userRole - User role
 * @returns {Promise<Object>} Updated job
 */
export const updateJob = async (jobId, updateData, userId, userRole) => {
    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
        throw ApiError.notFound("Job not found");
    }

    // Permission check: Only client who owns the job can update
    if (userRole === ' client' && job.client.toString() !== userId) {
        throw ApiError.forbidden("You can only update your own jobs");
    }

    // Status check: Only pending jobs can be updated
    if (job.status !== JobStatus.PENDING) {
        throw ApiError.badRequest("Only pending jobs can be updated");
    }

    // Prevent updating certain fields
    const forbiddenFields = ['client', 'status', 'handyman', '_id'];
    forbiddenFields.forEach(field => {
        if (updateData[field]) {
            delete updateData[field];
        }
    });

    // Update job
    Object.assign(job, updateData);
    await job.save();

    return job;
};

/**
 * Delete/cancel job (client only, pending only)
 * @param {string} jobId - Job ID
 * @param {string} userId - User ID making the request
 * @param {string} userRole - User role
 * @param {string} cancellationReason - Reason for cancellation
 * @returns {Promise<Object>} Result
 */
export const deleteJob = async (jobId, userId, userRole, cancellationReason) => {
    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
        throw ApiError.notFound("Job not found");
    }

    // Permission check
    if (userRole === 'client' && job.client.toString() !== userId) {
        throw ApiError.forbidden("You can only cancel your own jobs");
    }

    // Status check: Only pending jobs can be cancelled
    if (job.status !== JobStatus.PENDING) {
        throw ApiError.badRequest("Only pending jobs can be cancelled");
    }

    // Update job status to cancelled
    job.status = JobStatus.CANCELED;
    job.cancelledAt = new Date();
    job.cancelledBy = userId;
    if (cancellationReason) {
        job.cancellationReason = cancellationReason;
    }

    await job.save();

    return { message: "Job cancelled successfully", job };
};
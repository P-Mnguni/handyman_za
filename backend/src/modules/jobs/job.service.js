import { Job } from './job.model.js';
import { JobStatus } from './job.constants.js';
import User  from '../users/user.model.js';
import ApiError from '../../utils/ApiError.js';
import mongoose from 'mongoose';

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

/**
 * Accept job (handyman accepts a pending job)
 * @param {string} jobId - Job ID
 * @param {string} handymanId - Handyman ID
 * @returns {Promise<Object>} Updated job
 */
export const acceptJob = async (jobId, handymanId) => {
    console.log("========== ACCEPT JOB DEBUG ==========");
    console.log("1. jobId:", jobId);
    console.log("2. handymanId:", handymanId);
    console.log("3. handymanId type:", typeof handymanId);

    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
        throw ApiError.notFound("Job not found");
    }

    console.log("4. Job found:", {
        id: job._id,
        currentStatus: job.status,
        currentHandyman: job.handyman
    });

    // Verify handyman exists
    const handyman = await User.findById(handymanId);
    if (!handyman || handyman.role !== 'handyman') {
        throw ApiError.forbidden("Only handymen can accept jobs");
    }

    // Check if job is available for acceptance
    if (job.status !== JobStatus.PENDING) {
        throw ApiError.badRequest("This job is not available for acceptance");
    }

    if (job.handyman) {
        throw ApiError.badRequest("This job already has a handyman assigned");
    }

    // Assign handyman and update status
    job.handyman = handymanId;
    job.status = JobStatus.ACCEPTED;
    job.acceptedAt = new Date();

    console.log("5. Before save - job modified:", {
        handyman: job.handyman,
        status: job.status,
        acceptedAt: job.acceptedAt
    });

    await job.save();

    // Reload from DB to verify save worked
    const savedJob = await Job.findById(jobId);
    console.log("6. After save - from DB:", {
        handyman: savedJob.handyman,
        handymanString: savedJob.handyman?.toString(),
        handymanIdType: typeof savedJob.handyman,
        status: savedJob.status,
        match: savedJob.handyman?.toString() === handymanId
    });

    const savedHandymanId = savedJob.handyman?.toString();
    const requestedHandymanId = handymanId.toString();

    console.log(`   Comparing: saved="${savedHandymanId}", requested="${requestedHandymanId}"`);
    console.log(`   Match: ${savedHandymanId === requestedHandymanId}`);

    if (!savedJob.handyman || savedHandymanId !== requestedHandymanId) {
        console.log("❌ CRITICAL: Handyman not saved correctly!");
        console.log(`   Saved handyman: ${savedHandymanId}`);
        console.log(`   Requested handyman: ${requestedHandymanId}`);
        throw new Error("Failed to assign handyman to job");
    }

    return savedJob;
};

/**
 * Start job (handyman starts work)
 * @param {string} jobId - Job ID
 * @param {string} handymanId - Handyman ID
 * @returns {Promise<Object>} Updated job
 */
export const startJob = async (jobId, handymanId) => {
    console.log("========== START JOB DEBUG ==========");
    console.log("1. jobId:", jobId);
    console.log("2. handymanId:", handymanId);
    console.log("3. handymanId type:", typeof handymanId);

    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
        throw ApiError.notFound("Job not found");
    }

    console.log("4. Job found:", {
        id: job._id,
        status: job.status,
        handyman: job.handyman,
        handymanType: typeof job.handyman,
        handymanString: job.handyman?.toString()
    });

    // Check if handyman is assigned to this job
    if (!job.handyman) {
        console.log("❌ No handyman assigned to job");
        throw ApiError.forbidden("You are not assigned to this job");
    }

    const jobHandymanStr = job.handyman.toString();
    const handymanIdStr = handymanId.toString();

    console.log("5. Comparing:", {
        jobHandymanStr,
        handymanIdStr,
        match: jobHandymanStr === handymanIdStr
    });

    if (jobHandymanStr !== handymanId) {
        throw ApiError.forbidden("You are not assigned to this job");
    }

    // Check if job can be started
    if (job.status !== JobStatus.ACCEPTED) {
        throw ApiError.badRequest(`Job cannot be started. Current status: ${job.status}`);
    }

    // Updated status
    job.status = JobStatus.IN_PROGRESS;
    job.startedAt = new Date();

    await job.save();
    console.log("6. Job started successfully");

    return job;
}

/**
 * Complete job (handyman completes work)
 * @param {string} jobId - Job ID
 * @param {string} handymanId - Handyman ID
 * @returns {Promise<Object>} Updated job
 */
export const completeJob = async (jobId, handymanId) => {
    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
        throw ApiError.notFound("Job not found");
    }

    // Check if handyman is assigned to this job
    if (!job.handyman || job.handyman.toString() !== handymanId.toString()) {
        throw ApiError.forbidden("You are not assigned to this job");
    }

    // Check if job can be completed
    const validStatuses = [JobStatus.ACCEPTED, JobStatus.IN_PROGRESS];
    if (!validStatuses.includes(job.status)) {
        throw ApiError.badRequest("This job cannot be completed in its current state");
    }

    // Update status
    job.status = JobStatus.COMPLETED;
    job.completedAt = new Date();

    await job.save();

    return job;
};

/**
 * Get jobs for specific user (client or handyman)
 * @param {string} userId - User ID
 * @param {string} userRole - User role
 * @param {Object} filters - Pagination and status filters
 * @returns {Promise<Object>} Paginated jobs
 */
export const getUserJobs = async (userId, userRole, filters) => {
    const { status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    // Build query based on role
    let query = {};

    if (userRole === 'client') {
        query.client = userId;
    } else if (userRole === 'handyman') {
        query.handyman = userId;
    }

    if (status) {
        query.status = status;
    }

    // Pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const jobs = await Job.find(query)
                            .populate('client', 'name email phone')
                            .populate('handyman', 'name email phone')
                            .sort(sort)
                            .skip(skip)
                            .limit(limit)
                            .lean();

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
 * Get available jobs for handymen 
 * @param {Object} filters - Category, location, pagination
 * @returns {Promise<Object>} Paginated available jobs
 */
export const getAvailableJobs = async (filters) => {
    const { category, city, province, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = filters;

    // Build query for available jobs
    let query = {
        status: JobStatus.PENDING,
        handyman: null
    };

    if (category) query.serviceCategory = category;
    if (city) query['location.city'] = city;
    if (province) query['location.province'] = province;

    // Pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const jobs = await Job.find(query)
                            .populate('client', 'name email phone')
                            .sort(sort)
                            .skip(skip)
                            .limit(limit)
                            .lean();

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
 * Add review to completed job
 * @param {string} jobId - Job ID
 * @param {string} userId - User ID adding review
 * @param {string} userRole - User role
 * @param {string} reviewData - Review data
 * @returns {Promise<Object>} Updated job
 */
export const addJobReview = async (jobId, userId, userRole, reviewData) => {
    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
        throw ApiError.notFound("Job not found");
    }

    // Check if job is completed
    if (job.status !== JobStatus.COMPLETED) {
        throw ApiError.badRequest("Review can only be added to completed jobs");
    }

    // Check if user is authorized to review
    const isClient = job.client.toString() === userId && userRole === 'client';
    const isHandyman = job.handyman && job.handyman.toString() === userId && userRole === 'handyman';

    if (!isClient && !isHandyman) {
        throw ApiError.forbidden("You are not authorized to review this job");
    }

    // Check if already reviewed
    if (isClient && job.clientReviewed) {
        throw ApiError.badRequest("You have already reviewed this job");
    }
    if (isHandyman && job.handymanReviewed) {
        throw ApiError.badRequest("You have already reviewed this job");
    }

    //Update review status
    if (isClient) {
        job.clientReviewed = true;
    } else if (isHandyman) {
        job.handymanReviewed = true;
    }

    await job.save();

    return { message: "Review added successfully", job };
};
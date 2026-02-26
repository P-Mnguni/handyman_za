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
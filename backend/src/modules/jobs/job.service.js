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


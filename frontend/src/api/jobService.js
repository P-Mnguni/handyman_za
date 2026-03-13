import apiClient from "./apiClient";

// Get all jobs with optional filters
export const getAllJobs = async (params = {}) => {
    try {
        const response = await apiClient.get('/jobs', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

// Get a single job by ID
export const getJobById = async (jobId) => {
    try {
        const response = await apiClient.get(`/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching job ${jobId}:`, error);
        throw error;
    }
};

// Get available jobs (for handyman)
export const getAvailableJobs = async () => {
    try {
        const response = await apiClient.get('/jobs/available');
        return response.data;
    } catch (error) {
        console.error('Error fetching available jobs:', error);
        throw error;
    }
};

// Get current user's jobs (client or handyman)
export const getMyJobs = async () => {
    try {
        const response = await apiClient.get('/jobs/my-jobs');
        return response.data;
    } catch (error) {
        console.error('Error fetching my jobs:', error);
        throw error;
    }
};

// Create a new job (client only)
export const createJob = async (jobData) => {
    try {
        const formattedData = {
            title: jobData.title,
            description: jobData.description,
            serviceCategory: jobData.serviceCategory,
            location: {
                address: jobData.address || '',
                city: jobData.location,
                province: jobData.province,
                coordinates: jobData.coordinates || null
            },
            budget: jobData.budget ? parseFloat(jobData.budget) : null,
            isNegotiable: jobData.isNegotiable || false,
            priority: jobData.priority || 'low'
        };

        const response = await apiClient.post('/jobs', formattedData);
        return response.data;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

// Update a job (client only - pending jobs)
export const updateJob = async (jobId, jobData) => {
    try {
        const response = await apiClient.patch(`/jobs/${jobId}`, jobData);
        return response.data;
    } catch (error) {
        console.error(`Error updating job ${jobId}:`, error);
        throw error;
    }
};

// Delete a job (client only - pending jobs)
export const deleteJob = async (jobId) => {
    try {
        const response = await apiClient.delete(`/jobs/${jobId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting job ${jobId}:`, error);
        throw error;
    }
};

// Accept a job (handyman only)
export const acceptJob = async (jobId) => {
    try {
        const response = await apiClient.post(`/jobs/${jobId}/accept`);
        return response.data;
    } catch (error) {
        console.error(`Error accepting job ${jobId}:`, error);
        throw error;
    }
};

// Start a job (handyman only - assigned jobs)
export const startJob = async (jobId) => {
    try {
        const response = await apiClient.post(`/jobs/${jobId}/start`);
        return response.data;
    } catch (error) {
        console.error(`Error starting job ${jobId}:`, error);
        throw error;
    }
};

// Complete a job (handyman only - in_progress jobs)
export const completeJob = async (jobId) => {
    try {
        const response = await apiClient.post(`/jobs/${jobId}/complete`);
        return response.data;
    } catch (error) {
        console.error(`Error completing job ${jobId}:`, error);
        throw error;
    }
};

import apiClient from "../api/apiClient";

// Get all handymen with optional filters
export const getHandymen = async (params = {}) => {
    try {
        const response = await apiClient.get('/handymen', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching handymen:', error);
        throw error;
    }
};

// Get a single handyman by ID
export const getHandymanById = async (handymanId) => {
    try {
        const response = await apiClient.get(`/handymen/${handymanId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching handyman ${handymanId}`, error);
        throw error;
    }
};

// Get handyman stats (ratings, completed jobs, etc.)
export const getHandymanStats = async (handymanId) => {
    try {
        const response = await apiClient.get(`/handymen/${handymanId}/stats`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching stats for handyman ${handymanId}:`, error);
        throw error;
    }
};

// Create a new handyman profile (admin only)
export const createHandyman = async (handymanData) => {
    try {
        const response = await apiClient.post('/handymen', handymanData);
        return response.data;
    } catch (error) {
        console.error('Error creating handyman:', error);
        throw error;
    }
};

// Update handyman profile
export const updateHandyman = async (handymanId, handymanData) => {
    try {
        const response = await apiClient.patch(`/handymen/${handymanId}`, handymanData);
        return response.data;
    } catch (error) {
        console.error(`Error updating handyman ${handymanId}`, error);
        throw error;
    }
};

// Delete a handyman (admin only)
export const deleteHandyman = async (handymanId) => {
    try {
        const response = await apiClient.delete(`/handymen/${handymanId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting handyman ${handymanId}:`, error);
        throw error;
    }
};
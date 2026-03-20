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


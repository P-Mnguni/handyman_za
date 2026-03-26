import apiClient from "../api/apiClient";

// Get all customers with optional filters
export const getCustomers = async (params = {}) => {
    try {
        const response = await apiClient.get('/clients', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};
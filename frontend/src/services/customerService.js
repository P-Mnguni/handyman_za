import apiClient from "../api/apiClient";

// Get all customers with optional filters
export const getCustomers = async (params = {}) => {
    try {
        const response = await apiClient.get('/customers', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

// Get a single customer by ID
export const getCustomerById = async (customerId) => {
    try {
        const response = await apiClient.get(`/customers/${customerId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching customer ${customerId}:`, error);
        throw error;
    }
};

// Get customer stats (total spent, jobs count, etc.)
export const getCustomerStats = async (customerId) => {
    try {
        const response = await apiClient.get(`/customers/${customerId}/stats`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching stats for customer ${customerId}:`, error);
        throw error;
    }
};
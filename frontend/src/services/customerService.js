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
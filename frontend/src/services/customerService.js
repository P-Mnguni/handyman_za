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

// Get customer's job history
export const getCustomerJobs = async (customerId, status = '') => {
    try {
        const params = status ? { status } : {};
        const response = await apiClient.get(`/customers/${customerId}/jobs`, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching jobs for customer ${customerId}:`, error);
        throw error;
    }
};

// Create a new customer (admin only)
export const createCustomer = async (customerData) => {
    try {
        const response = await apiClient.post('/customers', customerData);
        return response.data;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
};

// Update customer profile
export const updateCustomer = async (customerId, customerData) => {
    try {
        const response = await apiClient.patch(`/customers/${customerId}`, customerData);
        return response.data;
    } catch (error) {
        console.error(`Error updating customer ${customerId}:`, error);
        throw error;
    }
};

// Delete a customer (admin only)
export const deleteCustomer = async (customerId) => {
    try {
        const response = await apiClient.delete(`/customers/${customerId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting customer ${customerId}:`, error);
        throw error;
    }
};
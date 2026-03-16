import apiClient from "./apiClient";

/**
 * Authenticate user and get JWT tokens
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Returns user data and tokens
 */
export const login = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', {
            email,
            password
        });

        // The response should contain:
        // - user: user object (id, name, email, role)
        // - tokens: { accessToken, refreshToken}
        return response.data;
    } catch (error) {
        console.error('Login error:', error);

        // Re-throw with a user-friendly message
        if (error.response?.status === 401) {
            throw new Error('Invalid email on password');
        } else if (error.response?.status === 404) {
            throw new Error('User not found');
        } else if (!error.response) {
            throw new Error('Network error. Please check your connection.');
        } else {
            throw new Error(error.response?.data?.message || 'Login failed. Please try again');
        }
    }
};

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise} - Returns created user data
 */
export const register = async (userData) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);

        if (error.response?.status === 409) {
            throw new Error('Email already exists');
        } else if (!error.response) {
            throw new Error('Network error. Please check your connection.');
        } else {
            throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    }
};
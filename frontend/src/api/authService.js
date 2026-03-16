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
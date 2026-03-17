import axios from 'axios';

// Create axios instance with default configuration
const apiClient = axios.create({
    // Base URL for all API requests
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',

    // Default headers
    headers: {
        'Content-Type': 'application/json',
    },

    // Timeout after 30 seconds
    timeout: 30000,
});

// Request interceptor to add JWT token to every request
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

        // If token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;

            if (import.meta.env.DEV) {
                console.log('🔐 Token attached to request:', config.url);
            }
        }

        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Log the base URL in development
if (import.meta.env.DEV) {
    console.log('🔌 API Client configured with baseURL:', apiClient.defaults.baseURL);
}

export default apiClient;
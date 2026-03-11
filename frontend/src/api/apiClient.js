import axios from 'axios';

// Create axios instance with default configuration
const apiClient = axios.create({
    // Base URL for all API requests
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',

    // Default headers
    headers: {
        'Content-Type': 'application/json'
    },

    // Timeout after 30 seconds
    timeout: 30000,
});

// Log the base URL in development
if (import.meta.env.DEV) {
    console.log('🔌 API Client configured with baseURL:', apiClient.defaults.baseURL);
}

export default apiClient;
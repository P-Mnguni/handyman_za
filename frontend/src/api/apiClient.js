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

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
    (response) => {
        // Any status code within 2xx triggers this
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors (token expires)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Check if we have a refresh token
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // Attempt to refresh the token
                    const response = await axios.post(
                        `${apiClient.defaults.baseURL}/auth/refresh-token`,
                        { refreshToken }
                    );

                    // Store the new token
                    const { accessToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);

                    // Update the Authorization header
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    // Retry the original request
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Refresh failed - redirect to login
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token - redirect to login
                localStorage.clear();
                window.location.href = '/login';
            }
        }

        // Handle network errors
        if (!error.response) {
            console.error('🌐 Network error - backend might be down');
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        return Promise.reject(error);
    }
);

// Log the base URL in development
if (import.meta.env.DEV) {
    console.log('🔌 API Client configured with baseURL:', apiClient.defaults.baseURL);
}

export default apiClient;
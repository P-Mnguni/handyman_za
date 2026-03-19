import { createContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/authService";
import LoadingSpinner from "../components/LoadingSpinner";

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session on app load
    useEffect(() => {
        const restoreSession = async () => {
            const storedToken = localStorage.getItem('accessToken');
            const storedUser = localStorage.getItem('user');
        
            if (storedToken && storedUser) {
                try {
                    // Set token first so API calls work
                    setAccessToken(storedToken);
                    
                    // Verify token still valid and get fresh user data
                    const userData = await getCurrentUser();
                    setUser(userData);

                    // Update stored user with fresh data
                    localStorage.setItem('user',JSON.stringify(userData));
                } catch (error) {
                    console.error('Session restore failed:', error);
                    // Token is invalid or expired - clear everything
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    setAccessToken(null);
                    setUser(null);
                }
            }

            setLoading(false);
        };
        
        restoreSession();
    }, []);

    // Login function
    const login = (accessToken, userData) => {
        // Store in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // Update state
        setAccessToken(accessToken);
        setUser(userData);
    };

    // Logout function
    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Clear state
        setAccessToken(null);
        setUser(null);
    };

    // Optional: Fetch current user from backend
    const fetchCurrentUser = async () => {
        if (!accessToken) return null;

        try {
            // implementation coming soon
            // const response = await apiClient.get('/auth/me');
            // setUser(response.data);
            // return response.data;
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        }
    };

    // Don't render children until session checked
    if (loading) {
        return <LoadingSpinner size="medium" color="gray" text="Loading. Please wait..." />
    }

    const value = {
        user,
        accessToken,
        login,
        logout,
        loading,
        isAuthenticated: !!accessToken,
        fetchCurrentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
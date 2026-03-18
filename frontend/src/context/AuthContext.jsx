import { createContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        let isMounted = true;

        const storedToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser && isMounted) {
            setAccessToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => {
            isMounted = false;
        };
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
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    // Check if user is authenticated (valid token)
    const isAuthenticated = () => {
        // Check for token in localStorage
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

        // Token expiration check
        if (!token) return false;

        return true;
    };

    // If not authenticated, redirect to login
    if (!isAuthenticated()) {
        // Store the attempted URL to redirect back after login
        const currentLocation = window.location.pathname;
        if (currentLocation !== '/') {
            sessionStorage.setItem('redirectAfterLogin', currentLocation);
        }

        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
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

// Alternative: Component with role-based access control
export const RoleBasedRoute = ({ allowedRoles }) => {
    const isAuthenticated = () => {
        return !!(localStorage.getItem('accessToken') || localStorage.getItem('token'));
    };

    const getUserRole = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user?.role || 'client';
        } catch {
            return null;
        }
    };

    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const userRole = getUserRole();

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // User doesn't have required role
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
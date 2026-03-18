import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext(null);

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
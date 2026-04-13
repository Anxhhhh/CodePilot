import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService, refreshToken as refreshService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Persist login state
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await refreshService();
                if (response.success) {
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error("Not authenticated");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await loginService(credentials);
            if (response.success) {
                setUser(response.data.user);
                return response;
            }
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const response = await registerService(userData);
            if (response.success) {
                setUser(response.data.user);
                return response;
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Usually there's a logout endpoint, I'll check the backend routes
            // For now, clear local state.
            setUser(null);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const value = {
        user,
        loading,
        login,
        signup,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

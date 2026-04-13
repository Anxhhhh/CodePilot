import axiosInstance from "../../config/axios.config"

export const register = async (userData) => {
    try {   
        const response = await axiosInstance.post("/user/register", userData);
        return response.data;       
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post("/user/login", credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const refreshToken = async () => {
    try {
        const response = await axiosInstance.post("/user/refresh-token");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get("/user/me");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const logout = async () => {
    try {
        const response = await axiosInstance.post("/user/logout");
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


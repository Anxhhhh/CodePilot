import axiosInstance from "../../config/axios.config";

export const createFolder = async (folderData) => {
    try {
        const response = await axiosInstance.post("/folder/create", folderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const readFolder = async (folderData) => {
    try {
        const response = await axiosInstance.post("/folder/read", folderData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

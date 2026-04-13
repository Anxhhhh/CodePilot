import axiosInstance from "../../config/axios.config";

export const createFile = async (name, content = '') => {
    try {
        const response = await axiosInstance.post(`/files/create?name=${name}`, { body: content });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateFile = async (name, content) => {
    try {
        const response = await axiosInstance.post('/files/edit', { name, content });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const readFile = async (name) => {
    try {
        const response = await axiosInstance.get('/files/read', { params: { name } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteFile = async (name) => {
    try {
        const response = await axiosInstance.delete('/files/delete', { data: { name } });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

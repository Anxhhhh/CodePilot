import axiosInstance from "../../config/axios.config";

export const testAi = async (data) => {
    try {
        const response = await axiosInstance.post("/ai/test", data);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

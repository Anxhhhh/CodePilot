import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Required for sending cookies with requests
});

// Response Interceptor: Handle token expiration and automatic refresh
axiosInstance.interceptors.response.use(
    (response) => {
        // Return successful responses as is
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) and it's not a retry of the refresh request itself
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Trigger the refresh token endpoint
                // The browser will automatically include the refreshToken cookie
                await axiosInstance.post("/user/refresh-token");

                // If refresh is successful, cookies are updated automatically by the server.
                // Now retry the original request.
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, the session is likely expired.
                // Optionally handle logout logic here (e.g., redirect to login)
                console.error("Session expired. Please log in again.");
                return Promise.reject(refreshError);
            }
        }

        // Return any other errors
        return Promise.reject(error);
    }
);

export default axiosInstance;
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { API_CONFIG } from "./config";

// Define the structure of your API response (optional but recommended)
interface ApiResponse<T = never> {
    data: T;
    status: number;
    statusText: string;
}

// Create an Axios instance with configuration
const apiClient: AxiosInstance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${API_CONFIG.BASIC_AUTH_TOKEN}`,
    },
});

// Add response interceptor
apiClient.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => response,
    (error: AxiosError) => {
        if (error.response) {
            throw new Error(error.response.data as string);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Unexpected error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;

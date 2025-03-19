import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://mealmatch-e7s4.onrender.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // ✅ Ensures cookies & authentication tokens are sent
});

// ✅ Attach the token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // 🔑 Retrieve the token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // 🔒 Attach token
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;


import axios from "axios";

const api = axios.create({
    baseURL: "https://mealmatch-e7s4.onrender.com",
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


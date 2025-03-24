import axios from "axios";

// Use Vite's import.meta.env for environment variables
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001"; // Default to local backend

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


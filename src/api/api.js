import axios from "axios"; // Import axios for making HTTP requests

// Create an axios instance with a predefined configuration
const api = axios.create({
    baseURL: "http://localhost:5000", // ✅ Backend API base URL (change for production)
    withCredentials: true, // ✅ Ensures cookies & authentication tokens are sent with requests
});

export default api; // ✅ Export the configured API instance for use throughout the app


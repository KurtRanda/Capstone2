import axios from "axios"; // Import axios for making HTTP requests

// Create an axios instance with a predefined configuration
const api = axios.create({
    baseURL: "https://mealmatch-e7s4.onrender.com", // ✅ Backend API base URL
    withCredentials: true, // ✅ Ensures cookies & authentication tokens are sent with requests
});

export default api; // ✅ Export the configured API instance for use throughout the app


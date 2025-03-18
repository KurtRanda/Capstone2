import axios from "axios"; // Import axios for making HTTP requests

// ✅ Load API base URL from environment variables (Update before deployment)
const API_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Fetches the user's saved recipes from the backend.
 * @returns {Promise<Array>} - Returns an array of saved recipes or an empty array on failure.
 */
export const getSavedRecipes = async () => {
    // ✅ Retrieve authentication token from local storage
    const token = localStorage.getItem("token"); 
    if (!token) {
        console.error("❌ No authentication token found!");
        return []; // Return an empty array if not authenticated
    }

    try {
        // ✅ Send GET request to fetch saved recipes
        const response = await axios.get(`${API_URL}/recipes`, {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Attach token for authentication
            withCredentials: true, // ✅ Include credentials (cookies, sessions, etc.)
        });

        console.log("✅ Fetched saved recipes:", response.data);
        return response.data; // ✅ Return the fetched recipe data
    } catch (error) {
        console.error("❌ Error fetching saved recipes:", error);
        return []; // ✅ Return an empty array if there's an error
    }
};

/**
 * Saves a recipe to the user's saved recipes list in the backend.
 * @param {Object} recipe - Recipe object containing details.
 * @returns {Promise<Object | void>} - Returns the response data if successful, or logs an error.
 */
export async function saveRecipe(recipe) {
    try {
        // ✅ Send POST request to save the recipe
        const res = await axios.post(`${API_URL}/recipes`, {
            user_id: 1, // ❗ Replace this with the actual logged-in user ID (Dynamic in production)
            recipe_id: recipe.uri.split("_")[1], // ✅ Extract unique recipe ID from URI
            name: recipe.label, // ✅ Recipe name
            image_url: recipe.image, // ✅ Recipe image URL
            source_url: recipe.url, // ✅ Recipe source URL
            calories: recipe.calories, // ✅ Recipe calorie count
            servings: recipe.yield, // ✅ Number of servings
        });

        return res.data; // ✅ Return the saved recipe data
    } catch (err) {
        console.error("❌ Error saving recipe:", err);
    }
}

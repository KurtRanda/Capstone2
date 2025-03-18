import axios from "axios"; // Import axios for making API requests

// ✅ Load API credentials from environment variables (Ensure these are set in .env before deployment)
const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;

/**
 * Fetches recipes from the Edamam API based on the user's query.
 * @param {string} query - The search term (e.g., "chicken", "pasta").
 * @returns {Promise<Array>} - Returns an array of recipe objects or an empty array if an error occurs.
 */
export async function searchRecipes(query) {
    try {
        // ✅ Make GET request to the Edamam API with search query and credentials
        const res = await axios.get(
            `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
        );

        return res.data.hits; // ✅ Return the list of found recipes
    } catch (err) {
        console.error("❌ Error fetching recipes:", err);
        return []; // ✅ Return an empty array if there's an error
    }
}

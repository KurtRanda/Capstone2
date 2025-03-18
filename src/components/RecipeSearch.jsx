import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Load API credentials from .env file (Ensure these are set correctly before deployment)
const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;


/**
 * RecipeSearch Component
 * Allows users to search for recipes based on ingredients.
 * Fetches data from the Edamam API and navigates to the results page.
 * 
 * @param {Function} onRecipesFetched - Callback function to update search results in the parent component.
 */
function RecipeSearch({ onRecipesFetched }) {
    const [query, setQuery] = useState(""); // ✅ State to store search input
    const navigate = useNavigate(); // ✅ Hook for navigation

    // ✅ Debugging: Log environment variables (Only for development purposes)
    console.log("🔎 All Vite Env Variables:", process.env);
    console.log("🔑 Using API Credentials:", APP_ID, APP_KEY);

    /**
     * Handles the recipe search process.
     * Validates input, makes an API request, and navigates to results.
     */
    const handleSearch = async (e) => {
        e.preventDefault();

        // ✅ Ensure user entered a valid search query
        if (!query.trim()) {
            alert("Please enter ingredients to search.");
            return;
        }

        try {
            // ✅ Ensure API credentials exist before making the request
            if (!APP_ID || !APP_KEY) {
                throw new Error("Missing API credentials. Check your .env file.");
            }

            console.log("🔍 Fetching recipes from Edamam API...");
            const response = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`);

            // ✅ Check for API response errors
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ API Response Data:", data);

            // ✅ Handle case where no recipes are found
            if (!data.hits || data.hits.length === 0) {
                alert("No recipes found.");
                return;
            }

            console.log("✅ Recipes fetched successfully:", data.hits);

            // ✅ Store results in sessionStorage for persistence
            sessionStorage.setItem("previousResults", JSON.stringify(data.hits));
            sessionStorage.setItem("searchQuery", query);

            // ✅ Pass results to RecipePage.jsx via the parent component
            if (onRecipesFetched) {
                onRecipesFetched(data.hits, query);
            }

            // ✅ Navigate to the search results page with the fetched data
            navigate("/recipe-results", { state: { previousResults: data.hits, searchQuery: query } });

        } catch (error) {
            console.error("❌ Error fetching recipes:", error.message);
            alert("Failed to fetch recipes. Please check your API credentials.");
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Enter ingredients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)} // ✅ Update state when input changes
            />
            <button type="submit">Search</button>
        </form>
    );
}

export default RecipeSearch;








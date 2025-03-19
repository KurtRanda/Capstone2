import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Load API credentials from .env file
const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;

/**
 * RecipeSearch Component
 * -------------------------
 * Allows users to search for recipes based on ingredients.
 * Fetches data from the Edamam API and navigates to the results page.
 */
function RecipeSearch({ onRecipesFetched }) {
    const [query, setQuery] = useState(""); // ✅ Stores search input
    const navigate = useNavigate(); // ✅ Hook for navigation

    /**
     * Handles the recipe search process.
     * - Ensures input validation.
     * - Makes API request.
     * - Navigates to results page.
     */
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!query.trim()) {
            alert("❌ Please enter ingredients to search.");
            return;
        }

        if (!APP_ID || !APP_KEY) {
            console.error("❌ Missing API credentials. Check your .env file.");
            alert("API credentials are missing. Please configure your environment variables.");
            return;
        }

        try {
            console.log("🔍 Fetching recipes from Edamam API...");
            const response = await fetch(
                `https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ API Response Data:", data);

            if (!data.hits || data.hits.length === 0) {
                alert("❌ No recipes found. Try different ingredients.");
                return;
            }

            console.log("✅ Recipes fetched successfully:", data.hits);

            // ✅ Store results in sessionStorage for persistence
            sessionStorage.setItem("previousResults", JSON.stringify(data.hits));
            sessionStorage.setItem("searchQuery", query);

            // ✅ Pass results to parent component if applicable
            if (onRecipesFetched) {
                onRecipesFetched(data.hits, query);
            }

            // ✅ Navigate to the search results page
            navigate("/recipe-results", {
                state: { previousResults: data.hits, searchQuery: query },
            });

        } catch (error) {
            console.error("❌ Error fetching recipes:", error);
            alert("⚠️ Failed to fetch recipes. Please check your internet connection and try again.");
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Enter ingredients..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
}

export default RecipeSearch;








import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Load API credentials from .env file
const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;

function RecipeSearch({ onRecipesFetched }) {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    console.log("🔎 All Vite Env Variables:", import.meta.env);
    console.log("🔑 Using API Credentials:", APP_ID, APP_KEY);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!query.trim()) {
            alert("Please enter ingredients to search.");
            return;
        }

        try {
            if (!APP_ID || !APP_KEY) {
                throw new Error("Missing API credentials. Check your .env file.");
            }

            console.log("🔍 Fetching recipes from Edamam API...");
            const response = await fetch(`https://api.edamam.com/search?q=${query}&app_id=${APP_ID}&app_key=${APP_KEY}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ API Response Data:", data);

            if (!data.hits || data.hits.length === 0) {
                alert("No recipes found.");
                return;
            }

            console.log("✅ Recipes fetched successfully:", data.hits);

            // ✅ Store results in sessionStorage for persistence
            sessionStorage.setItem("previousResults", JSON.stringify(data.hits));
            sessionStorage.setItem("searchQuery", query);

            // ✅ Pass results to RecipePage.jsx and navigate
            if (onRecipesFetched) {
                onRecipesFetched(data.hits, query);
            }

            // ✅ Navigate to /recipe-results
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
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
        </form>
    );
}

export default RecipeSearch;







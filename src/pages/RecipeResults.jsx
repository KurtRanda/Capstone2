import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; 
import { Snackbar, Alert } from "@mui/material"; 

function RecipeResults({ user }) { 
    const navigate = useNavigate();
    const location = useLocation();
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [openSnackbar, setOpenSnackbar] = useState(false);
    
    useEffect(() => {
        console.log("🔄 Loading previous search results...");
        
        let storedResults = location.state?.previousResults || sessionStorage.getItem("previousResults");
        let storedSearchQuery = location.state?.searchQuery || sessionStorage.getItem("searchQuery");
    
        console.log("🟢 Retrieved from location.state:", location.state);
        console.log("🟢 Retrieved from sessionStorage:", storedResults);
    
        try {
            const parsedResults = storedResults
                ? (typeof storedResults === "string" ? JSON.parse(storedResults) : storedResults)
                : [];
    
            if (!Array.isArray(parsedResults)) {
                throw new Error("Parsed results are not an array");
            }
    
            console.log("✅ Successfully parsed previousResults:", parsedResults);
            setRecipes(parsedResults);
        } catch (error) {
            console.error("❌ Error parsing previousResults:", error);
            setRecipes([]); // Ensure recipes is never undefined
        }
    
        if (storedSearchQuery) {
            setSearchQuery(storedSearchQuery);
        }
    }, [location.state]);
    

    // ✅ Function to navigate to recipe details
    const handleRecipeClick = (recipe) => {
        console.log("📌 Navigating to RecipeDetails from search results");
        navigate(`/recipe/${recipe.uri.split("#recipe_")[1]}`, {
            state: { recipe, previousResults: recipes, searchQuery }
        });
    };
    

    // ✅ Function to save a recipe
    const handleSaveRecipe = async (recipe) => {
        if (!user) {
            alert("You need to log in to save recipes!");
            return;
        }
    
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication token missing! Please log in again.");
            return;
        }
    
        try {
            console.log("📝 Saving Recipe:", recipe);
    
            const response = await axios.post(
                "http://localhost:5000/recipes",
                {
                    name: recipe.label,
                    imageUrl: recipe.image,
                    sourceUrl: recipe.url,
                    recipeId: recipe.uri.split("#recipe_")[1],
                    calories: Math.round(recipe.calories),
                    servings: recipe.yield,
                    ingredientLines: recipe.ingredientLines || [] // ✅ Store only ingredients
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
    
            console.log("✅ Recipe saved:", response.data);
            setSnackbarMessage(`"${recipe.label}" has been saved!`);
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("❌ Error saving recipe:", error.response?.data || error);
            setSnackbarMessage("Failed to save recipe.");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };
    
    
        
    return (
        <div>
            <h2>Recipe Search Results</h2>

            <input
                type="text"
                placeholder="Search by ingredient..."
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                    sessionStorage.setItem("searchQuery", e.target.value);
                }}
            />

            {recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                <div className="recipe-grid">
                    {recipes.map((recipeData, index) => {
                        const recipe = recipeData.recipe;
                        return (
                            <div 
                                className="recipe-card" 
                                key={index} 
                                style={{ cursor: "pointer", border: "1px solid #ccc", padding: "10px", margin: "10px", borderRadius: "5px" }}
                            >
                                <img src={recipe.image} alt={recipe.label} style={{ width: "100px", height: "100px" }} />
                                <h3>{recipe.label}</h3>
                                <p>Calories: {Math.round(recipe.calories)}</p>

                                {/* ✅ View Details Button */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRecipeClick(recipe);
                                    }}
                                    style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer" }}
                                >
                                    View Details
                                </button>

                                {/* ✅ Save Recipe Button - Fixed */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSaveRecipe(recipe); // ✅ Passes recipe correctly
                                    }}
                                    style={{ marginTop: "10px", padding: "5px 10px", cursor: "pointer", background: "green", color: "white", marginLeft: "10px" }}
                                >
                                    Save Recipe
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ✅ Snackbar for Notifications */}
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={3000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default RecipeResults;





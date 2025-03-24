import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/api"; 
import { 
    Snackbar, Alert, CircularProgress, Grid, Card, CardMedia, CardContent, Typography, Button, useMediaQuery 
} from "@mui/material";

function RecipeResults({ user }) { 
    const navigate = useNavigate();
    const location = useLocation();
    const [recipes, setRecipes] = useState([]); 
    const [searchQuery, setSearchQuery] = useState(""); 
    const [snackbarMessage, setSnackbarMessage] = useState(""); 
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 
    const [openSnackbar, setOpenSnackbar] = useState(false); 
    const [loading, setLoading] = useState(false);
    const [savingRecipeId, setSavingRecipeId] = useState(null);
    const [savedRecipes, setSavedRecipes] = useState(new Set()); // ✅ Track saved recipes

    const isMobile = useMediaQuery("(max-width: 900px)"); // ✅ Adjusts layout dynamically

    useEffect(() => {
        setLoading(true);
        let storedResults = location.state?.previousResults || sessionStorage.getItem("previousResults");
        let storedSearchQuery = location.state?.searchQuery || sessionStorage.getItem("searchQuery");
    
        // If storedResults is already an object (or an array), no need to parse
        if (storedResults) {
            if (typeof storedResults === "string") {
                try {
                    const parsedResults = JSON.parse(storedResults); // Only parse if it's a string
                    setRecipes(parsedResults);
                } catch (error) {
                    console.error("Error parsing previousResults:", error);
                    setRecipes([]); // fallback to empty array if parsing fails
                }
            } else {
                setRecipes(storedResults); // Directly use if it's already an object
            }
        }
    
        if (storedSearchQuery) {
            setSearchQuery(storedSearchQuery);
        }
    
        setLoading(false);
    }, [location.state]);
    

    useEffect(() => {
        async function fetchSavedRecipes() {
            if (user) {
                const token = localStorage.getItem("token");
                try {
                    const response = await api.get("/recipes", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    console.log("✅ Recipes Response:", res.data);           
                    const savedSet = new Set(response.data.map(recipe => recipe.recipe_id));
                    setSavedRecipes(savedSet); // ✅ Store saved recipes
                } catch (error) {
                    console.error("❌ Error fetching saved recipes:", error);
                }
            }
        }
        fetchSavedRecipes();
    }, [user]);

    const handleRecipeClick = (recipe) => {
        navigate(`/recipe/${recipe.uri.split("#recipe_")[1]}`, {
            state: { recipe, previousResults: recipes, searchQuery }
        });
    };

    const handleSaveRecipe = async (recipe) => {
        if (!user) {
            alert("You need to log in to save recipes!");
            return;
        }

        const recipeId = recipe.uri.split("#recipe_")[1];

        if (savedRecipes.has(recipeId)) return; // ✅ Prevent saving duplicates

        const token = localStorage.getItem("token");
    
        if (!token) {
            alert("Authentication token missing! Please log in again.");
            return;
        }
    
        try {
            setSavingRecipeId(recipeId);

            await api.post(
                "/recipes",
                {
                    name: recipe.label,
                    imageUrl: recipe.image,
                    sourceUrl: recipe.url,
                    recipeId,
                    calories: Math.round(recipe.calories),
                    servings: recipe.yield,
                    ingredientLines: recipe.ingredientLines || []
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setSavedRecipes(new Set([...savedRecipes, recipeId])); // ✅ Mark recipe as saved
            setSnackbarMessage(`"${recipe.label}" has been saved!`);
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("Error saving recipe:", error.response?.data || error);
            setSnackbarMessage("Failed to save recipe.");
            setSnackbarSeverity("error");
        } finally {
            setSavingRecipeId(null);
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

            {loading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <CircularProgress />
                    <p>Loading recipes...</p>
                </div>
            ) : recipes.length === 0 ? (
                <p>No recipes found.</p>
            ) : (
                <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
                    {recipes.map((recipeData, index) => {
                        const recipe = recipeData.recipe;
                        const recipeId = recipe.uri.split("#recipe_")[1];
                        const isSaved = savedRecipes.has(recipeId);

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}> 
                                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                    <CardMedia 
                                        component="img" 
                                        image={recipe.image} 
                                        alt={recipe.label} 
                                        sx={{ width: "100%", height: isMobile ? 150 : 200, objectFit: "cover" }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{recipe.label}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Calories: {Math.round(recipe.calories)}
                                        </Typography>
                                        
                                        <Button 
                                            variant="contained" 
                                            size="small" 
                                            sx={{ mt: 1 }} 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRecipeClick(recipe);
                                            }}
                                        >
                                            View Details
                                        </Button>

                                        {!isSaved ? (
                                            <Button 
                                                variant="contained" 
                                                size="small"
                                                sx={{ mt: 1, background: "green", color: "white" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSaveRecipe(recipe);
                                                }}
                                                disabled={savingRecipeId === recipeId}
                                            >
                                                {savingRecipeId === recipeId ? "Saving..." : "Save Recipe"}
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="contained"
                                                disabled
                                                sx={{ mt: 1, background: "gray", color: "white" }}
                                            >
                                                Saved
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

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



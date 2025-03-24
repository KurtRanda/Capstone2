import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; 
import { 
    Snackbar, Alert, CircularProgress, Grid, Card, CardMedia, CardContent, Typography, Button, useMediaQuery 
} from "@mui/material";

function RecipeList({ user }) { 
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]); 
    const [searchIngredient, setSearchIngredient] = useState(""); 
    const [filteredRecipes, setFilteredRecipes] = useState([]); 
    const [loading, setLoading] = useState(false); 
    const [removingRecipeId, setRemovingRecipeId] = useState(null); 
    const [snackbarMessage, setSnackbarMessage] = useState(""); 
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); 
    const [openSnackbar, setOpenSnackbar] = useState(false); 

    const isMobile = useMediaQuery("(max-width: 900px)"); // ✅ Detects screen size

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            console.log("📥 Fetching saved recipes...");
            try {
                const token = localStorage.getItem("token");
                const res = await api.get("/recipes", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setRecipes(res.data);
                setFilteredRecipes(res.data);
            } catch (error) {
                console.error("❌ Error fetching saved recipes:", error.response?.data || error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (searchIngredient.trim() === "") {
            setFilteredRecipes(recipes);
        } else {
            const filtered = recipes.filter(recipe =>
                (recipe.ingredients ? recipe.ingredients.split(", ") : []).some(ingredient =>
                    ingredient.toLowerCase().includes(searchIngredient.toLowerCase())
                )
            );
            setFilteredRecipes(filtered);
        }
    }, [searchIngredient, recipes]);

    const handleRecipeClick = (recipe) => {
        console.log("📌 Navigating to RecipeDetails from saved recipes");

        const formattedRecipe = {
            uri: `http://www.edamam.com/ontologies/edamam.owl#recipe_${recipe.recipe_id}`,
            label: recipe.name,
            image: recipe.image_url,
            url: recipe.source_url,
            calories: recipe.calories,
            yield: recipe.servings,
            ingredientLines: recipe.ingredients ? recipe.ingredients.split(", ") : [],
        };

        navigate(`/recipe/${recipe.recipe_id}`, {
            state: { 
                recipe: formattedRecipe, 
                previousResults: recipes, 
                searchQuery: "",
                fromSavedRecipes: true 
            }
        });
    };

    const handleRemoveRecipe = async (recipeId) => {
        if (!user) { 
            alert("You need to log in to remove recipes!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication token missing! Please log in again.");
            return;
        }

        try {
            setRemovingRecipeId(recipeId); 
            console.log("🛑 Attempting to remove recipe with ID:", recipeId);

            await api.delete(`/recipes/${encodeURIComponent(recipeId)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setRecipes((prevRecipes) => prevRecipes.filter((r) => r.recipe_id !== recipeId));
            setFilteredRecipes((prevRecipes) => prevRecipes.filter((r) => r.recipe_id !== recipeId));

            setSnackbarMessage("Recipe removed successfully!");
            setSnackbarSeverity("success");
        } catch (error) {
            console.error("❌ Error removing recipe:", error.response?.data || error);
            setSnackbarMessage("Failed to remove recipe.");
            setSnackbarSeverity("error");
        } finally {
            setRemovingRecipeId(null); 
            setOpenSnackbar(true);
        }
    };

    return (
        <div>
            <h2>Saved Recipes</h2>

            <input
                type="text"
                placeholder="Search by ingredient..."
                value={searchIngredient}
                onChange={(e) => setSearchIngredient(e.target.value)}
            />

            {loading ? (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <CircularProgress /> 
                    <p>Loading saved recipes...</p>
                </div>
            ) : filteredRecipes.length === 0 ? (
                <p>No saved recipes found.</p>
            ) : (
                <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
                    {filteredRecipes.map((recipe, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}> 
                            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                                <CardMedia 
                                    component="img" 
                                    image={recipe.image_url} 
                                    alt={recipe.name} 
                                    sx={{ width: "100%", height: isMobile ? 150 : 200, objectFit: "cover" }}
                                />
                                <CardContent>
                                    <Typography variant="h6">{recipe.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">Calories: {recipe.calories}</Typography>
                                    
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

                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{
                                            mt: 1,
                                            background: removingRecipeId === recipe.recipe_id ? "gray" : "red",
                                            color: "white",
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveRecipe(recipe.recipe_id);
                                        }}
                                        disabled={removingRecipeId === recipe.recipe_id}
                                    >
                                        {removingRecipeId === recipe.recipe_id ? "Removing..." : "Remove Recipe"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
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

export default RecipeList;











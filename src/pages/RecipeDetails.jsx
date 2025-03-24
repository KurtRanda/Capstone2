import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api"; 
import {
    Button, Container, List, ListItem, ListItemText, Snackbar, Alert, 
    Typography, Card, CardMedia, CardContent, Chip, Grid, CircularProgress, useMediaQuery
} from "@mui/material";

function RecipeDetails({ user }) { 
    const { id } = useParams(); 
    const location = useLocation(); 
    const navigate = useNavigate(); 

    const [recipe, setRecipe] = useState(location.state?.recipe || {});
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingRecipe, setSavingRecipe] = useState(false);
    const [savingIngredient, setSavingIngredient] = useState(null);
    const [savedRecipes, setSavedRecipes] = useState(new Set());
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    const isMobile = useMediaQuery("(max-width: 900px)"); // ✅ Adjusts layout dynamically

    useEffect(() => {
        if (location.state?.recipe) {
            setRecipe(location.state.recipe);
            setIngredients(location.state.recipe.ingredientLines || location.state.recipe.ingredients?.split(", ") || []);
            setSavedRecipes(new Set([...savedRecipes, location.state.recipe.uri])); 
        } else {
            setRecipe({ label: "Unknown Recipe", image: "", ingredientLines: [] }); // ✅ Fallback value
        }
    
        if (location.state?.previousResults) {
            sessionStorage.setItem("previousResults", JSON.stringify(location.state.previousResults));
        }
        if (location.state?.searchQuery) {
            sessionStorage.setItem("searchQuery", location.state.searchQuery);
        }
        console.log("Recipe state:", recipe);

        setLoading(false);
    }, [location.state]);
    
    const handleGoBack = () => {
        const previousResults = location.state?.previousResults || JSON.parse(sessionStorage.getItem("previousResults") || "[]");
        const searchQuery = location.state?.searchQuery || sessionStorage.getItem("searchQuery") || "";
        
        if (location.state?.fromSavedRecipes) {
            navigate("/saved-recipes");
        } else if (previousResults.length > 0) {
            navigate("/recipe-results", { state: { previousResults, searchQuery } });
        } else {
            navigate("/");
        }
    };

    const handleSaveRecipe = async () => {
        if (!user) {
            alert("You need to log in to save recipes!");
            return;
        }

        if (savedRecipes.has(recipe.uri)) {
            setSnackbarMessage("Recipe is already saved.");
            setSnackbarSeverity("info");
            setOpenSnackbar(true);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication token missing! Please log in again.");
            return;
        }

        try {
            setSavingRecipe(true);
            await api.post("/recipes", {
                name: recipe.label,
                imageUrl: recipe.image,
                sourceUrl: recipe.url,
                recipeId: recipe.uri.split("#recipe_")[1],
                calories: Math.round(recipe.calories),
                servings: recipe.yield,
                ingredientLines: recipe.ingredientLines || []
            }, { headers: { Authorization: `Bearer ${token}` } });

            setSavedRecipes(new Set([...savedRecipes, recipe.uri])); 
            setSnackbarMessage(`"${recipe.label}" has been saved!`);
            setSnackbarSeverity("success");
        } catch (error) {
            setSnackbarMessage("Failed to save recipe.");
            setSnackbarSeverity("error");
        } finally {
            setSavingRecipe(false);
            setOpenSnackbar(true);
        }
    };

    const saveIngredientToGroceryList = async (ingredient) => {
        if (!user) {
            alert("You need to log in to save ingredients!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication token missing! Please log in again.");
            return;
        }

        try {
            setSavingIngredient(ingredient);
            await api.post("/grocery-list", {
                userId: user.id,
                ingredientName: ingredient,
                quantity: "1",
                unit: "",
            }, { headers: { Authorization: `Bearer ${token}` } });

            setSnackbarMessage(`"${ingredient}" added to grocery list! 🛒`);
            setSnackbarSeverity("success");
        } catch (error) {
            setSnackbarMessage("Failed to add ingredient. ❌");
            setSnackbarSeverity("error");
        } finally {
            setSavingIngredient(null);
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (loading) {
        return <Typography variant="h4" sx={{ textAlign: "center", marginTop: "20px" }}>
            <CircularProgress /> Loading recipe details...
        </Typography>;
    }

    return (
        <Container maxWidth="md">
            <Button type="button" onClick={handleGoBack} sx={{ mb: 2 }}>
                {location.state?.previousResults ? "🔙 Back to Search Results" : "📁 Back to Saved Recipes"}
            </Button>
    
            <Card sx={{ maxWidth: isMobile ? "100%" : 600, margin: "auto", mt: 4, p: 2, boxShadow: 3 }}>
                <CardMedia
                    component="img"
                    height={isMobile ? "200px" : "300px"}
                    image={recipe.image || "https://via.placeholder.com/600"}
                    alt={recipe.label || "Recipe Image"}
                    sx={{ objectFit: "cover", borderRadius: "8px" }}
                />
                <CardContent>
                    <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>{recipe.label}</Typography>
                    <Typography variant="body1"><strong>Calories:</strong> {Math.round(recipe.calories) || "N/A"}</Typography>
                    <Typography variant="body1"><strong>Servings:</strong> {recipe.yield || "N/A"}</Typography>

                    <Typography variant="h6" sx={{ mt: 2 }}>Ingredients:</Typography>
                    <List>
                        {ingredients.map((ingredient, index) => (
                            <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <ListItemText primary={ingredient} />
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="small"
                                    onClick={() => saveIngredientToGroceryList(ingredient)}
                                    disabled={savingIngredient === ingredient}
                                >
                                    {savingIngredient === ingredient ? "Adding..." : "➕ Add"}
                                </Button>
                            </ListItem>
                        ))}
                    </List>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ mt: 2 }}
                        onClick={handleSaveRecipe}
                        disabled={savingRecipe || savedRecipes.has(recipe.uri)}
                    >       
                        {savedRecipes.has(recipe.uri) ? "✅ Saved" : savingRecipe ? "Saving..." : "💾 Save Recipe"}
                    </Button>


                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        href={recipe.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ mt: 2, ml: 2 }}
                    >
                        View Full Recipe
                    </Button>
                </CardContent>
            </Card>

            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default RecipeDetails;


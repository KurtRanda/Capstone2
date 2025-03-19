import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import api from "../api/api"; // ✅ Use configured API instance
import {
    Button, Container, List, ListItem, ListItemText, Snackbar, Alert, 
    Typography, Card, CardMedia, CardContent, Chip, Grid
} from "@mui/material";

function RecipeDetails({ user }) { 
    const { id } = useParams(); 
    const location = useLocation(); 
    const navigate = useNavigate(); 

    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        console.log("🔍 Received previous search state:", location.state);
    
        if (location.state?.recipe) {
            setRecipe(location.state.recipe);
            if (location.state.recipe.ingredientLines) {
                setIngredients(location.state.recipe.ingredientLines);
            } else if (location.state.recipe.ingredients) {
                setIngredients(location.state.recipe.ingredients.split(", "));
            }
        }

        if (location.state?.previousResults) {
            sessionStorage.setItem("previousResults", JSON.stringify(location.state.previousResults));
        }
        if (location.state?.searchQuery) {
            sessionStorage.setItem("searchQuery", location.state.searchQuery);
        }
    }, [location.state]);

    useEffect(() => {
        if (recipe?.ingredientLines) {
            setIngredients(recipe.ingredientLines);
        }
    }, [recipe]);

    const handleGoBack = () => {
        console.log("🔙 Attempting to return to previous page...");
    
        const previousResults = location.state?.previousResults || JSON.parse(sessionStorage.getItem("previousResults") || "[]");
        const searchQuery = location.state?.searchQuery || sessionStorage.getItem("searchQuery") || "";
        
        if (location.state?.fromSavedRecipes) {
            console.log("✅ Returning to Saved Recipes!");
            navigate("/saved-recipes");
        } else if (previousResults.length > 0) {
            console.log("✅ Returning to Recipe Search Results!");
            navigate("/recipe-results", { state: { previousResults, searchQuery } });
        } else {
            console.log("❌ No previous results found. Returning to home.");
            navigate("/");
        }
    };

    const handleSaveRecipe = async () => {
        if (!user) {
            alert("You need to log in to save recipes!");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication token missing! Please log in again.");
            return;
        }

        console.log("📡 Sending request to save recipe...");

        try {
            const response = await api.post(
                "/recipes",
                {
                    name: recipe.label,
                    imageUrl: recipe.image,
                    sourceUrl: recipe.url,
                    recipeId: recipe.uri.split("#recipe_")[1],
                    calories: Math.round(recipe.calories),
                    servings: recipe.yield,
                    ingredientLines: recipe.ingredientLines || []
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
            const response = await api.post(
                "/grocery-list",
                {
                    userId: user.id,
                    ingredientName: ingredient,
                    quantity: "1",
                    unit: "",
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setSnackbarMessage(`"${ingredient}" added to grocery list! 🛒`);
            setSnackbarSeverity("success");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("❌ Error saving ingredient:", error.response ? error.response.data : error);
            setSnackbarMessage("Failed to add ingredient. ❌");
            setSnackbarSeverity("error");
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (!recipe) {
        return <Typography variant="h4" sx={{ textAlign: "center", marginTop: "20px" }}>Loading recipe details...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Button type="button" onClick={handleGoBack} sx={{ mb: 2 }}>
                {location.state?.previousResults ? "🔙 Back to Search Results" : "📁 Back to Saved Recipes"}
            </Button>
    
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2, boxShadow: 3 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={recipe.image || "https://via.placeholder.com/600"}
                    alt={recipe.label || "Recipe Image"}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom>{recipe.label}</Typography>
    
                    <Typography variant="subtitle1" color="textSecondary">
                        <strong>Source:</strong> {recipe.source || "Unknown"} | 
                        <strong> Dish Type:</strong> {recipe.dishType?.join(", ") || "N/A"} | 
                        <strong> Cuisine:</strong> {recipe.cuisineType?.join(", ") || "N/A"}
                    </Typography>
    
                    <Typography variant="body1"><strong>Calories:</strong> {Math.round(recipe.calories) || "N/A"}</Typography>
                    <Typography variant="body1"><strong>Servings:</strong> {recipe.yield || "N/A"}</Typography>
    
                    <Typography variant="h6" sx={{ mt: 2 }}>Dietary Labels:</Typography>
                    <Grid container spacing={1}>
                        {recipe.dietLabels?.map((label, index) => (
                            <Grid item key={index}>
                                <Chip label={label} color="primary" />
                            </Grid>
                        ))}
                        {recipe.healthLabels?.map((label, index) => (
                            <Grid item key={index}>
                                <Chip label={label} variant="outlined" />
                            </Grid>
                        ))}
                    </Grid>
    
                    <Typography variant="h6" sx={{ mt: 2 }}>Ingredients:</Typography>
                    {ingredients.length > 0 ? (
                        <List>
                            {ingredients.map((ingredient, index) => (
                                <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <ListItemText primary={ingredient} />
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="small"
                                        onClick={() => saveIngredientToGroceryList(ingredient)}
                                    >
                                        ➕ Add
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No ingredients available.</Typography>
                    )}
    
                    <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ mt: 2 }}
                        onClick={handleSaveRecipe}
                    >
                        💾 Save Recipe
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

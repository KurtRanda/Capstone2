import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Button, Container, List, ListItem, ListItemText, Snackbar, Alert, 
    Typography, Card, CardMedia, CardContent, Chip, Grid
} from "@mui/material";

/**
 * RecipeDetails Component
 * -------------------------
 * Displays detailed information about a recipe, including ingredients, nutritional info,
 * and source details. Allows users to save recipes and add ingredients to their grocery list.
 * 
 * Props:
 * - user: The currently logged-in user object (if any)
 */
function RecipeDetails({ user }) { 
    const { id } = useParams(); // Extract recipe ID from URL params
    const location = useLocation(); // Retrieve state data passed from navigation
    const navigate = useNavigate(); // Handle navigation between pages

    const [recipe, setRecipe] = useState(null); // Store recipe details
    const [ingredients, setIngredients] = useState([]); // Store ingredients list
    const [openSnackbar, setOpenSnackbar] = useState(false); // Control success/error messages
    const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message content
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Message type (success/error)

    /**
     * useEffect: Load recipe details from navigation state
     * If coming from search results, retrieve previous search state and store in sessionStorage
     */
    useEffect(() => {
        console.log("🔍 Received previous search state:", location.state);
    
        if (location.state?.recipe) {
            setRecipe(location.state.recipe);
    
            // Handle both API-fetched and saved recipes (convert string to array if needed)
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

    /**
     * useEffect: Update ingredient list when recipe changes
     */
    useEffect(() => {
        if (recipe?.ingredientLines) {
            setIngredients(recipe.ingredientLines);
        }
    }, [recipe]);

    /**
     * Handle navigation back to the correct previous page.
     * If user came from search results, return to search; otherwise, return to saved recipes.
     */
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

    /**
     * Save Recipe to User's Account
     * Requires authentication and sends a POST request to the backend.
     */
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
            const response = await axios.post(
                "http://localhost:5000/recipes",
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

    /**
     * Save an individual ingredient to the user's grocery list.
     */
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
            const response = await axios.post(
                "http://localhost:5000/grocery-list",
                {
                    userId: user.id,
                    ingredientName: ingredient,
                    quantity: "1",
                    unit: "",
                },
                {
                    withCredentials: true, 
                    headers: { Authorization: `Bearer ${token}` }, 
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
            {/* ✅ Back Button (Dynamically Switches) */}
            <Button type="button" onClick={handleGoBack} sx={{ mb: 2 }}>
                {location.state?.previousResults ? "🔙 Back to Search Results" : "📁 Back to Saved Recipes"}
            </Button>
    
            {/* ✅ Recipe Card */}
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2, boxShadow: 3 }}>
                {/* ✅ Recipe Image */}
                <CardMedia
                    component="img"
                    height="300"
                    image={recipe.image || "https://via.placeholder.com/600"}
                    alt={recipe.label || "Recipe Image"}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom>{recipe.label}</Typography>
    
                    {/* ✅ Recipe Overview */}
                    <Typography variant="subtitle1" color="textSecondary">
                        <strong>Source:</strong> {recipe.source || "Unknown"} | 
                        <strong> Dish Type:</strong> {recipe.dishType?.join(", ") || "N/A"} | 
                        <strong> Cuisine:</strong> {recipe.cuisineType?.join(", ") || "N/A"}
                    </Typography>
    
                    <Typography variant="body1"><strong>Calories:</strong> {Math.round(recipe.calories) || "N/A"}</Typography>
                    <Typography variant="body1"><strong>Servings:</strong> {recipe.yield || "N/A"}</Typography>
    
                    {/* ✅ Dietary Labels */}
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
    
                    {/* ✅ Ingredients List */}
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
    
                    {/* ✅ Save Recipe & View Full Recipe Buttons */}
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
    
            {/* ✅ Snackbar Confirmation */}
            <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}
export default RecipeDetails;
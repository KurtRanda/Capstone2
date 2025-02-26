import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Button, Container, List, ListItem, ListItemText, Snackbar, Alert, Typography, Card, CardMedia, CardContent } from "@mui/material";

function RecipeDetails({ user }) { 
    const { id } = useParams();
    const location = useLocation();
    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    
    useEffect(() => {
        console.log("🔍 User in RecipeDetails:", user); // ✅ Debug user state
        if (location.state?.recipe) {
            setRecipe(() => ({ ...location.state.recipe }));
        }
    }, [location.state]);

    useEffect(() => {
        if (recipe?.ingredientLines) {
            setIngredients([...recipe.ingredientLines]);
        }
    }, [recipe]);

    // ✅ Save an individual ingredient to grocery list
    const saveIngredientToGroceryList = async (ingredient) => {
        if (!user) {
            alert("You need to log in to save ingredients!");
            return;
        }
    
        const token = localStorage.getItem("token"); // ✅ Retrieve token
        console.log("🟢 Stored Token:", token);  // ✅ Debugging
    
        if (!token) {
            alert("Authentication token missing! Please log in again.");
            return;
        }
    
        try {
            console.log("🔄 Sending request with user:", user);
            console.log("🛒 Adding ingredient:", ingredient);
    
            const response = await axios.post(
                "http://localhost:5000/grocery-list",
                {
                    userId: user.id,
                    ingredientName: ingredient,
                    quantity: "1",
                    unit: "",
                },
                {
                    withCredentials: true, // ✅ Ensure cookies are sent
                    headers: { Authorization: `Bearer ${token}` }, // ✅ Attach token
                }
            );
    
            console.log("✅ Ingredient added:", response.data);
            setSnackbarMessage(`"${ingredient}" added to grocery list! 🛒`);
            setOpenSnackbar(true);
        } catch (error) {
            console.error("❌ Error saving ingredient:", error.response ? error.response.data : error);
            setSnackbarMessage("Failed to add ingredient. ❌");
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
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 2, boxShadow: 3 }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={recipe.image}
                    alt={recipe.label}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom>{recipe.label}</Typography>
                    <Typography variant="body1"><strong>Calories:</strong> {Math.round(recipe.calories)}</Typography>
                    <Typography variant="body1"><strong>Servings:</strong> {recipe.yield}</Typography>

                    <Typography variant="h6" sx={{ mt: 2 }}>Ingredients:</Typography>
                    <List>
                        {ingredients.map((ingredient, index) => (
                            <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <ListItemText primary={ingredient} />
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="small"
                                    onClick={() => {
                                        console.log("🛒 Add button clicked!");
                                        saveIngredientToGroceryList(ingredient);
                                    }}
                                >
                                    ➕ Add
                                </Button>
                            </ListItem>
                        ))}
                    </List>

                    <Typography variant="h6" sx={{ mt: 2 }}>Health Labels:</Typography>
                    <Typography variant="body2">{recipe.healthLabels?.join(", ")}</Typography>

                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        href={recipe.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ mt: 2 }}
                    >
                        View Full Recipe
                    </Button>
                </CardContent>
            </Card>

            {/* ✅ Snackbar Confirmation */}
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={3000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

 export default RecipeDetails;
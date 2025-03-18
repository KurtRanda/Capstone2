import React from "react";
import RecipeSearch from "../components/RecipeSearch";
import { Container, Typography, Box, Paper } from "@mui/material";

function RecipePage() {
    return (
        <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
            {/* ✅ Page Title with Styling */}
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#4f6d7a", marginBottom: 2 }}>
                Find Your Perfect Recipe 🍽️
            </Typography>

            {/* ✅ Instructions Card for Better Readability */}
            <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: "#f7f5f2", marginBottom: 4 }}>
                <Typography variant="h6" sx={{ color: "#2c3639" }}>
                    Enter ingredients you have on hand, and we'll find the best recipes for you!
                </Typography>
                <Typography variant="body1" sx={{ marginTop: 1, color: "#555" }}>
                    ✅ **How to Search:**  
                    - Type multiple ingredients separated by commas (e.g., **"chicken, garlic, tomatoes"**).  
                    - Use broad ingredient names for **better results** (e.g., **"cheese" instead of "cheddar cheese"**).  
                    - The more ingredients you enter, the **more tailored** the results will be!  
                </Typography>
            </Paper>

            {/* ✅ Recipe Search Component */}
            <Box>
                <RecipeSearch />
            </Box>
        </Container>
    );
}

export default RecipePage;




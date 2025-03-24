const express = require("express");
const Recipe = require("../models/Recipe");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get user's saved recipes (Protected)
router.get("/", authenticateToken, async (req, res) => {
    try {
        const recipes = await Recipe.getUserRecipes(req.user.id);
        res.json({ recipes }); // Return recipes in an object
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Save a new recipe (Protected)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const newRecipe = await Recipe.saveRecipe(req.user.id, req.body);
        res.status(201).json({ recipe: newRecipe }); // Return saved recipe in an object
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Remove a saved recipe (Protected)
router.delete("/:recipeId", authenticateToken, async (req, res) => {
    try {
        const { recipeId } = req.params; // Get the recipeId from URL params
        const userId = req.user.id;

        console.log("🛑 Received DELETE request for Recipe ID:", recipeId, "Type:", typeof recipeId);

        // Ensure recipeId is treated as a string
        if (typeof recipeId !== 'string') {
            return res.status(400).json({ error: "Invalid recipe ID type" });
        }

        // Call deleteRecipe from the model to delete the recipe
        const deletedRecipe = await Recipe.deleteRecipe(recipeId, userId);

        res.json({ message: "Recipe removed successfully", deletedRecipe });
    } catch (err) {
        console.error("❌ Error during DELETE operation:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

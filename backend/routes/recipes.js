const express = require("express");
const Recipe = require("../models/Recipe");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get user's saved recipes
router.get("/", authenticateToken, async (req, res) => {
    try {
        const recipes = await Recipe.getUserRecipes(req.user.id);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Save a new recipe
router.post("/", authenticateToken, async (req, res) => {
    try {
        const newRecipe = await Recipe.saveRecipe(req.user.id, req.body);
        res.status(201).json(newRecipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Remove a saved recipe
router.delete("/:recipeId", authenticateToken, async (req, res) => {
    try {
        const { recipeId } = req.params; // ✅ Use `recipeId` instead of `id`
        const userId = req.user.id;

        console.log("🛑 Received DELETE request for Recipe ID:", recipeId, "Type:", typeof recipeId);

        const deletedRecipe = await Recipe.deleteRecipe(recipeId, userId);
        res.json({ message: "Recipe removed successfully", deletedRecipe });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;

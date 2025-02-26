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

// ✅ Remove a recipe
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        await Recipe.deleteRecipe(req.params.id, req.user.id);
        res.json({ message: "Recipe removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

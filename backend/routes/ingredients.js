const express = require("express");
const Ingredient = require("../models/Ingredient");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get all ingredients for a recipe (Auth required)
router.get("/:recipe_id", authenticateToken, async (req, res) => {
    try {
        const ingredients = await Ingredient.getIngredientsByRecipe(req.params.recipe_id, req.user.id);
        res.json(ingredients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Add a new ingredient to a recipe (Auth required)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { recipe_id, name, quantity, unit } = req.body;
        const newIngredient = await Ingredient.addIngredient(req.user.id, recipe_id, name, quantity, unit);
        res.status(201).json(newIngredient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

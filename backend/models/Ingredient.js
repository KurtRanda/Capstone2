const pool = require("../config/db");

class Ingredient {
    // ✅ Fetch ingredients for a recipe (Ensure user owns the recipe)
    static async getIngredientsByRecipe(recipeId, userId) {
        const recipeCheck = await pool.query(
            "SELECT user_id FROM recipes WHERE id = $1",
            [recipeId]
        );

        if (recipeCheck.rows.length === 0 || recipeCheck.rows[0].user_id !== userId) {
            throw new Error("Unauthorized access to recipe ingredients");
        }

        const result = await pool.query(
            "SELECT * FROM ingredients WHERE recipe_id = $1",
            [recipeId]
        );
        return result.rows;
    }

    // ✅ Add a new ingredient to a recipe (Ensure user owns the recipe)
    static async addIngredient(userId, recipeId, name, quantity, unit) {
        const recipeCheck = await pool.query(
            "SELECT user_id FROM recipes WHERE id = $1",
            [recipeId]
        );

        if (recipeCheck.rows.length === 0 || recipeCheck.rows[0].user_id !== userId) {
            throw new Error("Unauthorized to add ingredients to this recipe");
        }

        const result = await pool.query(
            "INSERT INTO ingredients (recipe_id, name, quantity, unit) VALUES ($1, $2, $3, $4) RETURNING *",
            [recipeId, name, quantity, unit]
        );

        return result.rows[0];
    }
}

module.exports = Ingredient;


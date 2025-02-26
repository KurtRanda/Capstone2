const pool = require("../config/db");

class Recipe {
    // ✅ Fetch saved recipes for a user
    static async getUserRecipes(userId) {
        const result = await pool.query(
            "SELECT * FROM recipes WHERE user_id = $1",
            [userId]
        );
        return result.rows;
    }

    // ✅ Save a recipe for a user
    static async saveRecipe(userId, recipeData) {
        const { label, image, url, ingredients } = recipeData;
        const result = await pool.query(
            "INSERT INTO recipes (user_id, label, image, url, ingredients) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [userId, label, image, url, JSON.stringify(ingredients)] // Store ingredients as JSON
        );
        return result.rows[0];
    }

    // ✅ Delete a recipe (Ensure user owns it)
    static async deleteRecipe(recipeId, userId) {
        const result = await pool.query(
            "DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING *",
            [recipeId, userId]
        );
        if (!result.rowCount) {
            throw new Error("Recipe not found or not authorized");
        }
    }
}

module.exports = Recipe;

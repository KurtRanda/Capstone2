const pool = require("../config/db");


class Recipe {
    // ✅ Fetch saved recipes for a user
    static async getUserRecipes(userId) {
        const result = await pool.query(
            "SELECT * FROM recipes WHERE user_id = $1",
            [userId]
        );
        console.log("Recipes returned from DB:", result.rows);  // Log the rows returned
        return result.rows;
    }

    // ✅ Save a recipe for a user
    static async saveRecipe(userId, { name, imageUrl, sourceUrl, recipeId, calories, servings, ingredientLines }) {
        try {
            console.log("📝 Saving Recipe for User:", userId);
            console.log("➡ Recipe Data:", { name, imageUrl, sourceUrl, recipeId, calories, servings, ingredientLines });
    
            // Check if the recipe is already saved
            const checkResult = await pool.query(
                `SELECT * FROM recipes WHERE user_id = $1 AND recipe_id = $2`,
                [userId, recipeId]
            );
    
            if (checkResult.rows.length > 0) {
                throw new Error("Recipe already saved!");
            }
    
            // Convert array of ingredients to a comma-separated string for storage
            const ingredientsString = ingredientLines ? ingredientLines.join(", ") : "";
    
            // Insert the recipe into the database without specifying the id (it's auto-generated)
            const result = await pool.query(
                `INSERT INTO recipes (user_id, name, image_url, source_url, recipe_id, calories, servings, ingredients, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
                [
                    userId,
                    name,
                    imageUrl,
                    sourceUrl,
                    recipeId,
                    calories,
                    servings,
                    ingredientsString // Store ingredients as a string
                ]
            );
    
            console.log("✅ Successfully saved recipe:", result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error("❌ Error saving recipe:", error.message);
            throw new Error(error.message);
        }
    }
          
    


    // ✅ Delete a recipe (Ensure user owns it) - Corrected
    static async deleteRecipe(recipeId, userId) {
        try {
            console.log("🛑 Deleting recipe with ID:", recipeId, "User ID:", userId);
    
            // Ensure that recipeId is treated as a string for query purposes
            const result = await pool.query(
                "DELETE FROM recipes WHERE recipe_id = $1 AND user_id = $2 RETURNING *",
                [recipeId, userId]  // Ensure recipeId is passed correctly
            );
    
            if (!result.rowCount) {
                throw new Error("Recipe not found or not authorized to delete.");
            }
    
            console.log("✅ Successfully deleted recipe:", result.rows[0]);
            return result.rows[0]; // Returning the deleted recipe details
        } catch (error) {
            console.error("❌ Error deleting recipe:", error.message);
            throw new Error(error.message);
        }
    }
    
}

module.exports = Recipe;

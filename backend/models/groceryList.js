const pool = require("../config/db");

class GroceryList {
    // ✅ Fetch user's grocery list
    static async getUserGroceryList(userId) {
        const result = await pool.query(
            "SELECT * FROM grocery_list_items WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        return result.rows;
    }

    // ✅ Add an item to the grocery list
    static async addItem(userId, ingredientName, quantity, unit) {
        const result = await pool.query(
            "INSERT INTO grocery_list_items (user_id, ingredient_name, quantity, unit) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, ingredientName, quantity, unit]
        );
        return result.rows[0];
    }

    // ✅ Remove an item (Ensures ownership)
    static async removeItem(itemId, userId) {
        const result = await pool.query(
            "DELETE FROM grocery_list_items WHERE id = $1 AND user_id = $2 RETURNING *",
            [itemId, userId]
        );
        return result.rowCount > 0; // ✅ Returns true if deleted, false if unauthorized
    }

    // ✅ Toggle "purchased" status (Ensures ownership)
    static async togglePurchased(itemId, userId) {
        const result = await pool.query(
            "UPDATE grocery_list_items SET purchased = NOT purchased WHERE id = $1 AND user_id = $2 RETURNING *",
            [itemId, userId]
        );
        return result.rows[0] || null; // ✅ Returns updated row or null if unauthorized
    }
}

module.exports = GroceryList;

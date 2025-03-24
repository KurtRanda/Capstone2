const express = require("express");
const pool = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get user's grocery list (Protected)
router.get("/", authenticateToken, async (req, res) => {
    try {
        console.log("🔍 Fetching grocery list for User ID:", req.user.id);

        const result = await pool.query(
            "SELECT * FROM grocery_list_items WHERE user_id = $1",
            [req.user.id]
        );

        res.json({
            groceryList: result.rows  // Ensure correct structure for the test
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Add an item (Protected)
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { ingredientName, quantity, unit } = req.body;
        const userId = req.user.id;

        console.log("🛒 Adding ingredient for user:", userId, ingredientName);

        const result = await pool.query(
            "INSERT INTO grocery_list_items (user_id, ingredient_name, quantity, unit) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, ingredientName, quantity, unit]
        );

        res.status(201).json({
            ingredient: result.rows[0]  // Ensure ingredient object is wrapped correctly
        });
    } catch (err) {
        console.error("❌ Error inserting grocery item:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Remove item (Protected) - Ensures only the owner can remove items
router.delete("/:itemId", authenticateToken, async (req, res) => {
    try {
        console.log("🗑 Removing item for User ID:", req.user.id);

        const result = await pool.query(
            "DELETE FROM grocery_list_items WHERE id = $1 AND user_id = $2 RETURNING *",
            [req.params.itemId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Item not found or unauthorized." });
        }

        res.json({ message: "Ingredient removed" });  // Ensure structure consistency
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Toggle Purchased Status (Protected) - Ensures only the owner can update
router.patch("/:itemId/toggle", authenticateToken, async (req, res) => {
    try {
        console.log("🔄 Toggling item purchase for User ID:", req.user.id);

        const result = await pool.query(
            "UPDATE grocery_list_items SET purchased = NOT purchased WHERE id = $1 AND user_id = $2 RETURNING *",
            [req.params.itemId, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Item not found or unauthorized." });
        }

        res.json(result.rows[0]);  // Ensure you're returning the updated item
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;



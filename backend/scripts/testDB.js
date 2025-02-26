const GroceryList = require("../models/groceryList");
const Recipe = require("../models/Recipe");
const pool = require("../config/db");

async function testDB() {
    try {
        const userId = 1;

        // ✅ Test fetching grocery list
        const groceries = await GroceryList.getUserGroceryList(userId);
        console.log("🛒 Grocery List for User", userId, ":", groceries);

        // ✅ Test fetching user recipes
        const recipes = await Recipe.getUserRecipes(userId);
        console.log("📖 Saved Recipes for User", userId, ":", recipes);

        // ✅ Test inserting an ingredient
        const newIngredient = await GroceryList.addItem(userId, "Test Ingredient", "1", "kg");
        console.log("✅ Added Ingredient:", newIngredient);

        // ✅ Test database connection
        const result = await pool.query("SELECT NOW()");
        console.log("📅 Database Connected. Current Time:", result.rows[0]);

    } catch (err) {
        console.error("❌ Error testing database:", err);
    } finally {
        pool.end(); // Close connection after testing
    }
}

testDB();

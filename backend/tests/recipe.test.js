const pool = require("../config/db");
const app = require("../server");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("Recipe API Tests", () => {
    let token;
    let testUserId;

    beforeAll(async () => {
        // Clean database before tests
        await pool.query("DELETE FROM recipes");
        await pool.query("DELETE FROM users");

        // Insert a test user
        const userRes = await pool.query(`
            INSERT INTO users (email, password, role)
            VALUES ('test@example.com', 'hashedpassword', 'user')
            RETURNING id
        `);

        testUserId = userRes.rows[0].id; // Store the test user ID

        // Generate a token for the test user
        token = jwt.sign(
            { id: testUserId, email: "test@example.com", role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
    });

    test("✅ Saves a recipe", async () => {
        const res = await request(app)
            .post("/recipes")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Recipe",
                imageUrl: "https://example.com/image.jpg",
                sourceUrl: "https://example.com/full-recipe",
                recipeId: "test123",  // Ensure this matches the column type and constraints
                calories: 500,
                servings: 4,
                ingredientLines: ["1 cup flour", "2 eggs"]  // Ensure this matches the table
            });
    
        expect(res.status).toBe(201);
        expect(res.body.recipe.name).toBe("Test Recipe");
        expect(res.body.recipe.recipe_id).toBe("test123"); // Ensure recipe_id is returned correctly
    });

    test("✅ Fetches saved recipes", async () => {
        const res = await request(app)
            .get("/recipes")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.recipes).toBeDefined();  // Ensure recipes array is defined
        expect(res.body.recipes.length).toBeGreaterThan(0);  // Ensure there are recipes
    });

    test("✅ Deletes a saved recipe", async () => {
        const res = await request(app)
            .get("/recipes")
            .set("Authorization", `Bearer ${token}`);
    
        console.log("Response from GET /recipes:", res.body);  // Log the full response
    
        // Ensure that res.body.recipes is an array and has at least one recipe
        expect(res.body.recipes).toBeInstanceOf(Array);  // Check that it's an array
        expect(res.body.recipes.length).toBeGreaterThan(0);  // Ensure there are recipes
    
        const recipe = res.body.recipes[0];  // Get the first recipe
        console.log("First recipe:", recipe);  // Log the first recipe
    
        const recipeId = recipe.recipe_id;  // Use the correct property name for recipeId
    
        const deleteRes = await request(app)
            .delete(`/recipes/${recipeId}`)
            .set("Authorization", `Bearer ${token}`);
    
        console.log("Response from DELETE /recipes:", deleteRes.body);  // Log the delete response
    
        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toBe("Recipe removed successfully");
    });
    
    
});



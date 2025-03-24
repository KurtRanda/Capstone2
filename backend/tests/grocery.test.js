const pool = require("../config/db");
const app = require("../server");
const request = require("supertest");
const jwt = require("jsonwebtoken");

describe("Grocery List API Tests", () => {
    let token;

    beforeEach(async () => {
        // Reset the database before each test
        await pool.query("DELETE FROM users");
        await pool.query("DELETE FROM grocery_list_items");

        // Insert a test user and generate token
        const res = await request(app).post("/auth/signup").send({
            email: "grocerytest@example.com",
            password: "Test@1234",
        });

        console.log("Response from register:", res.body); // Log to check if token is received    

        token = res.body.token;

        // Check if token is in the response
        if (!token) {
            throw new Error("Token not received in response");
        }

        // Optionally: verify if the token can be decoded properly to ensure its validity
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded); // Log the decoded token
        } catch (err) {
            console.error("Error decoding token:", err);
            throw new Error("Token verification failed");
        }

        // Insert a sample ingredient into the grocery list for testing delete and fetch
        await pool.query(`
            INSERT INTO grocery_list_items (ingredient_name, quantity, unit, user_id)
            VALUES ('Tomatoes', '2', 'pcs', (SELECT id FROM users WHERE email = 'grocerytest@example.com'))
        `);
    });

    test("✅ Adds an ingredient to grocery list", async () => {
        const res = await request(app)
            .post("/grocery-list")
            .set("Authorization", `Bearer ${token}`)
            .send({
                ingredientName: "Tomatoes",
                quantity: "2",
                unit: "pcs"
            });

        expect(res.status).toBe(201);
        expect(res.body.ingredient.ingredient_name).toBe("Tomatoes");
    });

    test("✅ Fetches grocery list", async () => {
        const res = await request(app)
            .get("/grocery-list")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.groceryList).toBeDefined(); // Ensure groceryList is returned
        expect(res.body.groceryList.length).toBeGreaterThan(0);
    });

    test("✅ Deletes an ingredient", async () => {
        const res = await request(app)
            .get("/grocery-list")
            .set("Authorization", `Bearer ${token}`);

        const ingredientId = res.body.groceryList[0].id;

        const deleteRes = await request(app)
            .delete(`/grocery-list/${ingredientId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteRes.status).toBe(200);
        expect(deleteRes.body.message).toBe("Ingredient removed");
    });
});


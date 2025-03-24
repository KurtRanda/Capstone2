const request = require("supertest");
const app = require("../server");
const { runMigrations, cleanUpTestDatabase, pool } = require("./test-db");
require("dotenv").config({ path: ".env.test" }); // Ensure this is properly loading the .env.test file

let token;
let poolEnded = false;

beforeAll(async () => {
    console.log("🟢 Running beforeAll setup for tests");

    // Run migrations (using testDB.js)
    await runMigrations();  // Ensures migrations are applied

    // Create a test user in the database
    const res = await request(app).post("/auth/signup").send({
        email: "grocerytest@example.com",
        password: "Test@1234",
    });

    // Log the full response body for debugging
    console.log("Response from signup:", res.body);

    // Check if the token exists in the response and log it
    token = res.body.token;
    if (!token) {
        console.error("❌ Error: Token not received in response. Test setup failed.");
        throw new Error("Token not received. Test setup cannot continue.");
    }

    console.log("🟢 Token generated successfully:", token);
});

afterAll(async () => {
    console.log("🟢 Running afterAll cleanup...");

    // Clean up the test database
    await cleanUpTestDatabase();  // Adjust cleanup process if necessary

    if (!poolEnded) {
        await pool.end();  // Ensure pool is closed once
        poolEnded = true;
    }
});

module.exports = pool;  // Ensure pool is exported properly






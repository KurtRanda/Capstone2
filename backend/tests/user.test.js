const User = require("../models/User");
const pool = require("./setup");
const jwt = require("jsonwebtoken");

describe("User Model Tests", () => {
    let token;
    let testUserId;

    beforeEach(async () => {
        // Clean database before each test (truncate with cascade to handle foreign key constraints)
        await pool.query("TRUNCATE TABLE grocery_list_items, recipes RESTART IDENTITY CASCADE");
        await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");

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
          process.env.JWT_SECRET || "testsecret", // Ensure fallback in case the environment variable is missing in test
          { expiresIn: "1h" }
        );
    });

    test("✅ Creates a new user", async () => {
        const email = "test2@example.com";
        const password = "Test@1234";
        
        const newUser = await User.createUser(email, password);
        expect(newUser).toHaveProperty("id");
        expect(newUser.email).toBe(email);
        expect(newUser.role).toBe("user");
    });

    test("❌ Prevents duplicate user signups", async () => {
        const email = "duplicate@example.com";
        const password = "Test@1234";

        await User.createUser(email, password);

        // Checking for duplicate key error
        await expect(User.createUser(email, password))
            .rejects
            .toThrowError('duplicate key value violates unique constraint')
            .catch(err => expect(err.message).toMatch(/duplicate key/)); // Ensure a duplicate error message
    });

    test("✅ Finds a user by email", async () => {
        const email = "findme@example.com";
        const password = "Test@1234";
        await User.createUser(email, password);
        
        const foundUser = await User.findByEmail(email);
        expect(foundUser).not.toBeNull();
        expect(foundUser.email).toBe(email);
    });

    test("❌ Returns null if email not found", async () => {
        const foundUser = await User.findByEmail("nonexistent@example.com");
        expect(foundUser).toBeNull();
    });

    test("✅ Verifies correct password", async () => {
        const email = "secure@example.com";
        const password = "StrongPass@1";
        await User.createUser(email, password);
        
        const user = await User.findByEmail(email);
        const isValid = await User.verifyPassword(password, user.password);
        expect(isValid).toBe(true);
    });

    test("❌ Rejects incorrect password", async () => {
        const email = "wrongpass@example.com";
        const password = "CorrectPass@1";
        await User.createUser(email, password);
        
        const user = await User.findByEmail(email);
        const isValid = await User.verifyPassword("WrongPass", user.password);
        expect(isValid).toBe(false);
    });
});


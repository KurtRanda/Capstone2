require("dotenv").config({ path: ".env.test" });  // Ensure that the .env.test file is loaded for test settings
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.TEST_DATABASE_URL || "postgresql://kurt:als21311@localhost/mealmatch_test",
});

async function runMigrations() {
  console.log("🟢 Running migrations...");
  try {
    // Users Table
    console.log("Creating users table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        role VARCHAR(20) DEFAULT 'user'
      );
    `);

    // Recipes Table
    console.log("Creating recipes table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        recipe_id VARCHAR(100) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        image_url TEXT,
        source_url TEXT,
        calories DOUBLE PRECISION,
        servings INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        diet_labels TEXT,
        health_labels TEXT,
        ingredients TEXT
      );
    `);

    // Ingredients Table
    console.log("Creating ingredients table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        quantity VARCHAR(50),
        unit VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Grocery List Table
    console.log("Creating grocery list items table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS grocery_list_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ingredient_name VARCHAR(255) NOT NULL,
        quantity VARCHAR(50),
        unit VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        purchased BOOLEAN DEFAULT false
      );
    `);

    console.log("✅ Test tables created successfully.");
  } catch (error) {
    console.error("❌ Error creating test tables:", error);
  }
}


// Function to clean up the database after tests
const cleanUpTestDatabase = async () => {
    console.log("🧹 Cleaning up the test database...");

    await pool.query("DELETE FROM users"); // Delete data in users table
    await pool.query("DELETE FROM grocery_list_items"); // And other necessary tables
    // Add more DELETE queries for other tables as needed

    console.log("✅ Test database cleaned up.");
};


// Export functions for use in your tests
module.exports = {
  runMigrations,
  cleanUpTestDatabase,
  pool,
};



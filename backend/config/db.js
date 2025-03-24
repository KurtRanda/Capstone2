require("dotenv").config({ path: process.env.NODE_ENV === "test" ? "./backend/.env.test" : "./backend/.env" });

const { Pool } = require("pg");

// Ensure that the connection string is coming from the right environment variable
const connectionString = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
console.log("Connecting to database:", connectionString);

if (!connectionString) {
  console.error("❌ Database URL is missing! Check .env or .env.test.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://mealmatchdb_user:iDYHkyHKJ5ndA1ulAASzICh9a2Y4vO1u@dpg-cvcqf12n91rc73cs6110-a.oregon-postgres.render.com/mealmatchdb",
  ssl: {
    rejectUnauthorized: false,  // This is necessary for PostgreSQL hosted on platforms like Heroku or Render
  },
});
// Test the database connection
pool.connect()
  .then(() => {
    console.log(`✅ Connected to PostgreSQL (${process.env.NODE_ENV})`);
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
    console.error("Stack trace:", err.stack); // Detailed error stack for debugging
    process.exit(1);  // Exit the process if the database connection fails
  });

module.exports = pool;


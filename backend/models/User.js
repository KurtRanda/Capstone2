const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  // ✅ Fetch all users
  static async getAllUsers() {
    const result = await pool.query("SELECT id, username, email FROM users");
    return result.rows;
  }

  // ✅ Create a new user
  static async createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );
    return result.rows[0];
  }
}

module.exports = User;

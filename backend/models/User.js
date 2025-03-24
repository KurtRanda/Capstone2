const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  // ✅ **Fetch all users (no passwords returned)**
  static async getAllUsers() {
    const result = await pool.query("SELECT id, email, role FROM users");
    return result.rows;
  }

  // ✅ **Find user by email (Prevent duplicate signups)**
  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // ✅ **Create a new user (with password hashing)**
  static async createUser(email, password, role = "user") {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, hashedPassword, role]
    );
    return result.rows[0];
  }

  // ✅ **Verify Password**
  static async verifyPassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }
}

module.exports = User;


const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

// **🔒 Secure Password Validation**
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[\W_]/.test(password);

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
    );
};

// **🔒 Secure User Signup**
// Signup Route
router.post("/signup", async (req, res) => {
    const { email, password, role = "user" } = req.body;

    try {
        // Check if user already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Validate password strength
        if (!validatePassword(password)) {
            return res.status(400).json({
                error: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
            });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role",
            [email, hashedPassword, role]
        );

        // Generate token
        const token = jwt.sign(
            { id: result.rows[0].id, email: result.rows[0].email, role: result.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        console.log("🟢 Token generated successfully:", token);
        console.log("Generated Token:", token); // Debug log to confirm token generation
        res.status(201).json({ message: "User created", token });

    } catch (err) {
        console.error("❌ Signup Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// **🔒 Secure User Login**
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // ✅ Secure password comparison
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // ✅ Generate token securely
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        // ✅ Send token securely (do NOT log it!)
        res.cookie("token", token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", // ✅ Secure cookies in production
            sameSite: "Strict" 
        });

        res.json({ message: "Login successful", user: { id: user.id, email: user.email, role: user.role } });

    } catch (err) {
        console.error("❌ Login Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// **🔒 Secure User Logout**
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

module.exports = router;

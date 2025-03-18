const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "mysecret";

// **User Signup with Role Assignment**
router.post("/signup", async (req, res) => {
    const { email, password, role = "user" } = req.body;  // Default role is "user"
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
            [ email, hashedPassword, role]
        );
        res.status(201).json({ message: "User created", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// **User Login**
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log("🔍 Received login request for:", email);

        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ User found:", user);

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Password does not match");
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log("✅ Password is correct");

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        console.log("✅ Token generated:", token);

        res.cookie("token", token, { httpOnly: true, secure: false }); // Send cookie
        res.json({ message: "Login successful", token, user: { id: user.id, username: user.username, role: user.role } });

    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ error: err.message });
    }
});


// **User Logout**
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});


module.exports = router;

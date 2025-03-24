const jwt = require("jsonwebtoken");
require("dotenv").config({ path: process.env.NODE_ENV === "test" ? "./backend/.env.test" : "./backend/.env" });

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("❌ JWT_SECRET is not defined. Check your .env or .env.test file.");
  process.exit(1);
}

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

    console.log("🟢 Incoming Token for Authorization:", token); // ✅ Debugging log

    if (!token) {
        console.error("❌ Access denied: No token provided.");
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);  // 🔥 FIXED: Now using JWT_SECRET
        console.log("✅ Verified User:", verified);
        req.user = verified; // Attach user data to request
        next();
    } catch (err) {
        console.error("❌ Invalid token:", err.message);
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = { authenticateToken };



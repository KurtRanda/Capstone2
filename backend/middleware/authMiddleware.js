const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

    console.log("🟢 Incoming Token for Authorization:", token); // ✅ Debugging log

    if (!token) {
        console.error("❌ Access denied: No token provided.");
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        console.log("✅ Verified User:", verified);
        req.user = verified; // Attach user data to request
        next();
    } catch (err) {
        console.error("❌ Invalid token:", err.message);
        res.status(401).json({ error: "Invalid token" });
    }
};


module.exports = { authenticateToken };



import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const payload = {
  id: "test-user-id",
  email: "test@example.com",
};

// Use your actual JWT secret or a fallback test secret
const secret = process.env.JWT_SECRET || "test-secret";

const token = jwt.sign(payload, secret, { expiresIn: "1h" });

console.log("Generated Test Token:", token);

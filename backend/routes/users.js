const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST a new user (Signup)
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = await User.createUser(email, password);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


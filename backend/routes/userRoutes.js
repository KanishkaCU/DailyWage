const express = require("express");
const User = require("../models/user");

const router = express.Router();

/* ============ SIGN UP ============ */
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required",
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const user = new User({
      username,
      email: email || "",   // ✅ safe default
      password,
    });

    await user.save();

    res.status(201).json({
      message: "Signup successful",
    });
  } catch (err) {
    console.error("SIGNUP ERROR 👉", err); // 🔥 THIS LINE
    res.status(500).json({
      message: err.message || "Signup failed",
    });
  }
});

/* ============ LOGIN ============ */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;

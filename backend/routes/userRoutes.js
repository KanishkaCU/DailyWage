const express = require("express");
const User = require("../models/user");

const router = express.Router();

/* ============ SIGN UP ============ */
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔥 Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    // 🔥 Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // 🔥 Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    res.status(201).json({
      message: "Signup successful",
    });

  } catch (err) {
    console.error("SIGNUP ERROR 👉", err);
    res.status(500).json({
      message: err.message || "Signup failed",
    });
  }
});

/* ============ LOGIN ============ */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required",
      });
    }

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    res.json({
      message: "Login successful",
      userId: user._id,
      username: user.username,
    });

  } catch (err) {
    console.error("LOGIN ERROR 👉", err);
    res.status(500).json({
      message: "Login failed",
    });
  }
});

module.exports = router;
const express = require("express");
const User = require("../models/userlogin");

const router = express.Router();

// ======================
// SIGN UP (store data from frontend)
// ======================
router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      username,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

// ======================
// LOGIN (check DB data)
// ======================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// ======================
// GET ALL USERS (testing)
// ======================
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;

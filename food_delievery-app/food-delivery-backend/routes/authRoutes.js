const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    // Ensure database is connected (critical for serverless)
    await connectDB();
    
    // Check if mongoose is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not ready");
    }
    
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashed,
      phone: phone || "",
    });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key"
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    
    // Check if it's a database connection error
    if (error.message && (error.message.includes("MongoDB") || error.message.includes("buffering") || error.message.includes("connection"))) {
      res.status(503).json({
        success: false,
        message: "Database connection failed. Please try again later.",
        error: "Database unavailable"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to create user",
        error: error.message,
      });
    }
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Ensure database is connected (critical for serverless)
    await connectDB();
    
    // Check if mongoose is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not ready");
    }
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your-secret-key"
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    
    // Check if it's a database connection error
    if (error.message && (error.message.includes("MongoDB") || error.message.includes("buffering") || error.message.includes("connection"))) {
      res.status(503).json({
        success: false,
        message: "Database connection failed. Please try again later.",
        error: "Database unavailable"
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to login",
        error: error.message,
      });
    }
  }
});

module.exports = router;

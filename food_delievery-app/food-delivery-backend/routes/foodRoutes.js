const express = require("express");
const Food = require("../models/Food");
const connectDB = require("../config/db");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Ensure database is connected (important for serverless)
    await connectDB();
    
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    
    // Check if it's a database connection error
    if (error.message && error.message.includes("MongoDB")) {
      res.status(503).json({ 
        success: false,
        message: "Database connection failed. Please try again later.",
        error: "Database unavailable"
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch food items",
        error: error.message 
      });
    }
  }
});

module.exports = router;

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("../config/db");

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration - allow Vercel and localhost
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8081",
  "http://localhost:19006",
  "https://food-delivery-frontend.vercel.app", // Hardcoded frontend URL
  "https://your-frontend-app.vercel.app", // Replace with your actual Vercel frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins for now
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Serve static images
app.use("/images", express.static(path.join(__dirname, "../images")));

// Connect to database
connectDB().catch((err) => {
  console.error("Database connection error:", err);
});

// Routes
app.use("/api/auth", require("../routes/authRoutes"));
app.use("/api/foods", require("../routes/foodRoutes"));
app.use("/api/orders", require("../routes/orderRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Food Delivery API" });
});

// Export as serverless function for Vercel
module.exports = app;


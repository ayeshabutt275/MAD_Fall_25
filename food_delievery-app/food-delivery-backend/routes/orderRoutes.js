const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const connectDB = require("../config/db");
const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    // Ensure database is connected (critical for serverless)
    await connectDB();
    
    // Check if mongoose is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not ready");
    }
    
    const orderData = req.body;
    
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
    
    const order = new Order({
      ...orderData,
      orderNumber: orderNumber,
      orderDate: new Date(),
    });
    
    await order.save();
    
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        _id: order._id,
        id: order._id,
        orderNumber: order.orderNumber,
        ...order.toObject(),
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    
    // Check if it's a database connection error
    if (error.message && (error.message.includes("MongoDB") || error.message.includes("buffering") || error.message.includes("connection"))) {
      res.status(503).json({
        success: false,
        message: "Database connection failed. Please try again later.",
        error: "Database unavailable"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to place order",
        error: error.message,
      });
    }
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    // Ensure database is connected (critical for serverless)
    await connectDB();
    
    // Check if mongoose is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not ready");
    }
    
    const orders = await Order.find().sort({ orderDate: -1 });
    res.json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    
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
        message: "Failed to fetch orders",
        error: error.message,
      });
    }
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    // Ensure database is connected (critical for serverless)
    await connectDB();
    
    // Check if mongoose is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not ready");
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.json({
      success: true,
      order: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    
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
        message: "Failed to fetch order",
        error: error.message,
      });
    }
  }
});

// Update order status
router.patch("/:id/status", async (req, res) => {
  try {
    // Ensure database is connected (critical for serverless)
    await connectDB();
    
    // Check if mongoose is ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection not ready");
    }
    
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    res.json({
      success: true,
      message: "Order status updated",
      order: order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    
    // Check if it's a database connection error
    if (error.message && (error.message.includes("MongoDB") || error.message.includes("buffering") || error.message.includes("connection"))) {
      res.status(503).json({
        success: false,
        message: "Database connection failed. Please try again later.",
        error: "Database unavailable"
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Failed to update order status",
        error: error.message,
      });
    }
  }
});

module.exports = router;

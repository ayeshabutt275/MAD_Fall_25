const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Return cached connection if available (for serverless)
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    // Note: useNewUrlParser and useUnifiedTopology are deprecated in MongoDB driver v6+
    // They are now the default behavior and should not be specified
    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000, // Connection timeout
    };

    const connection = await mongoose.connect(mongoUri, options);
    
    cachedConnection = connection;
    console.log("MongoDB Connected - Ready State:", mongoose.connection.readyState);
    
    // Handle connection errors
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      cachedConnection = null;
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      cachedConnection = null;
    });

    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    cachedConnection = null;
    throw error;
  }
};

module.exports = connectDB;

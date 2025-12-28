// API Configuration
// Backend URL: https://food-delievery-app-alpha.vercel.app

import { Platform } from "react-native";

// Production Backend URL
// Note: Make sure this URL is accessible and backend is deployed
const PRODUCTION_API_URL = "https://food-delievery-app-alpha.vercel.app/api";

// Local Development URLs
const LOCAL_IP = "192.168.0.126"; // Update this with your computer's IP for local testing

// Auto-detect URL based on platform and environment
const getBaseURL = () => {
  // Use environment variable if set (for production builds)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  // For production/web - use Vercel backend
  if (Platform.OS === "web") {
    // Check if running in production or development
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      return PRODUCTION_API_URL;
    }
    // Development - use localhost
    return "http://localhost:5000/api";
  }
  
  // For Android - use production URL by default
  if (Platform.OS === "android") {
    // For production APK, use Vercel backend
    // For local testing, uncomment and use local IP
    return PRODUCTION_API_URL;
    // return `http://${LOCAL_IP}:5000/api`; // For local testing
    // return "http://10.0.2.2:5000/api"; // For Android emulator
  }
  
  // For iOS - use production URL by default
  // For production build, use Vercel backend
  // For local testing, uncomment and use local IP
  return PRODUCTION_API_URL;
  // return `http://${LOCAL_IP}:5000/api`; // For local testing
  // return "http://localhost:5000/api"; // For iOS simulator
};

export const API_BASE_URL = getBaseURL();

// Get the base URL without /api for images
export const getImageBaseURL = () => {
  const baseUrl = getBaseURL();
  // Remove /api from the end
  return baseUrl.replace("/api", "");
};

export const ENDPOINTS = {
  FOODS: "/foods",
  AUTH: "/auth",
  ORDERS: "/orders",
};


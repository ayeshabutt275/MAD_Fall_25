import React, { createContext, useState, useEffect, ReactNode } from "react";
import { API_BASE_URL, ENDPOINTS } from "../config/api";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = React.useRef(false);

  // Load user from storage on app start (only once)
  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadUser();
      hasLoadedRef.current = true;
    }
  }, []);

  // Re-check auth state when token or user changes
  useEffect(() => {
    // This ensures isAuthenticated is recalculated when state changes
    console.log("Auth state changed - user:", user ? "exists" : "null", "token:", token ? "exists" : "null");
  }, [user, token]);

  const loadUser = async () => {
    try {
      // Try localStorage first (for web)
      if (typeof window !== "undefined" && window.localStorage) {
        const storedToken = window.localStorage.getItem("token");
        const storedUser = window.localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const url = `${API_BASE_URL}${ENDPOINTS.AUTH}/login`;
      console.log("Login URL:", url);
      console.log("API_BASE_URL:", API_BASE_URL);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        const text = await response.text();
        console.log("Login response status:", response.status);
        console.log("Login response text:", text);
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw new Error("Server se invalid response mila. Backend check karein ya internet connection verify karein.");
      }

      console.log("Login response data:", data);

      if (!response.ok) {
        const errorMsg = data.message || `Login failed (Status: ${response.status})`;
        console.error("Login failed:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!data.success) {
        const errorMsg = data.message || "Invalid email ya password. Please try again.";
        console.error("Login not successful:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!data.token || !data.user) {
        console.error("Missing token or user in response:", data);
        throw new Error("Server se incomplete data mila. Please try again.");
      }

      setToken(data.token);
      setUser(data.user);

      // Store in localStorage (works for web) or AsyncStorage (for mobile)
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      console.log("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof TypeError) {
        if (error.message.includes("fetch") || error.message.includes("Network")) {
          throw new Error("Internet connection nahi hai ya server reachable nahi hai. Internet check karein aur phir try karein.");
        }
        throw new Error("Network error: " + error.message);
      }
      // Re-throw the error with the message
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const url = `${API_BASE_URL}${ENDPOINTS.AUTH}/signup`;
      console.log("Signup URL:", url);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      let data;
      try {
        const text = await response.text();
        console.log("Signup response text:", text);
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw new Error("Invalid response from server. Please check if backend is running.");
      }

      console.log("Signup response data:", data);

      if (!response.ok) {
        const errorMsg = data.message || `Signup failed (${response.status})`;
        console.error("Signup failed:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!data.success) {
        const errorMsg = data.message || "Signup failed";
        console.error("Signup not successful:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!data.token || !data.user) {
        console.error("Missing token or user in response:", data);
        throw new Error("Invalid response: missing token or user data");
      }

      setToken(data.token);
      setUser(data.user);

      // Store in localStorage (works for web) or AsyncStorage (for mobile)
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      console.log("Signup successful");
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Cannot connect to server. Please check if backend is running on port 5000.");
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      console.log("Current state - user:", user ? "exists" : "null", "token:", token ? "exists" : "null");
      
      // Clear storage first - use both removeItem and clear to be sure
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
        // Double check - verify they're actually removed
        const checkToken = window.localStorage.getItem("token");
        const checkUser = window.localStorage.getItem("user");
        if (checkToken || checkUser) {
          console.warn("localStorage items still exist, forcing clear");
          window.localStorage.clear();
        }
        console.log("localStorage cleared - verified");
      }
      
      // Clear state immediately - this will trigger re-render
      setToken(null);
      setUser(null);
      
      // Mark as loaded to prevent reload
      hasLoadedRef.current = true;
      
      // Wait to ensure React state updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("Logout successful - state cleared");
      console.log("After logout - user:", null, "token:", null);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, clear the state
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
      }
      setToken(null);
      setUser(null);
      hasLoadedRef.current = true;
    }
  };

  // Calculate isAuthenticated based on current state
  const isAuthenticated = !!(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


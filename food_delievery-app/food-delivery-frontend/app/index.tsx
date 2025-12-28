import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading) {
      // Small delay to ensure state is properly updated
      const timer = setTimeout(() => {
        console.log("Index screen - isAuthenticated:", isAuthenticated, "isLoading:", isLoading);
        if (isAuthenticated) {
          // User is logged in, go to home
          console.log("User authenticated, going to home");
          router.replace("/(tabs)");
        } else {
          // User is not logged in, go to login
          console.log("User not authenticated, going to login");
          router.replace("/login");
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading]);

  // Show loading screen while checking auth status
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF6B35" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});


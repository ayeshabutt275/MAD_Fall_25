import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ExploreScreen() {
  const router = useRouter();

  const categories = [
    { name: "Pizza", icon: "pizza", color: "#FF6B35" },
    { name: "Burger", icon: "fast-food", color: "#FFB800" },
    { name: "Roll", icon: "restaurant", color: "#4CAF50" },
    { name: "Wrap", icon: "layers", color: "#2196F3" },
    { name: "Fries", icon: "nutrition", color: "#FF9800" },
    { name: "Dessert", icon: "ice-cream", color: "#E91E63" },
    { name: "Drink", icon: "water", color: "#00BCD4" },
  ];

  const features = [
    {
      title: "Fast Delivery",
      description: "Get your food delivered in 30 minutes",
      icon: "flash",
      color: "#FF6B35",
    },
    {
      title: "Fresh Food",
      description: "100% fresh ingredients",
      icon: "leaf",
      color: "#4CAF50",
    },
    {
      title: "Best Prices",
      description: "Affordable prices for everyone",
      icon: "pricetag",
      color: "#2196F3",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Discover amazing food</Text>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={styles.categoryCard}
              onPress={() => {
                router.push({
                  pathname: "/(tabs)/",
                  params: { category: category.name },
                });
              }}
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                <Ionicons name={category.icon as any} size={32} color={category.color} />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={[styles.featureIcon, { backgroundColor: `${feature.color}20` }]}>
              <Ionicons name={feature.icon as any} size={28} color={feature.color} />
            </View>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Contact Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactItem}>
            <Ionicons name="call" size={20} color="#FF6B35" />
            <Text style={styles.contactText}>+92 XXX-XXXXXXX</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color="#FF6B35" />
            <Text style={styles.contactText}>support@fooddelivery.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="time" size={20} color="#FF6B35" />
            <Text style={styles.contactText}>24/7 Available</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginTop: 16,
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: "30%",
    alignItems: "center",
    marginBottom: 20,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
  },
  contactCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
});

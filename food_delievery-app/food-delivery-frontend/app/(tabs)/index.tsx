import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { CartContext } from "../../context/CartContext";
import { API_BASE_URL, ENDPOINTS, getImageBaseURL } from "../../config/api";

type FoodItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
};

const categories = ["All", "Pizza", "Burger", "Roll", "Wrap", "Fries", "Dessert", "Drink"];

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToCart, getTotalItems } = useContext(CartContext);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    (params.category as string) || "All"
  );

  useEffect(() => {
    fetchFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [searchQuery, selectedCategory, foods]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.FOODS}`);
      // Fix image URLs to use current API base URL
      const imageBaseURL = getImageBaseURL();
      const foodsWithFixedImages = response.data.map((food: FoodItem) => {
        let imageUrl = food.image || "";
        const originalUrl = imageUrl;
        
        // If image is a full URL, replace the domain with current base URL
        if (imageUrl.includes("http://") || imageUrl.includes("https://")) {
          // Extract the path part (e.g., /images/bbq_chicken_pizza.jpg)
          const urlParts = imageUrl.split("/");
          const pathIndex = urlParts.findIndex(part => part === "images");
          if (pathIndex !== -1) {
            const imagePath = "/" + urlParts.slice(pathIndex).join("/");
            imageUrl = `${imageBaseURL}${imagePath}`;
          } else {
            // Fallback: replace domain
            imageUrl = imageUrl.replace(/https?:\/\/[^/]+/, imageBaseURL);
          }
        } else {
          // Relative path - add base URL
          imageUrl = `${imageBaseURL}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
        }
        
        return {
          ...food,
          image: imageUrl,
        };
      });
      setFoods(foodsWithFixedImages);
      setFilteredFoods(foodsWithFixedImages);
    } catch (error) {
      console.error("Error fetching foods:", error);
      // For development, use mock data if API fails
      setFoods([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFoods();
  };

  const filterFoods = () => {
    let filtered = foods;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(food => food.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredFoods(filtered);
  };

  const handleAddToCart = (item: FoodItem) => {
    addToCart({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
    });
  };

  const cartItemsCount = getTotalItems();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Loading delicious food...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello! 👋</Text>
          <Text style={styles.headerTitle}>What would you like to eat?</Text>
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="cart" size={24} color="#fff" />
          {cartItemsCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for food..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Food Items */}
        {filteredFoods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No food items found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? "Try a different search" : "Check back later"}
            </Text>
          </View>
        ) : (
          <View style={styles.foodGrid}>
            {filteredFoods.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.foodCard}
                onPress={() => {
                  router.push({
                    pathname: "/food-details",
                    params: { item: JSON.stringify(item) },
                  });
                }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.foodImage}
                  contentFit="cover"
                  transition={200}
                  placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                  onError={(error) => {
                    console.log("Image load error for:", item.name);
                    console.log("Failed URL:", item.image);
                  }}
                />
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.foodCategory}>{item.category}</Text>
                  <View style={styles.foodFooter}>
                    <Text style={styles.foodPrice}>Rs {item.price}</Text>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => handleAddToCart(item)}
                    >
                      <Ionicons name="add" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  greeting: {
    fontSize: 16,
    color: "#666",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  cartButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF3D00",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  categoryChipActive: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  categoryTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  foodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    justifyContent: "space-between",
  },
  foodCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: "100%",
    height: 150,
    backgroundColor: "#f0f0f0",
  },
  foodInfo: {
    padding: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  foodCategory: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  foodFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
});

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { CartContext } from "../context/CartContext";
import { getImageBaseURL } from "../config/api";

export default function FoodDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToCart, getTotalItems } = useContext(CartContext);
  
  // Parse the food item from params
  const foodItem = params.item ? JSON.parse(params.item as string) : null;
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!foodItem) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)");
              }
            }} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>Food item not found</Text>
          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.backHomeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleAddToCart = () => {
    setLoading(true);
    // Add item multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        _id: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        image: foodItem.image,
        category: foodItem.category,
      });
    }
    setLoading(false);
    
    // Show success feedback
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(tabs)");
      }
    }, 300);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const totalPrice = foodItem.price * quantity;

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          }} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Details</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push("/cart")}
        >
          <Ionicons name="cart" size={24} color="#fff" />
          {getTotalItems() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Food Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: foodItem.image }}
            style={styles.foodImage}
            contentFit="cover"
            transition={200}
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
          />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{foodItem.category}</Text>
          </View>
        </View>

        {/* Food Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.foodName}>{foodItem.name}</Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>Rs {foodItem.price}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={18} color="#FFB800" />
              <Text style={styles.rating}>4.5</Text>
              <Text style={styles.reviews}>(120 reviews)</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {foodItem.category === "Pizza" && 
                "Delicious pizza made with fresh ingredients, premium cheese, and our signature sauce. Perfectly baked to golden perfection."}
              {foodItem.category === "Burger" && 
                "Juicy burger with fresh vegetables, premium patty, and special sauce. Served with crispy fries."}
              {foodItem.category === "Roll" && 
                "Freshly made roll with tender meat, vegetables, and our special spices. Wrapped in soft paratha."}
              {foodItem.category === "Wrap" && 
                "Healthy wrap filled with fresh ingredients, tender meat, and flavorful sauces."}
              {foodItem.category === "Fries" && 
                "Crispy golden fries, perfectly seasoned and served hot. Made from premium potatoes."}
              {foodItem.category === "Dessert" && 
                "Sweet and delicious dessert made with premium ingredients. Perfect way to end your meal."}
              {foodItem.category === "Drink" && 
                "Refreshing drink to quench your thirst. Available in various flavors."}
              {!foodItem.category && 
                "Delicious food item made with fresh ingredients and premium quality."}
            </Text>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Ingredients</Text>
            <View style={styles.ingredientsList}>
              {foodItem.category === "Pizza" && (
                <>
                  <View style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.ingredientText}>Fresh Dough</Text>
                  </View>
                  <View style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.ingredientText}>Premium Cheese</Text>
                  </View>
                  <View style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.ingredientText}>Fresh Vegetables</Text>
                  </View>
                </>
              )}
              {foodItem.category === "Burger" && (
                <>
                  <View style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.ingredientText}>Premium Patty</Text>
                  </View>
                  <View style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.ingredientText}>Fresh Lettuce</Text>
                  </View>
                  <View style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.ingredientText}>Special Sauce</Text>
                  </View>
                </>
              )}
              {(!foodItem.category || (foodItem.category !== "Pizza" && foodItem.category !== "Burger")) && (
                <>
                  <View style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.ingredientText}>Fresh Ingredients</Text>
                  </View>
                  <View style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.ingredientText}>Premium Quality</Text>
                  </View>
                  <View style={styles.ingredientItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                    <Text style={styles.ingredientText}>No Preservatives</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Nutrition Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nutritional Info</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>250-350</Text>
                <Text style={styles.nutritionLabel}>Calories</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>15-20g</Text>
                <Text style={styles.nutritionLabel}>Protein</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>30-40g</Text>
                <Text style={styles.nutritionLabel}>Carbs</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionValue}>10-15g</Text>
                <Text style={styles.nutritionLabel}>Fat</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={[styles.quantityButton, quantity === 1 && styles.quantityButtonDisabled]}
            onPress={decreaseQuantity}
            disabled={quantity === 1}
          >
            <Ionicons
              name="remove"
              size={20}
              color={quantity === 1 ? "#ccc" : "#FF6B35"}
            />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={increaseQuantity}
          >
            <Ionicons name="add" size={20} color="#FF6B35" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.addToCartButtonText}>
                Add to Cart • Rs {totalPrice}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginLeft: 16,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  imageContainer: {
    position: "relative",
    height: 300,
    backgroundColor: "#f0f0f0",
  },
  foodImage: {
    width: "100%",
    height: "100%",
  },
  categoryBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 20,
  },
  foodName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: "#999",
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: "#666",
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  nutritionItem: {
    width: "45%",
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B35",
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 14,
    color: "#666",
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 16,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    minWidth: 40,
    textAlign: "center",
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  backHomeButton: {
    marginTop: 24,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  backHomeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});


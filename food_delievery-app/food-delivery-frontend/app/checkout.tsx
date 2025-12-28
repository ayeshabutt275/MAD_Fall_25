import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { API_BASE_URL, ENDPOINTS } from "../config/api";

export default function Checkout() {
  const router = useRouter();
  const { cart, getTotalPrice, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cash",
  });

  const subtotal = getTotalPrice();
  const deliveryFee = 100;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (!formData.address.trim()) {
      Alert.alert("Error", "Please enter your address");
      return;
    }
    if (!formData.city.trim()) {
      Alert.alert("Error", "Please enter your city");
      return;
    }

    // Check if cart is empty
    if (cart.length === 0) {
      Alert.alert("Error", "Your cart is empty. Please add items to cart first.");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          _id: item._id || item.name,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
        })),
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        address: `${formData.address.trim()}, ${formData.city.trim()}`,
        totalAmount: total,
        paymentMethod: formData.paymentMethod,
        status: "pending",
      };

      console.log("Placing order:", orderData);

      const response = await axios.post(
        `${API_BASE_URL}${ENDPOINTS.ORDERS}`,
        orderData
      );

      console.log("Order response:", response.data);

      if (response.data.success) {
        // Show success message with order details
        const orderId = response.data?.order?._id || response.data?.order?.id || "N/A";
        const orderNumber = response.data?.order?.orderNumber || orderId;
        
        Alert.alert(
          "Order Placed Successfully! 🎉",
          `Thank you for your order!\n\n` +
          `Order Total: Rs ${total}\n` +
          `Order Number: ${orderNumber}\n\n` +
          `We'll contact you soon for confirmation. Your order will be delivered to:\n${formData.address}, ${formData.city}`,
          [
            {
              text: "View Orders",
              onPress: () => {
                clearCart();
                router.replace("/orders");
              },
            },
            {
              text: "Continue Shopping",
              style: "cancel",
              onPress: () => {
                clearCart();
                router.replace("/(tabs)");
              },
            },
          ]
        );
      } else {
        throw new Error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      let errorMessage = "Failed to place order. Please check your connection and try again.";
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/cart");
            }
          }} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Delivery Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="03XX-XXXXXXX"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="House/Street address"
              multiline
              numberOfLines={3}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your city"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity
            style={[
              styles.paymentOption,
              formData.paymentMethod === "cash" && styles.paymentOptionActive,
            ]}
            onPress={() => setFormData({ ...formData, paymentMethod: "cash" })}
          >
            <Ionicons
              name="cash-outline"
              size={24}
              color={formData.paymentMethod === "cash" ? "#FF6B35" : "#666"}
            />
            <Text
              style={[
                styles.paymentText,
                formData.paymentMethod === "cash" && styles.paymentTextActive,
              ]}
            >
              Cash on Delivery
            </Text>
            {formData.paymentMethod === "cash" && (
              <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              formData.paymentMethod === "card" && styles.paymentOptionActive,
            ]}
            onPress={() => setFormData({ ...formData, paymentMethod: "card" })}
          >
            <Ionicons
              name="card-outline"
              size={24}
              color={formData.paymentMethod === "card" ? "#FF6B35" : "#666"}
            />
            <Text
              style={[
                styles.paymentText,
                formData.paymentMethod === "card" && styles.paymentTextActive,
              ]}
            >
              Credit/Debit Card
            </Text>
            {formData.paymentMethod === "card" && (
              <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
            )}
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.map((item, index) => {
            const itemId = item._id || item.name;
            return (
              <View key={`${itemId}-${index}`} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName}>{item.name}</Text>
                  <Text style={styles.orderItemQuantity}>
                    Qty: {item.quantity} × Rs {item.price}
                  </Text>
                </View>
                <Text style={styles.orderItemPrice}>
                  Rs {item.price * item.quantity}
                </Text>
              </View>
            );
          })}

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>Rs {subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>Rs {deliveryFee}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs {total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total Amount</Text>
          <Text style={styles.footerTotalValue}>Rs {total}</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.placeOrderButtonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  paymentOptionActive: {
    borderColor: "#FF6B35",
    backgroundColor: "#fff5f2",
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    color: "#666",
    marginLeft: 12,
  },
  paymentTextActive: {
    color: "#FF6B35",
    fontWeight: "600",
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  orderItemQuantity: {
    fontSize: 14,
    color: "#999",
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  footerTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  footerTotalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  footerTotalValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  placeOrderButton: {
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  placeOrderButtonDisabled: {
    opacity: 0.6,
  },
  placeOrderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
});

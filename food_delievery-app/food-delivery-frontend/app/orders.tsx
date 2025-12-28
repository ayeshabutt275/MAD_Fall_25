import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

type Order = {
  id: string;
  orderNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  total: number;
  status: "pending" | "preparing" | "on-the-way" | "delivered" | "cancelled";
  address: string;
};

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "#ORD-001",
    date: "2024-01-15",
    items: [
      { name: "BBQ Chicken Pizza", quantity: 1, price: 1200 },
      { name: "Beef Burger", quantity: 2, price: 450 },
    ],
    total: 2100,
    status: "delivered",
    address: "123 Main Street, City",
  },
  {
    id: "2",
    orderNumber: "#ORD-002",
    date: "2024-01-14",
    items: [
      { name: "Chicken Shawarma", quantity: 2, price: 350 },
      { name: "French Fries (Large)", quantity: 1, price: 250 },
    ],
    total: 950,
    status: "on-the-way",
    address: "456 Park Avenue, City",
  },
  {
    id: "3",
    orderNumber: "#ORD-003",
    date: "2024-01-13",
    items: [
      { name: "Zinger Burger", quantity: 1, price: 550 },
      { name: "Soft Drink", quantity: 2, price: 120 },
    ],
    total: 790,
    status: "preparing",
    address: "789 Oak Street, City",
  },
];

export default function Orders() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [orders] = useState<Order[]>(mockOrders);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "#FFB800";
      case "preparing":
        return "#2196F3";
      case "on-the-way":
        return "#FF6B35";
      case "delivered":
        return "#4CAF50";
      case "cancelled":
        return "#ff4444";
      default:
        return "#999";
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "time-outline";
      case "preparing":
        return "restaurant-outline";
      case "on-the-way":
        return "bicycle-outline";
      case "delivered":
        return "checkmark-circle-outline";
      case "cancelled":
        return "close-circle-outline";
      default:
        return "ellipse-outline";
    }
  };

  const filteredOrders =
    selectedFilter === "all"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  return (
    <View style={styles.container}>
      {/* Header */}
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
        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {["all", "pending", "preparing", "on-the-way", "delivered"].map(
          (filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter && styles.filterTextActive,
                ]}
              >
                {filter === "all"
                  ? "All"
                  : filter
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      {/* Orders List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No orders found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === "all"
                ? "You haven't placed any orders yet"
                : `No ${selectedFilter} orders`}
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              {/* Order Header */}
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                  <Text style={styles.orderDate}>
                    {new Date(order.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(order.status)}20` },
                  ]}
                >
                  <Ionicons
                    name={getStatusIcon(order.status) as any}
                    size={16}
                    color={getStatusColor(order.status)}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(order.status) },
                    ]}
                  >
                    {order.status
                      .split("-")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </Text>
                </View>
              </View>

              {/* Order Items */}
              <View style={styles.orderItems}>
                {order.items.map((item, index) => (
                  <View key={index} style={styles.orderItem}>
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
                ))}
              </View>

              {/* Order Footer */}
              <View style={styles.orderFooter}>
                <View style={styles.orderFooterLeft}>
                  <Ionicons name="location" size={16} color="#666" />
                  <Text style={styles.orderAddress} numberOfLines={1}>
                    {order.address}
                  </Text>
                </View>
                <View style={styles.orderTotal}>
                  <Text style={styles.orderTotalLabel}>Total:</Text>
                  <Text style={styles.orderTotalValue}>Rs {order.total}</Text>
                </View>
              </View>

              {/* Action Buttons */}
              {order.status === "delivered" && (
                <TouchableOpacity style={styles.reorderButton}>
                  <Ionicons name="repeat-outline" size={18} color="#FF6B35" />
                  <Text style={styles.reorderButtonText}>Reorder</Text>
                </TouchableOpacity>
              )}
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <TouchableOpacity style={styles.trackButton}>
                  <Ionicons name="navigate-outline" size={18} color="#fff" />
                  <Text style={styles.trackButtonText}>Track Order</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
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
  filtersContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: "#FF6B35",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  shopButton: {
    marginTop: 24,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  orderCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "#999",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderItems: {
    marginBottom: 16,
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
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginBottom: 12,
  },
  orderFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  orderAddress: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    flex: 1,
  },
  orderTotal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderTotalLabel: {
    fontSize: 16,
    color: "#666",
  },
  orderTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B35",
  },
  reorderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF6B35",
    gap: 8,
  },
  reorderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});


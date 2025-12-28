import React, { useContext } from "react";
import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const router = useRouter();
  const { cart } = useContext(CartContext);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Cart</Text>

      {cart.map((item, index) => (
        <Text key={index}>
          {item.name} - Rs {item.price}
        </Text>
      ))}

      <Button
        title="Checkout"
        onPress={() => router.push("/Checkout")}
      />
    </View>
  );
}
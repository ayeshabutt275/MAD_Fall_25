import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';
const API_URL = 'http://10.0.2.2:5000';

export default function CartScreen({ navigation }) {
  const [cart, setCart] = useState([]);

  const loadCart = () => {
    axios.get(`${API_URL}/api/cart/1`).then(res => setCart(res.data)).catch(console.error);
  };

  useEffect(() => { loadCart(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.product_name} - Rs. {item.price} x {item.quantity}</Text>
        )}
      />
      <Button title="Checkout" onPress={() => navigation.navigate('Checkout')} />
    </View>
  );
}
const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, title: { fontSize: 22, fontWeight: 'bold' } });

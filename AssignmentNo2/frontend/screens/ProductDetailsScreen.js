import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
const API_URL = 'http://10.0.2.2:5000';

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params;

  const addToCart = async () => {
    await axios.post(`${API_URL}/api/cart`, { user_id: 1, product_id: product.id, quantity: 1 });
    alert('Added to Cart!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text>{product.description}</Text>
      <Text style={styles.price}>Rs. {product.price}</Text>
      <Button title="Add to Cart" onPress={addToCart} />
      <Button title="Go to Cart" onPress={() => navigation.navigate('Cart')} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  price: { fontSize: 18, color: 'green', marginVertical: 10 },
});

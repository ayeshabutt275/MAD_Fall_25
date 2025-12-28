import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
const API_URL = 'http://10.0.2.2:5000/products';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(API_URL).then(res => setProducts(res.data)).catch(console.error);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Products</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>Rs. {item.price}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 18 },
  price: { fontSize: 16, color: 'green' },
});

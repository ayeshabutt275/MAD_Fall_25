import React from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';
const API_URL = 'http://10.0.2.2:5000';

export default function CheckoutScreen({ navigation }) {
  const handleCheckout = async () => {
    await axios.post(`${API_URL}/api/orders`, { user_id: 1, total_amount: 1200, status: 'Placed' });
    navigation.navigate('OrderConfirmation');
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Confirm Your Order</Text>
      <Button title="Place Order" onPress={handleCheckout} />
    </View>
  );
}

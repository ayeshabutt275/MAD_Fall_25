import React from 'react';
import { View, Text } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ fontSize:20 }}>👤 User Profile</Text>
      <Text>Name: Demo User</Text>
      <Text>Email: demo@example.com</Text>
    </View>
  );
}

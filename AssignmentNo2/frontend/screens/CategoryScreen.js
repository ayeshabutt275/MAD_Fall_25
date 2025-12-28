import React from 'react';
import { View, Text } from 'react-native';

export default function CategoryScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ fontSize:20 }}>📂 Categories</Text>
      <Text>Electronics | Fashion | Home | Sports</Text>
    </View>
  );
}

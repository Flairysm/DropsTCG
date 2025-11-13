import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AdminScreen from '../../features/admin/screens/admin.screen';

const Stack = createNativeStackNavigator();

export const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminMain" component={AdminScreen} />
    </Stack.Navigator>
  );
};


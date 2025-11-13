import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import VaultScreen from '../../features/vault/screens/vault.screen';

const Stack = createNativeStackNavigator();

export const VaultNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VaultMain" component={VaultScreen} />
    </Stack.Navigator>
  );
};


import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import ReloadScreen from '../../features/reload/screens/reload.screen';

const Stack = createNativeStackNavigator();

export const ReloadNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReloadMain" component={ReloadScreen} />
    </Stack.Navigator>
  );
};


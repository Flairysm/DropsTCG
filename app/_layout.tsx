import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './contexts/AuthContext';
import './globals.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#0a0019" />
        <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { 
              backgroundColor: '#0a0019',
              flex: 1,
              zIndex: 10,
              elevation: 10,
            }
          }} 
        />
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0019',
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import './globals.css';
import FlickeringParticles from './components/FlickeringParticles';

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  // Navbar height is 64 + bottom inset
  const navbarHeight = 64 + insets.bottom;

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#150133" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { 
            backgroundColor: '#150133',
            flex: 1
          }
        }} 
      />
      <View style={[styles.particlesContainer, { bottom: navbarHeight }]}>
        <FlickeringParticles
          particleCount={30}
          color="#87CEEB"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#150133',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
});

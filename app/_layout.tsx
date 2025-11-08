import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import './globals.css';
import FlickeringParticles from './components/FlickeringParticles';
import SplashScreenComponent from './components/SplashScreen';

export default function RootLayout() {
  const insets = useSafeAreaInsets();
  // Bottom navbar height is 64 + bottom inset
  const bottomNavbarHeight = 64 + insets.bottom;
  // Top navbar height: safe area top + 48px (8px extra padding + 28px logo + 12px padding bottom)
  const topNavbarHeight = insets.top + 48;

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0a0019" />
      <SplashScreenComponent />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { 
            backgroundColor: '#0a0019',
            flex: 1
          }
        }} 
      />
      <View style={[styles.particlesContainer, { top: topNavbarHeight, bottom: bottomNavbarHeight }]}>
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
    backgroundColor: '#0a0019',
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

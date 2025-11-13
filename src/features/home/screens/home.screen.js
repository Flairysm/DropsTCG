import React from 'react';
import {
  ScrollView as RNScrollView,
  StatusBar as RNStatusBar,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import WelcomeSection from '../components/WelcomeSection';
import FeaturedSection from '../components/FeaturedSection';
import RafflesSection from '../components/RafflesSection';
import RecentPulls from '../components/RecentPulls';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  z-index: 10;
  elevation: 10;
`;

const StyledScrollView = styled(RNScrollView)`
  flex: 1;
  z-index: 10;
  elevation: 10;
`;

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <Container edges={['left', 'right']}>
      {/* Expo StatusBar for iOS */}
      <StatusBar style="light" />
      {/* React Native StatusBar for Android */}
      {Platform.OS === 'android' && (
        <RNStatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.primary}
          translucent={false}
        />
      )}
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <WelcomeSection userName={undefined} />
        <FeaturedSection />
        <RafflesSection />
        <RecentPulls />
      </StyledScrollView>
    </Container>
  );
}

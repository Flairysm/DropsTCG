import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Platform,
    ScrollView as RNScrollView,
    StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import { useAuth } from '../../../services/authentication/authentication.context';
import FeaturedSection from '../components/FeaturedSection';
import RafflesSection from '../components/RafflesSection';
import RecentPulls from '../components/RecentPulls';
import WelcomeSection from '../components/WelcomeSection';

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
  const { user } = useAuth();
  
  // Get username from user object
  const username = user?.username || user?.email?.split('@')[0] || 'Player';

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
        <WelcomeSection userName={username} />
        <FeaturedSection />
        <RafflesSection />
        <RecentPulls />
      </StyledScrollView>
    </Container>
  );
}

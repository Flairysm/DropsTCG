import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView as RNScrollView,
  StatusBar as RNStatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import RafflesSection from '../../home/components/RafflesSection';
import GemDropsSection from '../components/GemDropsSection';
import MinigamesSection from '../components/MinigamesSection';
import MysteryBoxesSection from '../components/MysteryBoxesSection';
import VirtualBoosterPacksSection from '../components/VirtualBoosterPacksSection';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  z-index: 10;
  elevation: 10;
`;

const TabsContainer = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
  padding-vertical: 12px;
`;

const TabsScrollView = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
})``;

const Tab = styled(TouchableOpacity)`
  padding-horizontal: 20px;
  padding-vertical: 10px;
  margin-right: 8px;
  border-radius: 8px;
  background-color: transparent;
  border-width: 1px;
  border-color: ${(props) =>
    props.active ? props.theme.colors.accent : props.theme.colors.border};
  background-color: ${(props) =>
    props.active ? props.theme.colors.accent : 'transparent'};
`;

const TabText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) =>
    props.active
      ? props.theme.colors.primary
      : props.theme.colors.text};
  opacity: ${(props) => (props.active ? 1 : 0.7)};
`;

const ContentScrollView = styled(RNScrollView)`
  flex: 1;
  z-index: 10;
  elevation: 10;
`;

const PlaceholderContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 20px;
`;

const PlaceholderTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-top: 16px;
  margin-bottom: 8px;
`;

const PlaceholderText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.6;
  text-align: center;
`;

const categories = ['Pokemon', 'Sports', 'One Piece'];

export default function PlayScreen() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Pokemon');

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

      {/* Category Tabs */}
      <TabsContainer>
        <TabsScrollView>
          {categories.map((category) => (
            <Tab
              key={category}
              active={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <TabText active={selectedCategory === category}>
                {category}
              </TabText>
            </Tab>
          ))}
        </TabsScrollView>
      </TabsContainer>

      {/* Content Area */}
      <ContentScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {selectedCategory === 'One Piece' ? (
          <PlaceholderContainer>
            <Ionicons name="hourglass-outline" size={64} color={theme.colors.accent} />
            <PlaceholderTitle>Coming Soon</PlaceholderTitle>
            <PlaceholderText>
              One Piece content will be available soon
            </PlaceholderText>
          </PlaceholderContainer>
        ) : (
          <>
            <RafflesSection />
            <GemDropsSection category={selectedCategory} />
            <MysteryBoxesSection category={selectedCategory} />
            <MinigamesSection category={selectedCategory} />
            <VirtualBoosterPacksSection category={selectedCategory} />
          </>
        )}
      </ContentScrollView>
    </Container>
  );
}

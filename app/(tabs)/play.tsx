import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RaffleEventsSection from '../components/RaffleEventsSection';
import MinigamesSection from '../components/MinigamesSection';
import GemDropsSection from '../components/GemDropsSection';
import MysteryBoxesSection from '../components/MysteryBoxesSection';
import VirtualBoosterPacksSection from '../components/VirtualBoosterPacksSection';

type GameCategory = 'Pokemon' | 'Sports' | 'One Piece';

export default function Play() {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('Pokemon');

  const categories: GameCategory[] = ['Pokemon', 'Sports', 'One Piece'];

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tab,
                selectedCategory === category && styles.tabActive
              ]}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedCategory === category && styles.tabTextActive
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Area */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {selectedCategory === 'One Piece' ? (
          <View style={styles.placeholderContainer}>
            <Ionicons name="hourglass-outline" size={64} color="#40ffdc" />
            <Text style={styles.placeholderTitle}>
              Coming Soon
            </Text>
            <Text style={styles.placeholderText}>
              One Piece content will be available soon
            </Text>
          </View>
        ) : (
          <>
            <RaffleEventsSection />
            {selectedCategory === 'Pokemon' && <MinigamesSection />}
            <GemDropsSection />
            <MysteryBoxesSection />
            {selectedCategory === 'Pokemon' && <VirtualBoosterPacksSection />}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0019',
  },
  tabsContainer: {
    backgroundColor: '#12042b',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
    paddingVertical: 12,
  },
  tabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  tabActive: {
    backgroundColor: '#40ffdc',
    borderColor: '#40ffdc',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.7,
  },
  tabTextActive: {
    color: '#0a0019',
    opacity: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
    padding: 20,
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.6,
    textAlign: 'center',
  },
});

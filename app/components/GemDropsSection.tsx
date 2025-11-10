import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GemDrop {
  id: string;
  name: string;
  description: string;
  price: number; // in tokens
  image?: string;
}

interface GemDropsSectionProps {
  drops?: GemDrop[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - CARD_MARGIN) / 1.5;

const GemDropsSection: React.FC<GemDropsSectionProps> = ({ drops }) => {
  const defaultDrops: GemDrop[] = [
    {
      id: '1',
      name: 'Premium Gem Drop',
      description: 'Exclusive rare gems',
      price: 500, // tokens
    },
    {
      id: '2',
      name: 'Standard Gem Drop',
      description: 'Quality gem collection',
      price: 300,
    },
    {
      id: '3',
      name: 'Starter Gem Drop',
      description: 'Perfect for beginners',
      price: 200,
    },
  ];

  const displayDrops = drops || defaultDrops;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.verticalBar} />
          <Text style={styles.sectionTitle}>GEM DROPS</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        contentContainerStyle={styles.carouselContent}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        {displayDrops.map((drop, index) => (
          <TouchableOpacity
            key={drop.id}
            style={[
              styles.dropCard,
              index === displayDrops.length - 1 && styles.lastCard
            ]}
          >
            {/* Drop Image Placeholder */}
            <View style={styles.dropImageContainer}>
              <Ionicons name="diamond" size={48} color="#40ffdc" />
              <Text style={styles.dropPlaceholderText}>{drop.name}</Text>
            </View>

            {/* Drop Info */}
            <View style={styles.dropInfo}>
              <Text style={styles.dropName} numberOfLines={2}>
                {drop.name}
              </Text>
              <Text style={styles.dropDescription} numberOfLines={2}>
                {drop.description}
              </Text>
              
              <View style={styles.priceContainer}>
                <Ionicons name="diamond" size={16} color="#40ffdc" />
                <Text style={styles.priceText}>
                  {drop.price.toLocaleString()} tokens
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 24,
    position: 'relative',
  },
  header: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalBar: {
    width: 4,
    height: 24,
    backgroundColor: '#40ffdc',
    marginRight: 12,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  carousel: {
    marginBottom: 16,
  },
  carouselContent: {
    paddingLeft: HORIZONTAL_PADDING,
    paddingRight: HORIZONTAL_PADDING,
  },
  dropCard: {
    width: CARD_WIDTH,
    backgroundColor: '#12042b',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: CARD_MARGIN,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    position: 'relative',
    zIndex: 10,
    elevation: 10,
  },
  lastCard: {
    marginRight: HORIZONTAL_PADDING,
  },
  dropImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropPlaceholderText: {
    color: '#40ffdc',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  dropInfo: {
    padding: 16,
  },
  dropName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  dropDescription: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 12,
    minHeight: 32,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 6,
  },
});

export default GemDropsSection;


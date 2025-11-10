import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface GemDrop {
  id: string;
  name: string;
  gemType: string;
  description: string;
  price: number; // in tokens
  cardTierRange: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  color: string;
  remainingBoxes: number;
  totalBoxes: number;
}

interface GemDropsSectionProps {
  drops?: GemDrop[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - CARD_MARGIN) / 1.5;

const GemDropsSection: React.FC<GemDropsSectionProps> = ({ drops }) => {
  const router = useRouter();
  
  const defaultDrops: GemDrop[] = [
    {
      id: 'diamond',
      name: 'Diamond Drops',
      gemType: 'Diamond',
      description: 'Mid-range cards with guaranteed chase cards',
      price: 1000,
      cardTierRange: 'B-S',
      rarity: 'common',
      icon: 'diamond',
      color: '#B9F2FF',
      remainingBoxes: 756,
      totalBoxes: 1000,
    },
    {
      id: 'emerald',
      name: 'Emerald Drops',
      gemType: 'Emerald',
      description: 'Higher tier cards with increased chances',
      price: 2000,
      cardTierRange: 'A-SS',
      rarity: 'uncommon',
      icon: 'leaf',
      color: '#50C878',
      remainingBoxes: 342,
      totalBoxes: 500,
    },
    {
      id: 'ruby',
      name: 'Ruby Drops',
      gemType: 'Ruby',
      description: 'Premium cards with guaranteed high-tier pulls',
      price: 5000,
      cardTierRange: 'S-SS',
      rarity: 'rare',
      icon: 'flame',
      color: '#E0115F',
      remainingBoxes: 89,
      totalBoxes: 200,
    },
    {
      id: 'sapphire',
      name: 'Sapphire Drops',
      gemType: 'Sapphire',
      description: 'Ultra-premium drops with finest cards',
      price: 7500,
      cardTierRange: 'SS-SSS',
      rarity: 'epic',
      icon: 'water',
      color: '#0F52BA',
      remainingBoxes: 45,
      totalBoxes: 150,
    },
    {
      id: 'obsidian',
      name: 'Obsidian Drops',
      gemType: 'Obsidian',
      description: 'The ultimate gem drop - all premium chase cards',
      price: 10000,
      cardTierRange: 'SSS only',
      rarity: 'legendary',
      icon: 'moon',
      color: '#000000',
      remainingBoxes: 12,
      totalBoxes: 100,
    },
  ];

  const displayDrops = drops || defaultDrops;

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return '#40ffdc';
      case 'uncommon': return '#50C878';
      case 'rare': return '#E0115F';
      case 'epic': return '#0F52BA';
      case 'legendary': return '#FFD700';
      default: return '#40ffdc';
    }
  };

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
        {displayDrops.map((drop, index) => {
          const rarityColor = getRarityColor(drop.rarity);
          return (
            <TouchableOpacity
              key={drop.id}
              style={[
                styles.dropCard,
                index === displayDrops.length - 1 && styles.lastCard
              ]}
              onPress={() => router.push(`/pack-info?id=${drop.id}` as any)}
              activeOpacity={0.8}
            >
              {/* Gem Icon Header */}
              <View style={[styles.dropImageContainer, { backgroundColor: `${drop.color}20` }]}>
                <View style={[styles.gemIconContainer, { backgroundColor: drop.color }]}>
                  <Ionicons name={drop.icon as any} size={48} color="#ffffff" />
                </View>
                <View style={styles.rarityBadgeContainer}>
                  <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
                  <Text style={[styles.rarityText, { color: rarityColor }]}>
                    {drop.rarity.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Drop Info */}
              <View style={styles.dropInfo}>
                <Text style={styles.dropName} numberOfLines={1}>
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
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingBottom: 32,
    position: 'relative',
  },
  header: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  gemIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  rarityBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rarityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    marginBottom: 8,
    minHeight: 32,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 6,
  },
});

export default GemDropsSection;


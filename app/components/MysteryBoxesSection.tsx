import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface MysteryBox {
  id: string;
  name: string;
  theme: string;
  description: string;
  price: number; // in tokens
  cardTierRange: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  color: string;
  remainingBoxes: number;
  totalBoxes: number;
}

interface MysteryBoxesSectionProps {
  boxes?: MysteryBox[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - CARD_MARGIN) / 1.5;

const MysteryBoxesSection: React.FC<MysteryBoxesSectionProps> = ({ boxes }) => {
  const router = useRouter();
  
  const defaultBoxes: MysteryBox[] = [
    {
      id: 'charizard',
      name: 'Charizard Box',
      theme: 'Charizard',
      description: 'Every card features Charizard variants',
      price: 3000,
      cardTierRange: 'A-SS',
      rarity: 'rare',
      icon: 'flame',
      color: '#FF6B35',
      remainingBoxes: 234,
      totalBoxes: 500,
    },
    {
      id: 'pikachu',
      name: 'Pikachu Box',
      theme: 'Pikachu',
      description: 'All Pikachu-themed cards collection',
      price: 2500,
      cardTierRange: 'B-S',
      rarity: 'uncommon',
      icon: 'flash',
      color: '#FFD700',
      remainingBoxes: 456,
      totalBoxes: 750,
    },
    {
      id: 'eeveelution',
      name: 'Eeveelution Box',
      theme: 'Eeveelution',
      description: 'Complete Eeveelution evolution line',
      price: 4000,
      cardTierRange: 'S-SS',
      rarity: 'epic',
      icon: 'sparkles',
      color: '#9B59B6',
      remainingBoxes: 89,
      totalBoxes: 200,
    },
    {
      id: 'legendary',
      name: 'Legendary Box',
      theme: 'Legendary',
      description: 'Exclusive legendary Pokemon cards',
      price: 6000,
      cardTierRange: 'SS-SSS',
      rarity: 'legendary',
      icon: 'star',
      color: '#FFD700',
      remainingBoxes: 45,
      totalBoxes: 150,
    },
  ];

  const displayBoxes = boxes || defaultBoxes;

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
          <Text style={styles.sectionTitle}>MYSTERY BOXES</Text>
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
        {displayBoxes.map((box, index) => {
          const rarityColor = getRarityColor(box.rarity);
          return (
            <TouchableOpacity
              key={box.id}
              style={[
                styles.boxCard,
                index === displayBoxes.length - 1 && styles.lastCard
              ]}
              onPress={() => router.push(`/packs/pack-info?type=mystery-box&id=${box.id}` as any)}
              activeOpacity={0.8}
            >
              {/* Box Icon Header */}
              <View style={[styles.boxImageContainer, { backgroundColor: `${box.color}20` }]}>
                <View style={[styles.boxIconContainer, { backgroundColor: box.color }]}>
                  <Ionicons name={box.icon as any} size={48} color="#ffffff" />
                </View>
                <View style={styles.rarityBadgeContainer}>
                  <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
                  <Text style={[styles.rarityText, { color: rarityColor }]}>
                    {box.rarity.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Box Info */}
              <View style={styles.boxInfo}>
                <Text style={styles.boxName} numberOfLines={1}>
                  {box.name}
                </Text>
                <Text style={styles.boxDescription} numberOfLines={2}>
                  {box.description}
                </Text>
                
                <View style={styles.priceContainer}>
                  <Ionicons name="diamond" size={16} color="#40ffdc" />
                  <Text style={styles.priceText}>
                    {box.price.toLocaleString()} tokens
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
  boxCard: {
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
  boxImageContainer: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  boxIconContainer: {
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
  boxInfo: {
    padding: 16,
  },
  boxName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  boxDescription: {
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

export default MysteryBoxesSection;

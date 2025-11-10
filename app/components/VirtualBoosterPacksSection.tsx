import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BoosterPack {
  id: string;
  name: string;
  set: string;
  price: number; // in tokens
  image?: string;
  description?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon?: string;
  color?: string;
}

interface VirtualBoosterPacksSectionProps {
  packs?: BoosterPack[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - CARD_MARGIN) / 1.5;

const VirtualBoosterPacksSection: React.FC<VirtualBoosterPacksSectionProps> = ({ packs }) => {
  const router = useRouter();
  
  const defaultPacks: BoosterPack[] = [
    {
      id: 'evolving-skies',
      name: 'Evolving Skies',
      set: 'Evolving Skies',
      price: 2000,
      description: 'Featuring powerful Eeveelution VMAX cards and stunning alternate art cards',
      rarity: 'epic',
      icon: 'sparkles',
      color: '#6B46C1',
    },
    {
      id: 'mega-inferno-x',
      name: 'Mega Inferno X',
      set: 'Mega Inferno X',
      price: 2500,
      description: 'Fire-type Pokemon collection with exclusive Mega Evolution cards',
      rarity: 'rare',
      icon: 'flame',
      color: '#FF6B35',
    },
    {
      id: 'base-set',
      name: 'Base Set',
      set: 'Base Set',
      price: 3000,
      description: 'The original Pokemon TCG set featuring classic cards',
      rarity: 'legendary',
      icon: 'star',
      color: '#FFD700',
    },
    {
      id: 'chilling-reign',
      name: 'Chilling Reign',
      set: 'Chilling Reign',
      price: 1800,
      description: 'Ice and water-type Pokemon with beautiful full-art cards',
      rarity: 'uncommon',
      icon: 'snow',
      color: '#3B82F6',
    },
  ];

  const displayPacks = packs || defaultPacks;

  const getRarityColor = (rarity?: string): string => {
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
          <Text style={styles.sectionTitle}>VIRTUAL BOOSTER PACKS</Text>
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
        {displayPacks.map((pack, index) => {
          const rarityColor = pack.rarity ? getRarityColor(pack.rarity) : '#40ffdc';
          return (
            <TouchableOpacity
              key={pack.id}
              style={[
                styles.packCard,
                index === displayPacks.length - 1 && styles.lastCard
              ]}
              onPress={() => router.push(`/pack-info?type=booster-pack&id=${pack.id}` as any)}
              activeOpacity={0.8}
            >
              {/* Pack Icon Header */}
              <View style={[styles.packImageContainer, { backgroundColor: pack.color ? `${pack.color}20` : '#1a0a3a' }]}>
                <View style={[styles.packIconContainer, { backgroundColor: pack.color || '#40ffdc' }]}>
                  <Ionicons name={(pack.icon || 'albums') as any} size={48} color="#ffffff" />
                </View>
                {pack.rarity && (
                  <View style={styles.rarityBadgeContainer}>
                    <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
                    <Text style={[styles.rarityText, { color: rarityColor }]}>
                      {pack.rarity.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Pack Info */}
              <View style={styles.packInfo}>
                <Text style={styles.packName} numberOfLines={1}>
                  {pack.name}
                </Text>
                <Text style={styles.packSet} numberOfLines={1}>
                  {pack.set}
                </Text>
                
                <View style={styles.priceContainer}>
                  <Ionicons name="diamond" size={16} color="#40ffdc" />
                  <Text style={styles.priceText}>
                    {pack.price.toLocaleString()} tokens
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
  packCard: {
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
  packImageContainer: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  packIconContainer: {
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
  packInfo: {
    padding: 16,
  },
  packName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  packSet: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 12,
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

export default VirtualBoosterPacksSection;


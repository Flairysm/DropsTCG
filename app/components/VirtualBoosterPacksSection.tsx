import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BoosterPack {
  id: string;
  name: string;
  set: string;
  price: number; // in tokens
  image?: string;
}

interface VirtualBoosterPacksSectionProps {
  packs?: BoosterPack[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - CARD_MARGIN) / 1.5;

const VirtualBoosterPacksSection: React.FC<VirtualBoosterPacksSectionProps> = ({ packs }) => {
  const defaultPacks: BoosterPack[] = [
    {
      id: '1',
      name: 'Base Set',
      set: 'Base Set',
      price: 1000, // tokens
    },
    {
      id: '2',
      name: 'Jungle Set',
      set: 'Jungle',
      price: 1200,
    },
    {
      id: '3',
      name: 'Fossil Set',
      set: 'Fossil',
      price: 1100,
    },
  ];

  const displayPacks = packs || defaultPacks;

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
        {displayPacks.map((pack, index) => (
          <TouchableOpacity
            key={pack.id}
            style={[
              styles.packCard,
              index === displayPacks.length - 1 && styles.lastCard
            ]}
          >
            {/* Pack Image Placeholder */}
            <View style={styles.packImageContainer}>
              <Ionicons name="albums" size={48} color="#40ffdc" />
              <Text style={styles.packPlaceholderText}>{pack.name}</Text>
            </View>

            {/* Pack Info */}
            <View style={styles.packInfo}>
              <Text style={styles.packName} numberOfLines={2}>
                {pack.name}
              </Text>
              <Text style={styles.packSet}>{pack.set}</Text>
              
              <View style={styles.priceContainer}>
                <Ionicons name="diamond" size={16} color="#40ffdc" />
                <Text style={styles.priceText}>
                  {pack.price.toLocaleString()} tokens
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
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  packPlaceholderText: {
    color: '#40ffdc',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
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


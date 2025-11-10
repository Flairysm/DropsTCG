import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MysteryBox {
  id: string;
  name: string;
  theme: string;
  price: number; // in tokens
  image?: string;
}

interface MysteryBoxesSectionProps {
  boxes?: MysteryBox[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - CARD_MARGIN) / 1.5;

const MysteryBoxesSection: React.FC<MysteryBoxesSectionProps> = ({ boxes }) => {
  const defaultBoxes: MysteryBox[] = [
    {
      id: '1',
      name: 'Charizard Box',
      theme: 'Charizard',
      price: 2000, // tokens
    },
    {
      id: '2',
      name: 'Eeveelution Box',
      theme: 'Eeveelution',
      price: 1800,
    },
    {
      id: '3',
      name: 'Trainer Box',
      theme: 'Trainer',
      price: 1500,
    },
  ];

  const displayBoxes = boxes || defaultBoxes;

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
        {displayBoxes.map((box, index) => (
          <TouchableOpacity
            key={box.id}
            style={[
              styles.boxCard,
              index === displayBoxes.length - 1 && styles.lastCard
            ]}
          >
            {/* Box Image Placeholder */}
            <View style={styles.boxImageContainer}>
              <Ionicons name="cube" size={48} color="#40ffdc" />
              <Text style={styles.boxPlaceholderText}>{box.name}</Text>
            </View>

            {/* Box Info */}
            <View style={styles.boxInfo}>
              <Text style={styles.boxName} numberOfLines={2}>
                {box.name}
              </Text>
              <Text style={styles.boxTheme}>{box.theme} Theme</Text>
              
              <View style={styles.priceContainer}>
                <Ionicons name="diamond" size={16} color="#40ffdc" />
                <Text style={styles.priceText}>
                  {box.price.toLocaleString()} tokens
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
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxPlaceholderText: {
    color: '#40ffdc',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
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
  boxTheme: {
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

export default MysteryBoxesSection;


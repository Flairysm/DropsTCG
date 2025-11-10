import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuickPlayOption {
  id: string;
  title: string;
  icon: string;
  description: string;
  route?: string; // Future navigation route
}

interface QuickPlaySectionProps {
  onPress?: (option: QuickPlayOption) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 12;
// Show 2 full cards per screen
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - CARD_MARGIN) / 2;

const QuickPlaySection: React.FC<QuickPlaySectionProps> = ({ onPress }) => {
  const quickPlayOptions: QuickPlayOption[] = [
    {
      id: 'minigames',
      title: 'Minigames',
      icon: 'game-controller',
      description: 'Play games to win prizes',
      route: '/(tabs)/play', // Will navigate to play tab or minigames section
    },
    {
      id: 'mystery-boxes',
      title: 'Mystery Boxes',
      icon: 'cube',
      description: 'Open themed mystery boxes',
      route: '/packs/mystery-boxes', // Future route
    },
  ];

  const handlePress = (option: QuickPlayOption) => {
    if (onPress) {
      onPress(option);
    } else {
      // Default action - log for now, will navigate in future
      console.log('Navigate to:', option.route);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.verticalBar} />
          <Text style={styles.sectionTitle}>QUICK PLAY</Text>
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
        {quickPlayOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.playCard,
              index === quickPlayOptions.length - 1 && styles.lastCard
            ]}
            onPress={() => handlePress(option)}
            activeOpacity={0.8}
          >
            {/* Icon Container */}
            <View style={styles.iconContainer}>
              <Ionicons name={option.icon as any} size={48} color="#40ffdc" />
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{option.title}</Text>
              <Text style={styles.cardDescription}>{option.description}</Text>
              
              {/* Arrow indicator */}
              <View style={styles.arrowContainer}>
                <Text style={styles.playText}>Play Now</Text>
                <Ionicons name="chevron-forward" size={16} color="#40ffdc" />
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
  playCard: {
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
  iconContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 12,
  },
  arrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  playText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#40ffdc',
    marginRight: 4,
  },
});

export default QuickPlaySection;


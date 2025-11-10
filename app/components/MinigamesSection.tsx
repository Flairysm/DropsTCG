import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Minigame {
  id: string;
  name: string;
  description: string;
  icon: string;
  entryCost?: number; // in tokens, optional
  rewards: string;
}

interface MinigamesSectionProps {
  games?: Minigame[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16;
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - CARD_MARGIN) / 1.5;

const MinigamesSection: React.FC<MinigamesSectionProps> = ({ games }) => {
  const defaultGames: Minigame[] = [
    {
      id: '1',
      name: 'Minesweeper',
      description: 'Find the hidden treasures',
      icon: 'grid',
      entryCost: 50,
      rewards: 'High-end cards, mystery packs, raffle entries',
    },
    {
      id: '2',
      name: 'Energy Match',
      description: 'Match energy cards to win',
      icon: 'flash',
      entryCost: 50,
      rewards: 'Rare cards, tokens, pack entries',
    },
  ];

  const displayGames = games || defaultGames;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.verticalBar} />
          <Text style={styles.sectionTitle}>MINIGAMES</Text>
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
        {displayGames.map((game, index) => (
          <TouchableOpacity
            key={game.id}
            style={[
              styles.gameCard,
              index === displayGames.length - 1 && styles.lastCard
            ]}
          >
            {/* Game Icon Container */}
            <View style={styles.gameIconContainer}>
              <Ionicons name={game.icon as any} size={48} color="#40ffdc" />
            </View>

            {/* Game Info */}
            <View style={styles.gameInfo}>
              <Text style={styles.gameName} numberOfLines={1}>
                {game.name}
              </Text>
              <Text style={styles.gameDescription} numberOfLines={2}>
                {game.description}
              </Text>
              
              {game.entryCost && (
                <View style={styles.entryCostContainer}>
                  <Ionicons name="diamond" size={14} color="#40ffdc" />
                  <Text style={styles.entryCostText}>
                    {game.entryCost} tokens to play
                  </Text>
                </View>
              )}

              <View style={styles.rewardsContainer}>
                <Ionicons name="trophy-outline" size={14} color="#FFD700" />
                <Text style={styles.rewardsText} numberOfLines={2}>
                  {game.rewards}
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
  gameCard: {
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
  gameIconContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    padding: 16,
  },
  gameName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  gameDescription: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 12,
    minHeight: 32,
  },
  entryCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryCostText: {
    fontSize: 12,
    color: '#40ffdc',
    marginLeft: 4,
    fontWeight: '600',
  },
  rewardsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 255, 220, 0.1)',
  },
  rewardsText: {
    fontSize: 11,
    color: '#FFD700',
    marginLeft: 4,
    flex: 1,
    opacity: 0.9,
  },
});

export default MinigamesSection;


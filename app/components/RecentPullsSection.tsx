import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecentPull {
  id: string;
  userName: string;
  cardName: string;
  cardImage?: string;
  tier: string; // SSS, SS, S, A, B, C, D
  pulledAt: Date;
}

interface RecentPullsSectionProps {
  pulls?: RecentPull[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 12;
// Show 2.5 cards per screen
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - (CARD_MARGIN * 1.5)) / 2.5;
// Pokemon card dimensions: 2.5" × 3.5" (aspect ratio = 3.5/2.5 = 1.4 for height/width)
const POKEMON_CARD_ASPECT_RATIO = 3.5 / 2.5; // height/width = 1.4
const CARD_IMAGE_HEIGHT = CARD_WIDTH * POKEMON_CARD_ASPECT_RATIO;

const RecentPullsSection: React.FC<RecentPullsSectionProps> = ({ pulls }) => {
  // Sample recent pulls data - replace with real data from your API/state
  const defaultPulls: RecentPull[] = [
    {
      id: '1',
      userName: 'Player123',
      cardName: 'Charizard VMAX',
      tier: 'SSS',
      pulledAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: '2',
      userName: 'TCGCollector',
      cardName: 'Pikachu VMAX',
      tier: 'SS',
      pulledAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    {
      id: '3',
      userName: 'CardMaster',
      cardName: 'Blastoise VMAX',
      tier: 'SSS',
      pulledAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      id: '4',
      userName: 'PokemonFan',
      cardName: 'Venusaur VMAX',
      tier: 'S',
      pulledAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
  ];

  const displayPulls = pulls || defaultPulls;

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'SSS': return '#9B59B6'; // Purple
      case 'SS': return '#FFD700'; // Gold
      case 'S': return '#FF69B4'; // Pink
      case 'A': return '#FF4444'; // Red
      case 'B': return '#10B981'; // Green
      case 'C': return '#3498DB'; // Blue
      case 'D': return '#95A5A6'; // Gray
      default: return '#40ffdc';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.verticalBar} />
          <Text style={styles.sectionTitle}>RECENT PULLS</Text>
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
        {displayPulls.map((pull, index) => {
          const timeAgo = formatTimeAgo(pull.pulledAt);
          const tierColor = getTierColor(pull.tier);

          return (
            <TouchableOpacity
              key={pull.id}
              style={[
                styles.pullCard,
                index === displayPulls.length - 1 && styles.lastCard
              ]}
            >
              {/* Card Image */}
              <View style={styles.cardImageContainer}>
                {pull.cardImage ? (
                  <Image source={{ uri: pull.cardImage }} style={styles.cardImage} resizeMode="cover" />
                ) : (
                  <>
                    <Ionicons name="card-outline" size={48} color={tierColor} />
                    <Text style={styles.cardPlaceholderText}>{pull.cardName}</Text>
                  </>
                )}
              </View>

              {/* Pull Info */}
              <View style={styles.pullInfo}>
                <View style={styles.topSection}>
                  {/* User Info */}
                  <View style={styles.userInfo}>
                    <Ionicons name="person-circle-outline" size={16} color="#40ffdc" />
                    <Text style={styles.userName} numberOfLines={1}>
                      {pull.userName}
                    </Text>
                  </View>

                  {/* Card Name */}
                  <Text style={styles.cardName} numberOfLines={2}>
                    {pull.cardName}
                  </Text>

                  {/* Tier Badge */}
                  <View style={[styles.tierBadge, { borderColor: tierColor }]}>
                    <Text style={[styles.tierText, { color: tierColor }]}>
                      {pull.tier}
                    </Text>
                  </View>
                </View>

                {/* Bottom Section - Time */}
                <View style={styles.bottomSection}>
                  <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={14} color="#ffffff" style={{ opacity: 0.6 }} />
                    <Text style={styles.timeText}>{timeAgo}</Text>
                  </View>
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
  pullCard: {
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
  cardImageContainer: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardPlaceholderText: {
    color: '#40ffdc',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  pullInfo: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 120,
  },
  topSection: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 12,
    color: '#ffffff',
    marginLeft: 6,
    opacity: 0.8,
    flex: 1,
  },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    minHeight: 38, // Reserve space for 2 lines
  },
  tierBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    marginTop: 4,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomSection: {
    marginTop: 'auto',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeText: {
    fontSize: 11,
    color: '#ffffff',
    marginLeft: 4,
    opacity: 0.6,
  },
});

export default RecentPullsSection;


import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Prize {
  position: number; // 1, 2, 3 for main prizes
  name: string;
  image?: string;
}

interface RaffleEvent {
  id: string;
  title: string;
  prizes: Prize[]; // 1st, 2nd, 3rd place prizes
  consolationPrize: {
    tokens: number; // Guaranteed tokens for non-winners (default: 1)
  };
  totalSlots: number;
  filledSlots: number;
  tokensPerSlot: number; // Price in tokens (RM1 = 20 tokens)
  isActive: boolean;
}

interface RaffleEventsSectionProps {
  raffles?: RaffleEvent[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16; // Space between cards
// Show 1.5 cards per screen: card width = (screen width - padding - margin) / 1.5
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - CARD_MARGIN) / 1.5;

const RaffleEventsSection: React.FC<RaffleEventsSectionProps> = ({ raffles }) => {
  const router = useRouter();
  
  // Sample raffle data - replace with real data from your API/state
  const defaultRaffles: RaffleEvent[] = [
    {
      id: '1',
      title: 'Charizard VMAX Booster Box',
      prizes: [
        { position: 1, name: 'Charizard VMAX Booster Box' },
        { position: 2, name: 'PSA 10 Charizard VMAX' },
        { position: 3, name: 'Charizard VMAX Single' },
      ],
      consolationPrize: {
        tokens: 1, // 1 token guaranteed for non-winners
      },
      totalSlots: 100,
      filledSlots: 45,
      tokensPerSlot: 200, // 200 tokens = RM10 (RM1 = 20 tokens)
      isActive: true,
    },
    {
      id: '2',
      title: 'PSA 10 Pikachu VMAX',
      prizes: [
        { position: 1, name: 'PSA 10 Pikachu VMAX' },
        { position: 2, name: 'Pikachu VMAX Booster Box' },
        { position: 3, name: 'Pikachu VMAX Single' },
      ],
      consolationPrize: {
        tokens: 1, // 1 token guaranteed for non-winners
      },
      totalSlots: 50,
      filledSlots: 32,
      tokensPerSlot: 400, // 400 tokens = RM20 (RM1 = 20 tokens)
      isActive: true,
    },
  ];

  const displayRaffles = raffles || defaultRaffles;

  const getProgressPercentage = (filled: number, total: number): number => {
    return (filled / total) * 100;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.verticalBar} />
          <Text style={styles.sectionTitle}>RAFFLE EVENTS</Text>
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
        {displayRaffles.map((raffle, index) => {
          const progress = getProgressPercentage(raffle.filledSlots, raffle.totalSlots);
          const slotsRemaining = raffle.totalSlots - raffle.filledSlots;

          return (
            <TouchableOpacity
              key={raffle.id}
              style={[
                styles.raffleCard,
                index === displayRaffles.length - 1 && styles.lastCard
              ]}
            >
              {/* Prize Image Placeholder */}
              <View style={styles.prizeImageContainer}>
                <Ionicons name="trophy-outline" size={48} color="#40ffdc" />
                <Text style={styles.prizePlaceholderText}>
                  {raffle.prizes.length} Main Prizes
                </Text>
                <Text style={styles.consolationText}>
                  + {raffle.consolationPrize.tokens} token consolation
                </Text>
              </View>

              {/* Raffle Info */}
              <View style={styles.raffleInfo}>
                <View style={styles.topSection}>
                  <Text style={styles.raffleTitle} numberOfLines={2}>
                    {raffle.title}
                  </Text>

                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                      {raffle.filledSlots} / {raffle.totalSlots} slots
                    </Text>
                  </View>

                  {/* Price in Tokens */}
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <Ionicons name="cash-outline" size={16} color="#40ffdc" />
                      <Text style={styles.detailText}>
                        {raffle.tokensPerSlot.toLocaleString()} tokens per slot
                      </Text>
                    </View>
                  </View>

                  {/* Prizes List */}
                  <View style={styles.prizesContainer}>
                    {raffle.prizes.map((prize, prizeIndex) => (
                      <View key={prizeIndex} style={styles.prizeItem}>
                        <Text style={styles.prizePosition}>
                          {prize.position === 1 ? '1st' : prize.position === 2 ? '2nd' : '3rd'}
                        </Text>
                        <Text style={styles.prizeName} numberOfLines={1}>
                          {prize.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Bottom Section - Fixed at bottom */}
                <View style={styles.bottomSection}>
                  {/* Slots Remaining */}
                  <View style={styles.slotsRemainingContainer}>
                    <Text style={styles.slotsRemainingText}>
                      {slotsRemaining} slots remaining
                    </Text>
                  </View>

                  {/* View Details Button */}
                  <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={() => {
                      router.push(`/raffle-details?id=${raffle.id}` as any);
                    }}
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={16} color="#0a0019" />
                  </TouchableOpacity>
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
  raffleCard: {
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
  prizeImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prizePlaceholderText: {
    color: '#40ffdc',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  consolationText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 16,
    opacity: 0.8,
  },
  raffleInfo: {
    padding: 16,
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 220, // Ensure consistent height
  },
  topSection: {
    flex: 1,
  },
  raffleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    minHeight: 50, // Fixed height for 2 lines
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#40ffdc',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 6,
    opacity: 0.9,
  },
  prizesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 255, 220, 0.1)',
  },
  prizeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  prizePosition: {
    fontSize: 12,
    fontWeight: '700',
    color: '#40ffdc',
    width: 32,
    marginRight: 8,
  },
  prizeName: {
    fontSize: 12,
    color: '#ffffff',
    flex: 1,
    opacity: 0.9,
  },
  bottomSection: {
    marginTop: 'auto',
  },
  slotsRemainingContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 255, 220, 0.1)',
    marginBottom: 12,
  },
  slotsRemainingText: {
    fontSize: 14,
    color: '#40ffdc',
    fontWeight: '600',
    textAlign: 'center',
  },
  viewDetailsButton: {
    marginTop: 12,
    backgroundColor: '#40ffdc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a0019',
    marginRight: 4,
  },
});

export default RaffleEventsSection;


import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface UserRaffle {
  id: string;
  title: string;
  slotsPurchased: number;
  totalSlots: number;
  tokensPerSlot: number;
  status: 'active' | 'completed' | 'won' | 'lost';
  result?: 'won' | 'lost';
  prize?: string;
}

const sampleRaffles: UserRaffle[] = [
  {
    id: '1',
    title: 'Charizard VMAX Booster Box',
    slotsPurchased: 5,
    totalSlots: 100,
    tokensPerSlot: 200,
    status: 'active',
  },
  {
    id: '2',
    title: 'PSA 10 Pikachu VMAX',
    slotsPurchased: 3,
    totalSlots: 50,
    tokensPerSlot: 400,
    status: 'completed',
    result: 'lost',
  },
  {
    id: '3',
    title: 'Vintage Base Set Booster Pack',
    slotsPurchased: 10,
    totalSlots: 200,
    tokensPerSlot: 150,
    status: 'completed',
    result: 'won',
    prize: 'Vintage Base Set Booster Pack',
  },
];

export default function Raffles() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getStatusColor = (status: string, result?: string): string => {
    if (result === 'won') return '#10B981';
    if (result === 'lost') return '#FF4444';
    if (status === 'active') return '#3B82F6';
    return '#ffffff';
  };

  const getStatusText = (status: string, result?: string): string => {
    if (result === 'won') return 'WON';
    if (result === 'lost') return 'LOST';
    if (status === 'active') return 'ACTIVE';
    return 'COMPLETED';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Raffles</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sampleRaffles.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="ticket-outline" size={64} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.emptyText}>No raffles yet</Text>
            <Text style={styles.emptySubtext}>Your raffle participations will appear here</Text>
          </View>
        ) : (
          sampleRaffles.map((raffle) => (
            <TouchableOpacity
              key={raffle.id}
              style={styles.raffleCard}
              onPress={() => router.push(`/packs/raffle-details?id=${raffle.id}` as any)}
              activeOpacity={0.8}
            >
              <View style={styles.raffleHeader}>
                <View style={styles.raffleHeaderLeft}>
                  <Ionicons name="ticket" size={24} color="#40ffdc" />
                  <View style={styles.raffleInfo}>
                    <Text style={styles.raffleTitle}>{raffle.title}</Text>
                    <Text style={styles.slotsText}>
                      {raffle.slotsPurchased} slot{raffle.slotsPurchased !== 1 ? 's' : ''} purchased
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(raffle.status, raffle.result)}20` }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(raffle.status, raffle.result) }]}>
                    {getStatusText(raffle.status, raffle.result)}
                  </Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Slots:</Text>
                  <Text style={styles.detailValue}>{raffle.totalSlots}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tokens per Slot:</Text>
                  <Text style={styles.detailValue}>{raffle.tokensPerSlot.toLocaleString()}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Spent:</Text>
                  <Text style={[styles.detailValue, { color: '#40ffdc' }]}>
                    {(raffle.slotsPurchased * raffle.tokensPerSlot).toLocaleString()} tokens
                  </Text>
                </View>
              </View>

              {raffle.result === 'won' && raffle.prize && (
                <View style={styles.prizeContainer}>
                  <Ionicons name="trophy" size={20} color="#10B981" />
                  <Text style={styles.prizeText}>Prize: {raffle.prize}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0019',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#12042b',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.6,
    textAlign: 'center',
  },
  raffleCard: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  raffleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  raffleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  raffleInfo: {
    marginLeft: 12,
    flex: 1,
  },
  raffleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  slotsText: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  detailsContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 255, 220, 0.1)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  prizeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
});


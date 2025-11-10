import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Prize {
  position: number;
  name: string;
  image?: string;
}

interface RaffleEvent {
  id: string;
  title: string;
  prizes: Prize[];
  consolationPrize: {
    tokens: number;
  };
  totalSlots: number;
  filledSlots: number;
  tokensPerSlot: number;
  isActive: boolean;
  description?: string;
}

export default function RaffleDetails() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const raffleId = params.id as string;

  const [slotsToPurchase, setSlotsToPurchase] = useState<string>('1');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Sample raffle data - replace with API call using raffleId
  const raffle: RaffleEvent = {
    id: raffleId || '1',
    title: 'Charizard VMAX Booster Box',
    description: 'Win an exclusive Charizard VMAX Booster Box! This limited edition raffle features amazing prizes for the top 3 winners, plus consolation tokens for everyone.',
    prizes: [
      { position: 1, name: 'Charizard VMAX Booster Box', image: undefined }, // Add image URL here
      { position: 2, name: 'PSA 10 Charizard VMAX', image: undefined }, // Add image URL here
      { position: 3, name: 'Charizard VMAX Single', image: undefined }, // Add image URL here
    ],
    consolationPrize: {
      tokens: 1,
    },
    totalSlots: 100,
    filledSlots: 45,
    tokensPerSlot: 200,
    isActive: true,
  };

  const slotsRemaining = raffle.totalSlots - raffle.filledSlots;
  const progress = (raffle.filledSlots / raffle.totalSlots) * 100;
  const slotsToBuy = parseInt(slotsToPurchase) || 1;
  const totalCost = slotsToBuy * raffle.tokensPerSlot;
  const canPurchase = slotsToBuy > 0 && slotsToBuy <= slotsRemaining && raffle.isActive;

  const handlePurchase = () => {
    // TODO: Implement purchase logic via API
    console.log(`Purchasing ${slotsToBuy} slots for ${totalCost} tokens`);
    setShowPurchaseModal(false);
    // Show success message and update raffle state
  };

  const getTierColor = (position: number): string => {
    switch (position) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#40ffdc';
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.top}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Raffle Details</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        {/* Prize Image/Header */}
        <View style={styles.prizeHeader}>
          <View style={styles.prizeImageContainer}>
            <Ionicons name="trophy" size={64} color="#40ffdc" />
            <Text style={styles.prizeHeaderText}>
              {raffle.prizes.length} Main Prizes
            </Text>
            <Text style={styles.consolationHeaderText}>
              + {raffle.consolationPrize.tokens} token consolation
            </Text>
          </View>
        </View>

        {/* Raffle Info */}
        <View style={styles.infoSection}>
          <Text style={styles.raffleTitle}>{raffle.title}</Text>
          
          {raffle.description && (
            <Text style={styles.description}>{raffle.description}</Text>
          )}

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressValue}>
                {raffle.filledSlots} / {raffle.totalSlots} slots
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.slotsRemaining}>
              {slotsRemaining} slots remaining
            </Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Ionicons name="diamond" size={20} color="#40ffdc" />
              <Text style={styles.priceText}>
                {raffle.tokensPerSlot.toLocaleString()} tokens per slot
              </Text>
            </View>
            <Text style={styles.priceSubtext}>
              RM{(raffle.tokensPerSlot / 20).toFixed(2)} per slot (RM1 = 20 tokens)
            </Text>
          </View>

          {/* Prizes Section */}
          <View style={styles.prizesSection}>
            <Text style={styles.sectionTitle}>Prizes</Text>
            {raffle.prizes.map((prize, index) => (
              <View key={index} style={styles.prizeItem}>
                <View style={[styles.prizePositionBadge, { backgroundColor: getTierColor(prize.position) }]}>
                  <Text style={styles.prizePositionText}>
                    {prize.position === 1 ? '1st' : prize.position === 2 ? '2nd' : '3rd'}
                  </Text>
                </View>
                {prize.image ? (
                  <Image source={{ uri: prize.image }} style={styles.prizeImage} resizeMode="cover" />
                ) : (
                  <View style={styles.prizeImagePlaceholder}>
                    <Ionicons name="image-outline" size={32} color={getTierColor(prize.position)} />
                  </View>
                )}
                <Text style={styles.prizeName}>{prize.name}</Text>
              </View>
            ))}
            <View style={styles.consolationPrize}>
              <Ionicons name="diamond" size={16} color="#40ffdc" />
              <Text style={styles.consolationPrizeText}>
                Consolation: {raffle.consolationPrize.tokens} token for all non-winners
              </Text>
            </View>
          </View>

          {/* How It Works */}
          <View style={styles.howItWorksSection}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Purchase slots using tokens</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Wait for all slots to be filled</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Winners are randomly selected</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>4</Text>
              </View>
              <Text style={styles.stepText}>Receive your prize or consolation tokens</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Button */}
      {raffle.isActive && slotsRemaining > 0 && (
        <View style={[styles.purchaseBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.slotInputContainer}>
            <Text style={styles.slotInputLabel}>Slots:</Text>
            <TextInput
              style={styles.slotInput}
              value={slotsToPurchase}
              onChangeText={setSlotsToPurchase}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
            />
          </View>
          <TouchableOpacity
            style={[styles.purchaseButton, !canPurchase && styles.purchaseButtonDisabled]}
            onPress={() => setShowPurchaseModal(true)}
            disabled={!canPurchase}
            activeOpacity={0.8}
          >
            <Ionicons name="diamond" size={18} color="#0a0019" style={{ marginRight: 6 }} />
            <Text style={styles.purchaseButtonText}>
              Buy {slotsToBuy} Slot{slotsToBuy !== 1 ? 's' : ''}
            </Text>
            <Text style={[styles.purchaseButtonPrice, { marginLeft: 6 }]}>
              {totalCost.toLocaleString()} tokens
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Purchase Confirmation Modal */}
      <Modal
        visible={showPurchaseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Purchase</Text>
            <Text style={styles.modalMessage}>
              Purchase {slotsToBuy} slot{slotsToBuy !== 1 ? 's' : ''} for {totalCost.toLocaleString()} tokens?
            </Text>
            <View style={styles.modalDetails}>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Slots:</Text>
                <Text style={styles.modalDetailValue}>{slotsToBuy}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Cost:</Text>
                <Text style={styles.modalDetailValue}>{totalCost.toLocaleString()} tokens</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Remaining:</Text>
                <Text style={styles.modalDetailValue}>{slotsRemaining - slotsToBuy} slots</Text>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowPurchaseModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handlePurchase}
              >
                <Text style={styles.modalConfirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 100,
  },
  prizeHeader: {
    width: '100%',
    height: 200,
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prizeImageContainer: {
    alignItems: 'center',
  },
  prizeHeaderText: {
    color: '#40ffdc',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  consolationHeaderText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
    opacity: 0.8,
  },
  infoSection: {
    padding: 20,
  },
  raffleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 20,
    marginBottom: 24,
  },
  progressSection: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.7,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#40ffdc',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#40ffdc',
    borderRadius: 6,
  },
  slotsRemaining: {
    fontSize: 14,
    color: '#40ffdc',
    fontWeight: '600',
    textAlign: 'center',
  },
  priceSection: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 8,
  },
  priceSubtext: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.6,
    marginLeft: 28,
  },
  prizesSection: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  prizeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
  },
  prizePositionBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  prizePositionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0a0019',
  },
  prizeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#1a0a3a',
  },
  prizeImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prizeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  consolationPrize: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 255, 220, 0.1)',
  },
  consolationPrizeText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginLeft: 8,
  },
  howItWorksSection: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#40ffdc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0019',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  purchaseBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#12042b',
    borderTopWidth: 2,
    borderTopColor: 'rgba(64, 255, 220, 0.3)',
    paddingHorizontal: 20,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  slotInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0a3a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    marginRight: 12,
  },
  slotInputLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 8,
    fontWeight: '600',
  },
  slotInput: {
    width: 50,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
    textAlign: 'center',
  },
  purchaseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#40ffdc',
    borderRadius: 12,
    paddingVertical: 16,
  },
  purchaseButtonDisabled: {
    backgroundColor: 'rgba(64, 255, 220, 0.3)',
    opacity: 0.5,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0019',
  },
  purchaseButtonPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a0019',
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.3)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalDetails: {
    backgroundColor: '#1a0a3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  modalDetailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#40ffdc',
  },
  modalButtons: {
    flexDirection: 'row',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 12,
  },
  modalConfirmButton: {
    backgroundColor: '#40ffdc',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalConfirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0a0019',
  },
});


import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PrizePoolCard {
  name: string;
  tier: string;
  probability: string; // e.g., "5%", "Guaranteed"
  image?: string;
}

interface GemDrop {
  id: string;
  name: string;
  gemType: string;
  price: number; // in tokens
  totalBoxes: number;
  remainingBoxes: number;
  description: string;
  cardTierRange: string; // e.g., "A-S" or "SSS only"
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  color: string;
  prizePool: PrizePoolCard[];
}

const GEM_DROPS: GemDrop[] = [
  {
    id: 'diamond',
    name: 'Diamond Drops',
    gemType: 'Diamond',
    price: 1000,
    totalBoxes: 1000,
    remainingBoxes: 756,
    description: 'Mid-range cards with guaranteed chase cards. Perfect for collectors looking for quality pulls.',
    cardTierRange: 'B-S',
    rarity: 'common',
    icon: 'diamond',
    color: '#B9F2FF', // Light blue/white
    prizePool: [
      { name: 'Charizard VMAX', tier: 'S', probability: '5%' },
      { name: 'Pikachu VMAX', tier: 'S', probability: '8%' },
      { name: 'Blastoise VMAX', tier: 'A', probability: '12%' },
      { name: 'Venusaur VMAX', tier: 'A', probability: '12%' },
      { name: 'Various B-Tier Cards', tier: 'B', probability: '63%' },
    ],
  },
  {
    id: 'emerald',
    name: 'Emerald Drops',
    gemType: 'Emerald',
    price: 2000,
    totalBoxes: 500,
    remainingBoxes: 342,
    description: 'Higher tier cards with increased chances of rare pulls. Great value for serious collectors.',
    cardTierRange: 'A-SS',
    rarity: 'uncommon',
    icon: 'leaf',
    color: '#50C878', // Green
    prizePool: [
      { name: 'PSA 10 Charizard VMAX', tier: 'SS', probability: '3%' },
      { name: 'PSA 10 Pikachu VMAX', tier: 'SS', probability: '5%' },
      { name: 'Charizard VMAX', tier: 'S', probability: '15%' },
      { name: 'Various A-Tier Cards', tier: 'A', probability: '77%' },
    ],
  },
  {
    id: 'ruby',
    name: 'Ruby Drops',
    gemType: 'Ruby',
    price: 5000,
    totalBoxes: 200,
    remainingBoxes: 89,
    description: 'Premium cards with guaranteed high-tier pulls. For collectors seeking top-tier cards.',
    cardTierRange: 'S-SS',
    rarity: 'rare',
    icon: 'flame',
    color: '#E0115F', // Red
    prizePool: [
      { name: 'PSA 10 Charizard VMAX', tier: 'SS', probability: '10%' },
      { name: 'PSA 10 Pikachu VMAX', tier: 'SS', probability: '15%' },
      { name: 'Charizard VMAX', tier: 'S', probability: '25%' },
      { name: 'Various S-Tier Cards', tier: 'S', probability: '50%' },
    ],
  },
  {
    id: 'sapphire',
    name: 'Sapphire Drops',
    gemType: 'Sapphire',
    price: 7500,
    totalBoxes: 150,
    remainingBoxes: 45,
    description: 'Ultra-premium drops featuring only the finest cards. Extremely limited availability.',
    cardTierRange: 'SS-SSS',
    rarity: 'epic',
    icon: 'water',
    color: '#0F52BA', // Blue
    prizePool: [
      { name: 'PSA 10 Charizard VMAX', tier: 'SSS', probability: '5%' },
      { name: 'PSA 10 Pikachu VMAX', tier: 'SSS', probability: '8%' },
      { name: 'PSA 10 Mewtwo VMAX', tier: 'SSS', probability: '12%' },
      { name: 'PSA 10 Various SS Cards', tier: 'SS', probability: '75%' },
    ],
  },
  {
    id: 'obsidian',
    name: 'Obsidian Drops',
    gemType: 'Obsidian',
    price: 10000,
    totalBoxes: 100,
    remainingBoxes: 12,
    description: 'The ultimate gem drop. Every card is a premium chase card. Extremely rare and valuable.',
    cardTierRange: 'SSS only',
    rarity: 'legendary',
    icon: 'moon',
    color: '#000000', // Black
    prizePool: [
      { name: 'PSA 10 Charizard VMAX', tier: 'SSS', probability: 'Guaranteed' },
      { name: 'PSA 10 Pikachu VMAX', tier: 'SSS', probability: 'Guaranteed' },
      { name: 'PSA 10 Mewtwo VMAX', tier: 'SSS', probability: 'Guaranteed' },
      { name: 'PSA 10 Blastoise VMAX', tier: 'SSS', probability: 'Guaranteed' },
      { name: 'PSA 10 Venusaur VMAX', tier: 'SSS', probability: 'Guaranteed' },
    ],
  },
];

export default function GemDrops() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedGem, setSelectedGem] = useState<GemDrop | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [quantity, setQuantity] = useState<string>('1');

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

  const getRarityLabel = (rarity: string): string => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
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

  const handlePurchase = () => {
    if (!selectedGem) return;
    const qty = parseInt(quantity) || 1;
    // TODO: Implement purchase logic via API
    console.log(`Purchasing ${qty} ${selectedGem.name} for ${selectedGem.price * qty} tokens`);
    setShowPurchaseModal(false);
    setSelectedGem(null);
    setQuantity('1');
  };

  const quantityNum = parseInt(quantity) || 1;
  const totalCost = selectedGem ? selectedGem.price * quantityNum : 0;
  const canPurchase = selectedGem && quantityNum > 0 && quantityNum <= (selectedGem?.remainingBoxes || 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gem Drops</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>Limited Mystery Boxes</Text>
          <Text style={styles.descriptionText}>
            Each gem drop contains themed cards based on rarity. Limited quantities available - once sold out, they're gone forever!
          </Text>
        </View>

        {/* Gem Drops List */}
        {GEM_DROPS.map((gem) => {
          const progress = ((gem.totalBoxes - gem.remainingBoxes) / gem.totalBoxes) * 100;
          const rarityColor = getRarityColor(gem.rarity);
          const isSelected = selectedGem?.id === gem.id;

          return (
            <TouchableOpacity
              key={gem.id}
              style={[
                styles.gemCard,
                isSelected && [styles.gemCardSelected, { borderColor: rarityColor }]
              ]}
              onPress={() => setSelectedGem(gem)}
              activeOpacity={0.8}
            >
              {/* Gem Header */}
              <View style={[styles.gemHeader, { backgroundColor: `${gem.color}20` }]}>
                <View style={styles.gemHeaderContent}>
                  <View style={[styles.gemIconContainer, { backgroundColor: gem.color }]}>
                    <Ionicons name={gem.icon as any} size={32} color="#ffffff" />
                  </View>
                  <View style={styles.gemHeaderText}>
                    <Text style={styles.gemName}>{gem.name}</Text>
                    <View style={styles.gemRarityBadge}>
                      <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
                      <Text style={[styles.rarityText, { color: rarityColor }]}>
                        {getRarityLabel(gem.rarity)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.gemPriceContainer}>
                  <Ionicons name="diamond" size={20} color="#40ffdc" />
                  <Text style={styles.gemPrice}>{gem.price.toLocaleString()}</Text>
                </View>
              </View>

              {/* Gem Info */}
              <View style={styles.gemInfo}>
                <Text style={styles.gemDescription}>{gem.description}</Text>

                {/* Availability */}
                <View style={styles.availabilityContainer}>
                  <View style={styles.availabilityRow}>
                    <Text style={styles.availabilityLabel}>Remaining:</Text>
                    <Text style={styles.availabilityValue}>
                      {gem.remainingBoxes} / {gem.totalBoxes} boxes
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: rarityColor }]} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Gem Details - Prize Pool */}
      {selectedGem && (
        <View style={styles.selectedGemDetails}>
          <View style={styles.detailsHeader}>
            <View style={[styles.detailsHeaderIcon, { backgroundColor: selectedGem.color }]}>
              <Ionicons name={selectedGem.icon as any} size={24} color="#ffffff" />
            </View>
            <View style={styles.detailsHeaderText}>
              <Text style={styles.detailsTitle}>{selectedGem.name}</Text>
              <Text style={styles.detailsSubtitle}>{selectedGem.description}</Text>
            </View>
            <View style={styles.detailsPriceContainer}>
              <Ionicons name="diamond" size={18} color="#40ffdc" />
              <Text style={styles.detailsPrice}>{selectedGem.price.toLocaleString()}</Text>
            </View>
          </View>

          {/* Card Prize Pool */}
          <View style={styles.prizePoolSection}>
            <Text style={styles.prizePoolTitle}>Card Prize Pool</Text>
            <Text style={styles.prizePoolSubtitle}>
              Possible cards you can pull from {selectedGem.name}
            </Text>
            {selectedGem.prizePool.map((card, index) => {
              const tierColor = getTierColor(card.tier);
              return (
                <View key={index} style={styles.prizePoolCard}>
                  <View style={[styles.prizePoolTierBadge, { backgroundColor: tierColor }]}>
                    <Text style={styles.prizePoolTierText}>{card.tier}</Text>
                  </View>
                  <View style={styles.prizePoolCardInfo}>
                    <Text style={styles.prizePoolCardName}>{card.name}</Text>
                    <Text style={styles.prizePoolProbability}>{card.probability}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Purchase Bar */}
      {selectedGem && (
        <View style={[styles.purchaseBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantityNum - 1).toString())}
                disabled={quantityNum <= 1}
              >
                <Ionicons name="remove" size={20} color="#ffffff" />
              </TouchableOpacity>
              <TextInput
                style={styles.quantityValue}
                value={quantity}
                onChangeText={(text) => {
                  const num = parseInt(text) || 0;
                  if (selectedGem) {
                    setQuantity(Math.max(1, Math.min(selectedGem.remainingBoxes, num)).toString());
                  } else {
                    setQuantity(text);
                  }
                }}
                keyboardType="numeric"
                selectTextOnFocus
              />
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.min(selectedGem.remainingBoxes, quantityNum + 1).toString())}
                disabled={quantityNum >= selectedGem.remainingBoxes}
              >
                <Ionicons name="add" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.purchaseButton, !canPurchase && styles.purchaseButtonDisabled]}
            onPress={() => setShowPurchaseModal(true)}
            disabled={!canPurchase}
            activeOpacity={0.8}
          >
            <Ionicons name="diamond" size={18} color="#0a0019" style={{ marginRight: 6 }} />
            <Text style={styles.purchaseButtonText}>
              Buy {quantityNum} Box{quantityNum !== 1 ? 'es' : ''}
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
            <View style={[styles.modalGemHeader, { backgroundColor: `${selectedGem?.color}20` }]}>
              <View style={[styles.modalGemIcon, { backgroundColor: selectedGem?.color || '#40ffdc' }]}>
                <Ionicons name={selectedGem?.icon as any} size={40} color="#ffffff" />
              </View>
              <Text style={styles.modalGemName}>{selectedGem?.name}</Text>
            </View>

            <Text style={styles.modalTitle}>Confirm Purchase</Text>
            <Text style={styles.modalMessage}>
              Purchase {quantityNum} {selectedGem?.name} box{quantityNum !== 1 ? 'es' : ''}?
            </Text>

            <View style={styles.modalDetails}>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Boxes:</Text>
                <Text style={styles.modalDetailValue}>{quantityNum}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Price per box:</Text>
                <Text style={styles.modalDetailValue}>{selectedGem?.price.toLocaleString()} tokens</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Total cost:</Text>
                <Text style={[styles.modalDetailValue, { color: '#40ffdc' }]}>
                  {totalCost.toLocaleString()} tokens
                </Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Remaining after:</Text>
                <Text style={styles.modalDetailValue}>
                  {(selectedGem?.remainingBoxes || 0) - quantityNum} boxes
                </Text>
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
    padding: 24,
    paddingBottom: 140,
  },
  descriptionSection: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 20,
  },
  gemCard: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  gemCardSelected: {
    borderWidth: 3,
    shadowColor: '#40ffdc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  gemHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gemHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gemIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gemHeaderText: {
    flex: 1,
  },
  gemName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  gemRarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gemPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0a3a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  gemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 6,
  },
  gemInfo: {
    padding: 20,
    paddingTop: 16,
  },
  gemDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 16,
  },
  availabilityContainer: {
    marginTop: 8,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  availabilityLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
  },
  availabilityValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#40ffdc',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#1a0a3a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  quantityLabel: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 8,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(64, 255, 220, 0.2)',
    borderRadius: 6,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginHorizontal: 12,
    minWidth: 40,
    textAlign: 'center',
    padding: 0,
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
    borderRadius: 20,
    padding: 28,
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.3)',
  },
  modalGemHeader: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalGemIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalGemName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalDetails: {
    backgroundColor: '#1a0a3a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
  selectedGemDetails: {
    padding: 20,
    paddingTop: 0,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  detailsHeaderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsHeaderText: {
    flex: 1,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  detailsSubtitle: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    lineHeight: 16,
  },
  detailsPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0a3a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailsPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 6,
  },
  prizePoolSection: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  prizePoolTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  prizePoolSubtitle: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 16,
  },
  prizePoolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0a3a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  prizePoolTierBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  prizePoolTierText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0a0019',
    letterSpacing: 0.5,
  },
  prizePoolCardInfo: {
    flex: 1,
  },
  prizePoolCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  prizePoolProbability: {
    fontSize: 12,
    color: '#40ffdc',
    fontWeight: '600',
  },
});


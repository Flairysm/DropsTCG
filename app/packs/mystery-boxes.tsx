import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PrizePoolCard {
  name: string;
  tier: string;
  probability: string;
  image?: string;
}

interface MysteryBox {
  id: string;
  name: string;
  theme: string;
  price: number;
  totalBoxes: number;
  remainingBoxes: number;
  description: string;
  cardTierRange: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  color: string;
  prizePool: PrizePoolCard[];
}

const MYSTERY_BOXES: MysteryBox[] = [
  {
    id: 'charizard',
    name: 'Charizard Box',
    theme: 'Charizard',
    price: 3000,
    totalBoxes: 500,
    remainingBoxes: 234,
    description: 'Every card in this box features Charizard and its variants. Perfect for Charizard collectors!',
    cardTierRange: 'A-SS',
    rarity: 'rare',
    icon: 'flame',
    color: '#FF6B35',
    prizePool: [
      { name: 'Charizard VMAX', tier: 'SS', probability: '10%' },
      { name: 'Charizard V', tier: 'S', probability: '20%' },
      { name: 'Charizard GX', tier: 'A', probability: '30%' },
      { name: 'Various Charizard Cards', tier: 'A', probability: '40%' },
    ],
  },
  {
    id: 'pikachu',
    name: 'Pikachu Box',
    theme: 'Pikachu',
    price: 2500,
    totalBoxes: 750,
    remainingBoxes: 456,
    description: 'All Pikachu-themed cards including special variants and rare editions.',
    cardTierRange: 'B-S',
    rarity: 'uncommon',
    icon: 'flash',
    color: '#FFD700',
    prizePool: [
      { name: 'Pikachu VMAX', tier: 'S', probability: '15%' },
      { name: 'Pikachu V', tier: 'A', probability: '25%' },
      { name: 'Pikachu GX', tier: 'A', probability: '30%' },
      { name: 'Various Pikachu Cards', tier: 'B', probability: '30%' },
    ],
  },
  {
    id: 'eeveelution',
    name: 'Eeveelution Box',
    theme: 'Eeveelution',
    price: 4000,
    totalBoxes: 200,
    remainingBoxes: 89,
    description: 'Complete Eeveelution evolution line including all Eevee evolutions.',
    cardTierRange: 'S-SS',
    rarity: 'epic',
    icon: 'sparkles',
    color: '#9B59B6',
    prizePool: [
      { name: 'Vaporeon VMAX', tier: 'SS', probability: '8%' },
      { name: 'Jolteon VMAX', tier: 'SS', probability: '8%' },
      { name: 'Flareon VMAX', tier: 'SS', probability: '8%' },
      { name: 'Various Eeveelutions', tier: 'S', probability: '76%' },
    ],
  },
  {
    id: 'legendary',
    name: 'Legendary Box',
    theme: 'Legendary',
    price: 6000,
    totalBoxes: 150,
    remainingBoxes: 45,
    description: 'Exclusive legendary Pokemon cards. The ultimate collection for serious collectors.',
    cardTierRange: 'SS-SSS',
    rarity: 'legendary',
    icon: 'star',
    color: '#FFD700',
    prizePool: [
      { name: 'Mewtwo VMAX', tier: 'SSS', probability: '5%' },
      { name: 'Mew VMAX', tier: 'SSS', probability: '5%' },
      { name: 'Rayquaza VMAX', tier: 'SS', probability: '15%' },
      { name: 'Various Legendaries', tier: 'SS', probability: '75%' },
    ],
  },
];

export default function MysteryBoxes() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedBox, setSelectedBox] = useState<MysteryBox | null>(null);
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
      case 'SSS': return '#9B59B6';
      case 'SS': return '#FFD700';
      case 'S': return '#FF69B4';
      case 'A': return '#FF4444';
      case 'B': return '#10B981';
      case 'C': return '#3498DB';
      case 'D': return '#95A5A6';
      default: return '#40ffdc';
    }
  };

  const handlePurchase = () => {
    if (!selectedBox) return;
    const qty = parseInt(quantity) || 1;
    // TODO: Implement purchase logic via API
    setShowPurchaseModal(false);
    setSelectedBox(null);
    setQuantity('1');
  };

  const quantityNum = parseInt(quantity) || 1;
  const totalCost = selectedBox ? selectedBox.price * quantityNum : 0;
  const canPurchase = selectedBox && quantityNum > 0 && quantityNum <= (selectedBox?.remainingBoxes || 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mystery Boxes</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>Themed Mystery Boxes</Text>
          <Text style={styles.descriptionText}>
            Each mystery box contains themed cards based on a specific Pokemon or collection. Limited quantities available!
          </Text>
        </View>

        {/* Mystery Boxes List */}
        {MYSTERY_BOXES.map((box) => {
          const progress = ((box.totalBoxes - box.remainingBoxes) / box.totalBoxes) * 100;
          const rarityColor = getRarityColor(box.rarity);
          const isSelected = selectedBox?.id === box.id;

          return (
            <TouchableOpacity
              key={box.id}
              style={[
                styles.boxCard,
                isSelected && [styles.boxCardSelected, { borderColor: rarityColor }]
              ]}
              onPress={() => setSelectedBox(box)}
              activeOpacity={0.8}
            >
              {/* Box Header */}
              <View style={[styles.boxHeader, { backgroundColor: `${box.color}20` }]}>
                <View style={styles.boxHeaderContent}>
                  <View style={[styles.boxIconContainer, { backgroundColor: box.color }]}>
                    <Ionicons name={box.icon as any} size={32} color="#ffffff" />
                  </View>
                  <View style={styles.boxHeaderText}>
                    <Text style={styles.boxName}>{box.name}</Text>
                    <View style={styles.boxRarityBadge}>
                      <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
                      <Text style={[styles.rarityText, { color: rarityColor }]}>
                        {getRarityLabel(box.rarity)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.boxPriceContainer}>
                  <Ionicons name="diamond" size={20} color="#40ffdc" />
                  <Text style={styles.boxPrice}>{box.price.toLocaleString()}</Text>
                </View>
              </View>

              {/* Box Info */}
              <View style={styles.boxInfo}>
                <Text style={styles.boxDescription}>{box.description}</Text>

                {/* Availability */}
                <View style={styles.availabilityContainer}>
                  <View style={styles.availabilityRow}>
                    <Text style={styles.availabilityLabel}>Remaining:</Text>
                    <Text style={styles.availabilityValue}>
                      {box.remainingBoxes} / {box.totalBoxes} boxes
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

      {/* Purchase Bar */}
      {selectedBox && (
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
                  if (selectedBox) {
                    setQuantity(Math.max(1, Math.min(selectedBox.remainingBoxes, num)).toString());
                  } else {
                    setQuantity(text);
                  }
                }}
                keyboardType="numeric"
                selectTextOnFocus
              />
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.min(selectedBox.remainingBoxes, quantityNum + 1).toString())}
                disabled={quantityNum >= selectedBox.remainingBoxes}
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
            <View style={[styles.modalBoxHeader, { backgroundColor: `${selectedBox?.color}20` }]}>
              <View style={[styles.modalBoxIcon, { backgroundColor: selectedBox?.color || '#40ffdc' }]}>
                <Ionicons name={selectedBox?.icon as any} size={40} color="#ffffff" />
              </View>
              <Text style={styles.modalBoxName}>{selectedBox?.name}</Text>
            </View>

            <Text style={styles.modalTitle}>Confirm Purchase</Text>
            <Text style={styles.modalMessage}>
              Purchase {quantityNum} {selectedBox?.name} box{quantityNum !== 1 ? 'es' : ''}?
            </Text>

            <View style={styles.modalDetails}>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Boxes:</Text>
                <Text style={styles.modalDetailValue}>{quantityNum}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Price per box:</Text>
                <Text style={styles.modalDetailValue}>{selectedBox?.price.toLocaleString()} tokens</Text>
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
                  {(selectedBox?.remainingBoxes || 0) - quantityNum} boxes
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
  boxCard: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  boxCardSelected: {
    borderWidth: 3,
    shadowColor: '#40ffdc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  boxHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  boxIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  boxHeaderText: {
    flex: 1,
  },
  boxName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  boxRarityBadge: {
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
  boxPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0a3a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  boxPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 6,
  },
  boxInfo: {
    padding: 20,
    paddingTop: 16,
  },
  boxDescription: {
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
  modalBoxHeader: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalBoxIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalBoxName: {
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
});


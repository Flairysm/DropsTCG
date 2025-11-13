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

interface BoosterPack {
  id: string;
  name: string;
  set: string;
  price: number;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  icon: string;
  color: string;
  prizePool: PrizePoolCard[];
}

const BOOSTER_PACKS: BoosterPack[] = [
  {
    id: 'evolving-skies',
    name: 'Evolving Skies',
    set: 'Evolving Skies',
    price: 2000,
    description: 'Featuring powerful Eeveelution VMAX cards and stunning alternate art cards. One of the most sought-after sets in the Pokemon TCG.',
    rarity: 'epic',
    icon: 'sparkles',
    color: '#6B46C1',
    prizePool: [
      { name: 'Umbreon VMAX Alt Art', tier: 'SSS', probability: '0.5%' },
      { name: 'Rayquaza VMAX Alt Art', tier: 'SSS', probability: '0.5%' },
      { name: 'Sylveon VMAX', tier: 'SS', probability: '2%' },
      { name: 'Various VMAX Cards', tier: 'SS', probability: '8%' },
      { name: 'Various V Cards', tier: 'S', probability: '15%' },
      { name: 'Common Cards', tier: 'A', probability: '74%' },
    ],
  },
  {
    id: 'mega-inferno-x',
    name: 'Mega Inferno X',
    set: 'Mega Inferno X',
    price: 2500,
    description: 'Fire-type Pokemon collection with exclusive Mega Evolution cards. Features Charizard, Blaziken, and other powerful fire-type Pokemon.',
    rarity: 'rare',
    icon: 'flame',
    color: '#FF6B35',
    prizePool: [
      { name: 'Mega Charizard X', tier: 'SSS', probability: '1%' },
      { name: 'Mega Blaziken', tier: 'SS', probability: '3%' },
      { name: 'Charizard VMAX', tier: 'SS', probability: '5%' },
      { name: 'Various Fire VMAX', tier: 'S', probability: '12%' },
      { name: 'Common Fire Cards', tier: 'A', probability: '79%' },
    ],
  },
  {
    id: 'base-set',
    name: 'Base Set',
    set: 'Base Set',
    price: 3000,
    description: 'The original Pokemon TCG set featuring classic cards. Includes the iconic Charizard, Blastoise, and Venusaur cards.',
    rarity: 'legendary',
    icon: 'star',
    color: '#FFD700',
    prizePool: [
      { name: 'Charizard (1st Edition)', tier: 'SSS', probability: '0.1%' },
      { name: 'Blastoise (1st Edition)', tier: 'SSS', probability: '0.1%' },
      { name: 'Venusaur (1st Edition)', tier: 'SSS', probability: '0.1%' },
      { name: 'Charizard', tier: 'SS', probability: '1%' },
      { name: 'Various Holos', tier: 'S', probability: '10%' },
      { name: 'Common Cards', tier: 'A', probability: '88.7%' },
    ],
  },
  {
    id: 'chilling-reign',
    name: 'Chilling Reign',
    set: 'Chilling Reign',
    price: 1800,
    description: 'Ice and water-type Pokemon with beautiful full-art cards. Features Galarian forms and stunning artwork.',
    rarity: 'uncommon',
    icon: 'snow',
    color: '#3B82F6',
    prizePool: [
      { name: 'Shadow Rider Calyrex VMAX', tier: 'SS', probability: '2%' },
      { name: 'Ice Rider Calyrex VMAX', tier: 'SS', probability: '2%' },
      { name: 'Various VMAX Cards', tier: 'S', probability: '10%' },
      { name: 'Common Cards', tier: 'A', probability: '86%' },
    ],
  },
];

export default function VirtualBoosterPacks() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedPack, setSelectedPack] = useState<BoosterPack | null>(null);
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
    if (!selectedPack) return;
    const qty = parseInt(quantity) || 1;
    // TODO: Implement purchase logic via API
    setShowPurchaseModal(false);
    setSelectedPack(null);
    setQuantity('1');
  };

  const quantityNum = parseInt(quantity) || 1;
  const totalCost = selectedPack ? selectedPack.price * quantityNum : 0;
  const canPurchase = selectedPack && quantityNum > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Virtual Booster Packs</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionTitle}>Official TCG Sets</Text>
          <Text style={styles.descriptionText}>
            Open virtual booster packs from real Pokemon TCG sets. Each pack contains cards that can be claimed as physical cards!
          </Text>
        </View>

        {/* Booster Packs List */}
        {BOOSTER_PACKS.map((pack) => {
          const rarityColor = getRarityColor(pack.rarity);
          const isSelected = selectedPack?.id === pack.id;

          return (
            <TouchableOpacity
              key={pack.id}
              style={[
                styles.packCard,
                isSelected && [styles.packCardSelected, { borderColor: rarityColor }]
              ]}
              onPress={() => setSelectedPack(pack)}
              activeOpacity={0.8}
            >
              {/* Pack Header */}
              <View style={[styles.packHeader, { backgroundColor: `${pack.color}20` }]}>
                <View style={styles.packHeaderContent}>
                  <View style={[styles.packIconContainer, { backgroundColor: pack.color }]}>
                    <Ionicons name={pack.icon as any} size={32} color="#ffffff" />
                  </View>
                  <View style={styles.packHeaderText}>
                    <Text style={styles.packName}>{pack.name}</Text>
                    <View style={styles.packRarityBadge}>
                      <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
                      <Text style={[styles.rarityText, { color: rarityColor }]}>
                        {getRarityLabel(pack.rarity)}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.packPriceContainer}>
                  <Ionicons name="diamond" size={20} color="#40ffdc" />
                  <Text style={styles.packPrice}>{pack.price.toLocaleString()}</Text>
                </View>
              </View>

              {/* Pack Info */}
              <View style={styles.packInfo}>
                <Text style={styles.packDescription}>{pack.description}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Purchase Bar */}
      {selectedPack && (
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
                  setQuantity(Math.max(1, num).toString());
                }}
                keyboardType="numeric"
                selectTextOnFocus
              />
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity((quantityNum + 1).toString())}
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
              Buy {quantityNum} Pack{quantityNum !== 1 ? 's' : ''}
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
            <View style={[styles.modalPackHeader, { backgroundColor: `${selectedPack?.color}20` }]}>
              <View style={[styles.modalPackIcon, { backgroundColor: selectedPack?.color || '#40ffdc' }]}>
                <Ionicons name={selectedPack?.icon as any} size={40} color="#ffffff" />
              </View>
              <Text style={styles.modalPackName}>{selectedPack?.name}</Text>
            </View>

            <Text style={styles.modalTitle}>Confirm Purchase</Text>
            <Text style={styles.modalMessage}>
              Purchase {quantityNum} {selectedPack?.name} pack{quantityNum !== 1 ? 's' : ''}?
            </Text>

            <View style={styles.modalDetails}>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Packs:</Text>
                <Text style={styles.modalDetailValue}>{quantityNum}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Price per pack:</Text>
                <Text style={styles.modalDetailValue}>{selectedPack?.price.toLocaleString()} tokens</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Total cost:</Text>
                <Text style={[styles.modalDetailValue, { color: '#40ffdc' }]}>
                  {totalCost.toLocaleString()} tokens
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
    lineHeight: 22,
  },
  packCard: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  packCardSelected: {
    borderWidth: 3,
    shadowColor: '#40ffdc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  packHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  packIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  packHeaderText: {
    flex: 1,
  },
  packName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  packRarityBadge: {
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
  packPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0a3a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  packPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 6,
  },
  packInfo: {
    padding: 20,
    paddingTop: 16,
  },
  packDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 22,
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
  modalPackHeader: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalPackIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalPackName: {
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


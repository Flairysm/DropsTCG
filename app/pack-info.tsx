import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

// Virtual Booster Packs data
const BOOSTER_PACKS: GemDrop[] = [
  {
    id: 'evolving-skies',
    name: 'Evolving Skies',
    gemType: 'Evolving Skies',
    price: 2000,
    totalBoxes: 9999,
    remainingBoxes: 9999,
    description: 'Featuring powerful Eeveelution VMAX cards and stunning alternate art cards. One of the most sought-after sets in the Pokemon TCG.',
    cardTierRange: 'A-SSS',
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
    gemType: 'Mega Inferno X',
    price: 2500,
    totalBoxes: 9999,
    remainingBoxes: 9999,
    description: 'Fire-type Pokemon collection with exclusive Mega Evolution cards. Features Charizard, Blaziken, and other powerful fire-type Pokemon.',
    cardTierRange: 'A-SSS',
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
    gemType: 'Base Set',
    price: 3000,
    totalBoxes: 9999,
    remainingBoxes: 9999,
    description: 'The original Pokemon TCG set featuring classic cards. Includes the iconic Charizard, Blastoise, and Venusaur cards.',
    cardTierRange: 'A-SSS',
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
    gemType: 'Chilling Reign',
    price: 1800,
    totalBoxes: 9999,
    remainingBoxes: 9999,
    description: 'Ice and water-type Pokemon with beautiful full-art cards. Features Galarian forms and stunning artwork.',
    cardTierRange: 'A-SS',
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

// Mystery Boxes data
const MYSTERY_BOXES: GemDrop[] = [
  {
    id: 'charizard',
    name: 'Charizard Box',
    gemType: 'Charizard',
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
    gemType: 'Pikachu',
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
    gemType: 'Eeveelution',
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
    gemType: 'Legendary',
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

export default function PackInfo() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, type } = useLocalSearchParams();
  const [quantity, setQuantity] = useState<string>('1');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const gem = useMemo(() => {
    if (type === 'mystery-box') {
      return MYSTERY_BOXES.find(g => g.id === id);
    }
    if (type === 'booster-pack') {
      return BOOSTER_PACKS.find(g => g.id === id);
    }
    return GEM_DROPS.find(g => g.id === id);
  }, [id, type]);

  if (!gem) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pack Not Found</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#ff4444" />
          <Text style={styles.notFoundText}>The requested pack could not be found.</Text>
        </View>
      </View>
    );
  }

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

  const quantityNum = parseInt(quantity) || 1;
  const totalCost = gem.price * quantityNum;
  const canPurchase = quantityNum > 0 && (type === 'booster-pack' || quantityNum <= gem.remainingBoxes);
  const progress = type === 'booster-pack' ? 0 : ((gem.totalBoxes - gem.remainingBoxes) / gem.totalBoxes) * 100;
  const rarityColor = getRarityColor(gem.rarity);

  const handlePurchase = () => {
    // TODO: Implement purchase logic via API
    console.log(`Purchasing ${quantityNum} ${gem.name} for ${totalCost} tokens`);
    setShowPurchaseModal(false);
    // Show success message and update gem state
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
          <Text style={styles.headerTitle}>Pack Information</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Pack Header */}
          <View style={[styles.packHeader, { backgroundColor: `${gem.color}20` }]}>
            <View style={[styles.packIconContainer, { backgroundColor: gem.color }]}>
              <Ionicons name={gem.icon as any} size={64} color="#ffffff" />
            </View>
            <Text style={styles.packName}>{gem.name}</Text>
            <View style={styles.packRarityBadge}>
              <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
              <Text style={[styles.rarityText, { color: rarityColor }]}>
                {gem.rarity.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Pack Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{gem.description}</Text>
          </View>

          {/* Price and Availability */}
          <View style={styles.section}>
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Price per Box</Text>
                <View style={styles.priceContainer}>
                  <Ionicons name="diamond" size={20} color="#40ffdc" />
                  <Text style={styles.priceText}>{gem.price.toLocaleString()} tokens</Text>
                </View>
              </View>
            </View>

            {type !== 'booster-pack' && (
              <View style={styles.availabilityContainer}>
                <Text style={styles.availabilityLabel}>Availability</Text>
                <Text style={styles.availabilityValue}>
                  {gem.remainingBoxes} / {gem.totalBoxes} boxes remaining
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: rarityColor }]} />
                </View>
              </View>
            )}
          </View>

          {/* Card Prize Pool */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Prize Pool</Text>
            <Text style={styles.prizePoolSubtitle}>
              Possible cards you can pull from this pack
            </Text>
            {(() => {
              // Group cards by tier
              const groupedByTier = gem.prizePool.reduce((acc, card) => {
                if (!acc[card.tier]) {
                  acc[card.tier] = [];
                }
                acc[card.tier].push(card);
                return acc;
              }, {} as Record<string, PrizePoolCard[]>);

              // Sort tiers
              const tierOrder = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'];
              const sortedTiers = Object.keys(groupedByTier).sort((a, b) => {
                return tierOrder.indexOf(a) - tierOrder.indexOf(b);
              });

              return sortedTiers.map((tier) => {
                const tierColor = getTierColor(tier);
                const cards = groupedByTier[tier];
                return (
                  <View key={tier} style={styles.tierGroup}>
                    <View style={styles.tierGroupHeader}>
                      <Text style={[styles.tierGroupText, { color: tierColor }]}>{tier}</Text>
                    </View>
                    <View style={styles.tierCardsContainer}>
                      {cards.map((card, cardIndex) => (
                        <View key={cardIndex} style={styles.prizePoolCard}>
                          {card.image ? (
                            <Image source={{ uri: card.image }} style={styles.prizePoolCardImage} resizeMode="cover" />
                          ) : (
                            <View style={styles.prizePoolCardImagePlaceholder}>
                              <Ionicons name="card-outline" size={32} color={tierColor} />
                            </View>
                          )}
                          <Text style={styles.prizePoolCardName} numberOfLines={2}>
                            {card.name}
                          </Text>
                          <Text style={styles.prizePoolProbability}>{card.probability}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                );
              });
            })()}
          </View>
        </ScrollView>

        {/* Purchase Bar */}
        {(type === 'booster-pack' || gem.remainingBoxes > 0) && (
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
                    if (type === 'booster-pack') {
                      setQuantity(Math.max(1, num).toString());
                    } else {
                      setQuantity(Math.max(1, Math.min(gem.remainingBoxes, num)).toString());
                    }
                  }}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => {
                    if (type === 'booster-pack') {
                      setQuantity((quantityNum + 1).toString());
                    } else {
                      setQuantity(Math.min(gem.remainingBoxes, quantityNum + 1).toString());
                    }
                  }}
                  disabled={type !== 'booster-pack' && quantityNum >= gem.remainingBoxes}
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
              <Ionicons name="diamond" size={18} color="#0a0019" style={{ marginRight: 4 }} />
              <View style={styles.purchaseButtonTextContainer}>
                <Text style={styles.purchaseButtonText} numberOfLines={1}>
                  Buy {quantityNum} Box{quantityNum !== 1 ? 'es' : ''}
                </Text>
                <Text style={styles.purchaseButtonPrice} numberOfLines={1}>
                  {totalCost.toLocaleString()} tokens
                </Text>
              </View>
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
              <View style={[styles.modalGemHeader, { backgroundColor: `${gem.color}20` }]}>
                <View style={[styles.modalGemIcon, { backgroundColor: gem.color }]}>
                  <Ionicons name={gem.icon as any} size={40} color="#ffffff" />
                </View>
                <Text style={styles.modalGemName}>{gem.name}</Text>
              </View>

              <Text style={styles.modalTitle}>Confirm Purchase</Text>
              <Text style={styles.modalMessage}>
                Purchase {quantityNum} {gem.name} box{quantityNum !== 1 ? 'es' : ''}?
              </Text>

              <View style={styles.modalDetails}>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Boxes:</Text>
                  <Text style={styles.modalDetailValue}>{quantityNum}</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Price per box:</Text>
                  <Text style={styles.modalDetailValue}>{gem.price.toLocaleString()} tokens</Text>
                </View>
                <View style={styles.modalDetailRow}>
                  <Text style={styles.modalDetailLabel}>Total cost:</Text>
                  <Text style={[styles.modalDetailValue, { color: '#40ffdc' }]}>
                    {totalCost.toLocaleString()} tokens
                  </Text>
                </View>
                {type !== 'booster-pack' && (
                  <View style={styles.modalDetailRow}>
                    <Text style={styles.modalDetailLabel}>Remaining after:</Text>
                    <Text style={styles.modalDetailValue}>
                      {gem.remainingBoxes - quantityNum} boxes
                    </Text>
                  </View>
                )}
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
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    paddingBottom: 150,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  notFoundText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 16,
  },
  packHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  packIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  packName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  packRarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  rarityText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#40ffdc',
    paddingLeft: 16,
    marginLeft: -20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 24,
  },
  priceRow: {
    marginBottom: 24,
  },
  priceLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 8,
  },
  priceSubtext: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.6,
  },
  availabilityContainer: {
    marginTop: 20,
  },
  availabilityLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 8,
  },
  availabilityValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#40ffdc',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  prizePoolSubtitle: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 20,
  },
  tierGroup: {
    marginBottom: 32,
  },
  tierGroupHeader: {
    marginBottom: 16,
  },
  tierGroupText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tierCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -6,
    marginRight: -6,
  },
  prizePoolCard: {
    width: '25%',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  prizePoolCardImage: {
    width: '100%',
    aspectRatio: 0.714, // Pokemon card ratio
    borderRadius: 8,
    backgroundColor: '#1a0a3a',
    marginBottom: 8,
  },
  prizePoolCardImagePlaceholder: {
    width: '100%',
    aspectRatio: 0.714,
    borderRadius: 8,
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  prizePoolCardName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  prizePoolProbability: {
    fontSize: 9,
    color: '#40ffdc',
    fontWeight: '600',
    textAlign: 'center',
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
    paddingHorizontal: 12,
    minWidth: 0,
  },
  purchaseButtonDisabled: {
    backgroundColor: 'rgba(64, 255, 220, 0.3)',
    opacity: 0.5,
  },
  purchaseButtonTextContainer: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  purchaseButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a0019',
    textAlign: 'center',
  },
  purchaseButtonPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a0019',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 2,
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
});


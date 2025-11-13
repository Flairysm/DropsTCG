import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, Modal, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 16;
const CARD_GAP = 8;
const CARDS_PER_ROW = 4;
const CARD_WIDTH = (SCREEN_WIDTH - (CARD_PADDING * 2) - (CARD_GAP * (CARDS_PER_ROW - 1))) / CARDS_PER_ROW;

interface Card {
  id: string;
  name: string;
  set: string;
  tier: string; // SSS, SS, S, A, B, C, D
  tokenValue: number; // Token value of the card
  category?: string; // e.g., 'Pokemon', 'Sports', 'One Piece'
  image?: string;
  canRefund: boolean;
  canShip: boolean;
}

const TIERS = ['All', 'SSS', 'SS', 'S', 'A', 'B', 'C', 'D'];
const SORT_OPTIONS = [
  { value: 'value-high', label: 'Value: High to Low' },
  { value: 'value-low', label: 'Value: Low to High' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
  { value: 'tier', label: 'Tier' },
];
const CATEGORIES = ['All', 'Pokemon', 'Sports', 'One Piece'];

export default function Vault() {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'refund' | 'ship' | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('value-high');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Sample card collection - replace with actual user's cards from API/state
  const [userCards, setUserCards] = useState<Card[]>([
    {
      id: '1',
      name: 'Charizard VMAX',
      set: 'Base Set',
      tier: 'SSS',
      tokenValue: 5000,
      category: 'Pokemon',
      canRefund: true,
      canShip: true,
    },
    {
      id: '2',
      name: 'Pikachu VMAX',
      set: 'Jungle',
      tier: 'SS',
      tokenValue: 3000,
      category: 'Pokemon',
      canRefund: true,
      canShip: true,
    },
    {
      id: '3',
      name: 'Blastoise VMAX',
      set: 'Base Set',
      tier: 'S',
      tokenValue: 2000,
      category: 'Pokemon',
      canRefund: true,
      canShip: true,
    },
    {
      id: '4',
      name: 'Venusaur VMAX',
      set: 'Base Set',
      tier: 'A',
      tokenValue: 1500,
      category: 'Pokemon',
      canRefund: true,
      canShip: true,
    },
    {
      id: '5',
      name: 'Mewtwo VMAX',
      set: 'Fossil',
      tier: 'SSS',
      tokenValue: 4500,
      category: 'Pokemon',
      canRefund: true,
      canShip: true,
    },
    {
      id: '6',
      name: 'Gyarados VMAX',
      set: 'Base Set',
      tier: 'B',
      tokenValue: 1000,
      category: 'Pokemon',
      canRefund: true,
      canShip: true,
    },
    {
      id: '7',
      name: 'Alakazam VMAX',
      set: 'Base Set',
      tier: 'C',
      tokenValue: 500,
      category: 'Pokemon',
      canRefund: true,
      canShip: true,
    },
    {
      id: '8',
      name: 'Machamp VMAX',
      set: 'Base Set',
      tier: 'D',
      tokenValue: 200,
      category: 'Pokemon',
      canRefund: true,
      canShip: true,
    },
    {
      id: '9',
      name: 'Michael Jordan Rookie',
      set: '1986 Fleer',
      tier: 'SSS',
      tokenValue: 8000,
      category: 'Sports',
      canRefund: true,
      canShip: true,
    },
    {
      id: '10',
      name: 'LeBron James Rookie',
      set: '2003 Topps',
      tier: 'SS',
      tokenValue: 4000,
      category: 'Sports',
      canRefund: true,
      canShip: true,
    },
  ]);

  const toggleCardSelection = (cardId: string) => {
    const newSelection = new Set(selectedCards);
    if (newSelection.has(cardId)) {
      newSelection.delete(cardId);
    } else {
      newSelection.add(cardId);
    }
    setSelectedCards(newSelection);
  };

  const handleAction = (type: 'refund' | 'ship') => {
    setActionType(type);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (selectedCards.size > 0 && actionType) {
      if (actionType === 'refund') {
        // Remove refunded cards from the vault
        setUserCards(prevCards => 
          prevCards.filter(card => !selectedCards.has(card.id))
        );
        // TODO: Add tokens back to user's balance via API
      } else if (actionType === 'ship') {
        // TODO: Implement shipment logic (mark as shipped, create order, etc.)
        // For now, we can remove shipped cards or mark them differently
        // Removing them for now - you can change this behavior if needed
        setUserCards(prevCards => 
          prevCards.filter(card => !selectedCards.has(card.id))
        );
      }
      setShowActionModal(false);
      setSelectedCards(new Set());
      setActionType(null);
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

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let filtered = userCards;

    // Filter by tier
    if (selectedTier !== 'All') {
      filtered = filtered.filter(card => card.tier === selectedTier);
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(card => 
        card.name.toLowerCase().includes(query) ||
        card.set.toLowerCase().includes(query)
      );
    }

    // Sort cards
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'value-high':
          return b.tokenValue - a.tokenValue;
        case 'value-low':
          return a.tokenValue - b.tokenValue;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'tier':
          const tierOrder = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'];
          return tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier);
        default:
          return 0;
      }
    });

    return sorted;
  }, [userCards, selectedTier, selectedCategory, searchQuery, sortBy]);

  const selectedCardsArray = filteredCards.filter(card => selectedCards.has(card.id));
  const canRefundSelected = selectedCardsArray.length > 0 && selectedCardsArray.every(card => card.canRefund);
  const canShipSelected = selectedCardsArray.length > 0 && selectedCardsArray.every(card => card.canShip);
  const hasSelection = selectedCards.size > 0;
  const allSelected = filteredCards.length > 0 && selectedCards.size === filteredCards.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(filteredCards.map(card => card.id)));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="lock-closed" size={28} color="#40ffdc" />
          <Text style={styles.headerTitle}>MY VAULT</Text>
        </View>
        <Text style={styles.headerDescription}>
          Manage your cards and arrange delivery for all your items in the vaulty
        </Text>
        <Text style={styles.headerSubtitle}>
          {filteredCards.length} {selectedTier === 'All' ? 'cards' : `${selectedTier} cards`} in collection
          {hasSelection && ` • ${selectedCards.size} selected`}
        </Text>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchFilterBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.5)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cards..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.7}
        >
          <Ionicons name="options" size={20} color="#40ffdc" />
        </TouchableOpacity>
      </View>

      {/* Filter Panel */}
      {showFilters && (
        <View style={styles.filterPanel}>
          {/* Sort Options */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterOption,
                    sortBy === option.value && styles.filterOptionActive
                  ]}
                  onPress={() => setSortBy(option.value)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      sortBy === option.value && styles.filterOptionTextActive
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Category Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterOptions}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    selectedCategory === category && styles.filterOptionActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedCategory === category && styles.filterOptionTextActive
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Tier Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tierFilterContainer}
        contentContainerStyle={styles.tierFilterContent}
      >
        {TIERS.map((tier) => {
          const isSelected = selectedTier === tier;
          const tierColor = tier === 'All' ? '#40ffdc' : getTierColor(tier);
          return (
            <TouchableOpacity
              key={tier}
              style={[
                styles.tierFilterTab,
                isSelected && [styles.tierFilterTabActive, { borderColor: tierColor }]
              ]}
              onPress={() => {
                setSelectedTier(tier);
                setSelectedCards(new Set()); // Clear selection when changing filter
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tierFilterText,
                  isSelected && [styles.tierFilterTextActive, { color: tierColor }]
                ]}
              >
                {tier}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Cards Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsGrid}>
          {filteredCards.map((card, index) => {
            const isSelected = selectedCards.has(card.id);
            const tierColor = getTierColor(card.tier);
            const isLastInRow = (index + 1) % CARDS_PER_ROW === 0;
            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardContainer,
                  isSelected && styles.cardContainerSelected,
                  isLastInRow && styles.cardLastInRow
                ]}
                onPress={() => toggleCardSelection(card.id)}
                activeOpacity={0.8}
              >
                {/* Selection Checkbox */}
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={16} color="#0a0019" />}
                </View>

                {/* Card Image */}
                <View style={styles.cardImageContainer}>
                  {card.image ? (
                    <Image source={{ uri: card.image }} style={styles.cardImage} />
                  ) : (
                    <View style={styles.cardPlaceholder}>
                      <Ionicons name="card" size={32} color={tierColor} />
                    </View>
                  )}
                  {/* Tier Badge */}
                  <View style={[styles.tierBadge, { backgroundColor: tierColor }]}>
                    <Text style={styles.tierText}>{card.tier}</Text>
                  </View>
                </View>

                {/* Card Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {card.name}
                  </Text>
                  <Text style={styles.cardSet} numberOfLines={1}>
                    {card.set}
                  </Text>
                  <View style={styles.tokenValueContainer}>
                    <Ionicons name="diamond" size={12} color="#40ffdc" />
                    <Text style={styles.tokenValue}>
                      {card.tokenValue.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Action Buttons Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.selectAllButton}
          onPress={handleSelectAll}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={allSelected ? "checkbox" : "square-outline"} 
            size={20} 
            color="#40ffdc" 
          />
          <Text style={styles.selectAllText}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.actionBarButton,
              styles.refundButton,
              (!hasSelection || !canRefundSelected) && styles.actionButtonDisabled
            ]}
            onPress={() => handleAction('refund')}
            disabled={!hasSelection || !canRefundSelected}
            activeOpacity={0.7}
          >
            <Ionicons name="cash-outline" size={20} color="#ffffff" />
            <Text style={styles.actionBarButtonText}>Refund</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionBarButton,
              styles.shipButton,
              (!hasSelection || !canShipSelected) && styles.actionButtonDisabled
            ]}
            onPress={() => handleAction('ship')}
            disabled={!hasSelection || !canShipSelected}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="cube-outline" 
              size={20} 
              color={(!hasSelection || !canShipSelected) ? "#ffffff" : "#0a0019"} 
            />
            <Text style={[
              styles.actionBarButtonText,
              (!hasSelection || !canShipSelected) ? {} : styles.shipButtonText
            ]}>
              Ship
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Confirmation Modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {actionType === 'refund' ? 'Refund Cards' : 'Ship Cards'}
            </Text>
            <Text style={styles.modalDescription}>
              {actionType === 'refund'
                ? `Are you sure you want to refund ${selectedCards.size} card${selectedCards.size > 1 ? 's' : ''}? You will receive tokens back.`
                : `Ship ${selectedCards.size} card${selectedCards.size > 1 ? 's' : ''} to your registered address?`}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowActionModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmAction}
              >
                <Text style={styles.confirmButtonText}>
                  {actionType === 'refund' ? 'Refund' : 'Ship'}
                </Text>
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
    padding: 20,
    paddingTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 4, 43, 0.3)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 12,
    letterSpacing: 1,
  },
  headerDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
    textAlign: 'center',
  },
  searchFilterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(18, 4, 43, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12042b',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#12042b',
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPanel: {
    backgroundColor: 'rgba(18, 4, 43, 0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
    paddingVertical: 12,
  },
  filterSection: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  filterOptionActive: {
    backgroundColor: 'rgba(64, 255, 220, 0.1)',
    borderColor: '#40ffdc',
    borderWidth: 2,
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.7,
  },
  filterOptionTextActive: {
    opacity: 1,
    fontWeight: '700',
    color: '#40ffdc',
  },
  tierFilterContainer: {
    backgroundColor: 'rgba(18, 4, 43, 0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
    maxHeight: 40,
    height: 40,
  },
  tierFilterContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tierFilterTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  tierFilterTabActive: {
    backgroundColor: 'rgba(64, 255, 220, 0.1)',
    borderWidth: 2,
  },
  tierFilterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.7,
  },
  tierFilterTextActive: {
    opacity: 1,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: CARD_PADDING,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
    marginBottom: 16,
    backgroundColor: '#12042b',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(64, 255, 220, 0.15)',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardLastInRow: {
    marginRight: 0,
  },
  cardContainerSelected: {
    borderColor: '#40ffdc',
    borderWidth: 3,
    shadowColor: '#40ffdc',
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 2,
    borderColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  checkboxSelected: {
    backgroundColor: '#40ffdc',
    borderColor: '#40ffdc',
    shadowColor: '#40ffdc',
    shadowOpacity: 0.8,
  },
  cardImageContainer: {
    width: '100%',
    aspectRatio: 0.714, // Pokemon card ratio
    backgroundColor: '#1a0a3a',
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(26, 10, 58, 0.5)',
  },
  tierBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  tierText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0a0019',
    letterSpacing: 0.5,
  },
  cardInfo: {
    padding: 10,
    backgroundColor: 'rgba(18, 4, 43, 0.8)',
  },
  cardName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
    lineHeight: 14,
  },
  cardSet: {
    fontSize: 9,
    color: '#ffffff',
    opacity: 0.7,
    fontWeight: '500',
    marginBottom: 4,
  },
  tokenValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  tokenValue: {
    fontSize: 10,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 4,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#12042b',
    borderTopWidth: 2,
    borderTopColor: 'rgba(64, 255, 220, 0.3)',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 6,
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#40ffdc',
  },
  actionButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  actionBarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  refundButton: {
    backgroundColor: '#ff4444',
  },
  shipButton: {
    backgroundColor: '#40ffdc',
  },
  actionButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  actionBarButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  shipButtonText: {
    color: '#0a0019',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  confirmButton: {
    backgroundColor: '#40ffdc',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0019',
  },
});

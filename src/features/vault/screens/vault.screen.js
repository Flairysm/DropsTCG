import React, { useState, useMemo, useCallback } from 'react';
import {
  ScrollView as RNScrollView,
  StatusBar as RNStatusBar,
  Platform,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 16;
const CARD_GAP = 8;
const CARDS_PER_ROW = 4;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_PADDING * 2 - CARD_GAP * (CARDS_PER_ROW - 1)) / CARDS_PER_ROW;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  z-index: 10;
  elevation: 10;
`;

const Header = styled.View`
  padding: 20px;
  padding-top: 24px;
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
  align-items: center;
  background-color: rgba(18, 4, 43, 0.3);
`;

const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

const HeaderTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-left: 12px;
  letter-spacing: 1px;
`;

const HeaderDescription = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.8;
  margin-bottom: 8px;
  line-height: 20px;
  text-align: center;
`;

const HeaderSubtitle = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  text-align: center;
`;

const SearchFilterBar = styled.View`
  flex-direction: row;
  padding-horizontal: 16px;
  padding-vertical: 12px;
  background-color: rgba(18, 4, 43, 0.5);
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
`;

const SearchContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 8px;
  padding-horizontal: 12px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  margin-right: 12px;
`;

const SearchInput = styled(TextInput)`
  flex: 1;
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  padding-vertical: 8px;
`;

const FilterButton = styled(TouchableOpacity)`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  justify-content: center;
  align-items: center;
`;

const FilterPanel = styled.View`
  background-color: rgba(18, 4, 43, 0.7);
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
  padding-vertical: 12px;
`;

const FilterSection = styled.View`
  margin-bottom: 12px;
  padding-horizontal: 16px;
`;

const FilterSectionTitle = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterOptions = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  flex-direction: row;
`;

const FilterOption = styled(TouchableOpacity)`
  padding-horizontal: 12px;
  padding-vertical: 6px;
  border-radius: 6px;
  border-width: ${(props) => (props.active ? '2px' : '1px')};
  border-color: ${(props) =>
    props.active ? props.theme.colors.accent : props.theme.colors.border};
  background-color: ${(props) =>
    props.active ? 'rgba(64, 255, 220, 0.1)' : 'transparent'};
  margin-right: 8px;
`;

const FilterOptionText = styled.Text`
  font-size: 12px;
  font-weight: ${(props) => (props.active ? '700' : '600')};
  color: ${(props) => (props.active ? props.theme.colors.accent : props.theme.colors.text)};
  opacity: ${(props) => (props.active ? 1 : 0.7)};
`;

const TierFilterContainer = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
})`
  background-color: rgba(18, 4, 43, 0.5);
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
  max-height: 40px;
  height: 40px;
`;

const TierFilterTab = styled(TouchableOpacity)`
  padding-horizontal: 16px;
  padding-vertical: 6px;
  border-radius: 6px;
  border-width: ${(props) => (props.active ? '2px' : '1px')};
  border-color: ${(props) => (props.active ? props.tierColor : props.theme.colors.border)};
  background-color: ${(props) =>
    props.active ? 'rgba(64, 255, 220, 0.1)' : 'transparent'};
  margin-right: 8px;
`;

const TierFilterText = styled.Text`
  font-size: 13px;
  font-weight: ${(props) => (props.active ? '700' : '600')};
  color: ${(props) => (props.active ? props.tierColor : props.theme.colors.text)};
  opacity: ${(props) => (props.active ? 1 : 0.7)};
`;

const CardsScrollView = styled(RNScrollView)`
  flex: 1;
`;

const CardsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: ${CARD_PADDING}px;
  padding-bottom: 100px;
`;

const CardContainer = styled(TouchableOpacity)`
  width: ${CARD_WIDTH}px;
  margin-right: ${(props) => (props.isLastInRow ? '0px' : CARD_GAP)}px;
  margin-bottom: 16px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  overflow: hidden;
  border-width: ${(props) => (props.selected ? '3px' : '2px')};
  border-color: ${(props) =>
    props.selected ? props.theme.colors.accent : props.theme.colors.border};
  position: relative;
`;

const Checkbox = styled.View`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${(props) =>
    props.selected ? props.theme.colors.accent : 'rgba(0, 0, 0, 0.7)'};
  border-width: 2px;
  border-color: ${(props) =>
    props.selected ? props.theme.colors.accent : props.theme.colors.text};
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const CardImageContainer = styled.View`
  width: 100%;
  aspect-ratio: 0.714;
  background-color: ${(props) => props.theme.colors.tertiary};
  position: relative;
  overflow: hidden;
`;

const CardPlaceholder = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background-color: rgba(26, 10, 58, 0.5);
`;

const TierBadge = styled.View`
  position: absolute;
  bottom: 6px;
  left: 6px;
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 6px;
  background-color: ${(props) => props.tierColor};
`;

const TierText = styled.Text`
  font-size: 9px;
  font-weight: 800;
  color: ${(props) => props.theme.colors.primary};
  letter-spacing: 0.5px;
`;

const CardInfo = styled.View`
  padding: 10px;
  background-color: rgba(18, 4, 43, 0.8);
`;

const CardName = styled.Text`
  font-size: 11px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
  line-height: 14px;
`;

const CardSet = styled.Text`
  font-size: 9px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  font-weight: 500;
  margin-bottom: 4px;
`;

const TokenValueContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 2px;
`;

const TokenValue = styled.Text`
  font-size: 10px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
  margin-left: 4px;
`;

const ActionBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${(props) => props.theme.colors.secondary};
  border-top-width: 2px;
  border-top-color: rgba(64, 255, 220, 0.3);
  padding-horizontal: 20px;
  padding-top: 12px;
  padding-bottom: 8px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const SelectAllButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding-vertical: 8px;
  padding-horizontal: 10px;
  gap: 6px;
`;

const SelectAllText = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.accent};
`;

const ActionButtonsContainer = styled.View`
  flex: 1;
  flex-direction: row;
  gap: 12px;
`;

const ActionBarButton = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-vertical: 12px;
  border-radius: 10px;
  gap: 6px;
  background-color: ${(props) =>
    props.disabled
      ? 'rgba(255, 255, 255, 0.1)'
      : props.type === 'refund'
        ? props.theme.colors.error
        : props.theme.colors.accent};
  opacity: ${(props) => (props.disabled ? 0.4 : 1)};
`;

const ActionBarButtonText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${(props) => (props.type === 'ship' && !props.disabled ? props.theme.colors.primary : props.theme.colors.text)};
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContent = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 12px;
  text-align: center;
`;

const ModalDescription = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.8;
  text-align: center;
  margin-bottom: 24px;
  line-height: 20px;
`;

const ModalButtons = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ModalButton = styled(TouchableOpacity)`
  flex: 1;
  padding-vertical: 14px;
  border-radius: 12px;
  align-items: center;
  background-color: ${(props) =>
    props.type === 'cancel'
      ? 'rgba(255, 255, 255, 0.1)'
      : props.theme.colors.accent};
  border-width: ${(props) => (props.type === 'cancel' ? '1px' : '0px')};
  border-color: ${(props) => (props.type === 'cancel' ? 'rgba(255, 255, 255, 0.2)' : 'transparent')};
`;

const ModalButtonText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => (props.type === 'cancel' ? props.theme.colors.text : props.theme.colors.primary)};
`;

const TIERS = ['All', 'SSS', 'SS', 'S', 'A', 'B', 'C', 'D'];

const SORT_OPTIONS = [
  { value: 'value-high', label: 'Value: High to Low' },
  { value: 'value-low', label: 'Value: Low to High' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
  { value: 'tier', label: 'Tier' },
];

const CATEGORIES = ['All', 'Pokemon', 'Sports', 'One Piece'];

export default function VaultScreen() {
  const theme = useTheme();
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedTier, setSelectedTier] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('value-high');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Sample card collection - TODO: Replace with actual user's cards from API/state
  const [userCards, setUserCards] = useState([
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

  const toggleCardSelection = useCallback(
    (cardId) => {
      setSelectedCards((prev) => {
        const newSelection = new Set(prev);
        if (newSelection.has(cardId)) {
          newSelection.delete(cardId);
        } else {
          newSelection.add(cardId);
        }
        return newSelection;
      });
    },
    []
  );

  const handleAction = useCallback((type) => {
    setActionType(type);
    setShowActionModal(true);
  }, []);

  const confirmAction = useCallback(() => {
    if (selectedCards.size > 0 && actionType) {
      if (actionType === 'refund') {
        // Remove refunded cards from the vault
        setUserCards((prevCards) => prevCards.filter((card) => !selectedCards.has(card.id)));
        // TODO: Add tokens back to user's balance via API
      } else if (actionType === 'ship') {
        // TODO: Implement shipment logic
        setUserCards((prevCards) => prevCards.filter((card) => !selectedCards.has(card.id)));
      }
      setShowActionModal(false);
      setSelectedCards(new Set());
      setActionType(null);
    }
  }, [selectedCards, actionType]);

  const getTierColor = useCallback(
    (tier) => {
      return theme.colors.tier?.[tier] || theme.colors.accent;
    },
    [theme.colors]
  );

  // Filter and sort cards
  const filteredCards = useMemo(() => {
    let filtered = userCards;

    if (selectedTier !== 'All') {
      filtered = filtered.filter((card) => card.tier === selectedTier);
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((card) => card.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(query) || card.set.toLowerCase().includes(query)
      );
    }

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

  const selectedCardsArray = useMemo(
    () => filteredCards.filter((card) => selectedCards.has(card.id)),
    [filteredCards, selectedCards]
  );

  const canRefundSelected = useMemo(
    () => selectedCardsArray.length > 0 && selectedCardsArray.every((card) => card.canRefund),
    [selectedCardsArray]
  );

  const canShipSelected = useMemo(
    () => selectedCardsArray.length > 0 && selectedCardsArray.every((card) => card.canShip),
    [selectedCardsArray]
  );

  const hasSelection = selectedCards.size > 0;
  const allSelected = useMemo(
    () => filteredCards.length > 0 && selectedCards.size === filteredCards.length,
    [filteredCards.length, selectedCards.size]
  );

  const handleSelectAll = useCallback(() => {
    if (allSelected) {
      setSelectedCards(new Set());
    } else {
      setSelectedCards(new Set(filteredCards.map((card) => card.id)));
    }
  }, [allSelected, filteredCards]);

  return (
    <Container edges={['left', 'right']}>
      {/* Expo StatusBar for iOS */}
      <StatusBar style="light" />
      {/* React Native StatusBar for Android */}
      {Platform.OS === 'android' && (
        <RNStatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.primary}
          translucent={false}
        />
      )}

      {/* Header */}
      <Header>
        <HeaderContent>
          <Ionicons name="lock-closed" size={28} color={theme.colors.accent} />
          <HeaderTitle>MY VAULT</HeaderTitle>
        </HeaderContent>
        <HeaderDescription>
          Manage your cards and arrange delivery for all your items in the vault
        </HeaderDescription>
        <HeaderSubtitle>
          {filteredCards.length} {selectedTier === 'All' ? 'cards' : `${selectedTier} cards`} in
          collection
          {hasSelection && ` • ${selectedCards.size} selected`}
        </HeaderSubtitle>
      </Header>

      {/* Search and Filter Bar */}
      <SearchFilterBar>
        <SearchContainer>
          <Ionicons
            name="search"
            size={20}
            color="rgba(255, 255, 255, 0.5)"
            style={{ marginRight: 8 }}
          />
          <SearchInput
            placeholder="Search cards..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          )}
        </SearchContainer>
        <FilterButton onPress={() => setShowFilters(!showFilters)} activeOpacity={0.7}>
          <Ionicons name="options" size={20} color={theme.colors.accent} />
        </FilterButton>
      </SearchFilterBar>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel>
          {/* Sort Options */}
          <FilterSection>
            <FilterSectionTitle>Sort By</FilterSectionTitle>
            <FilterOptions>
              {SORT_OPTIONS.map((option) => (
                <FilterOption
                  key={option.value}
                  active={sortBy === option.value}
                  onPress={() => setSortBy(option.value)}
                  activeOpacity={0.7}
                >
                  <FilterOptionText active={sortBy === option.value}>
                    {option.label}
                  </FilterOptionText>
                </FilterOption>
              ))}
            </FilterOptions>
          </FilterSection>

          {/* Category Filter */}
          <FilterSection>
            <FilterSectionTitle>Category</FilterSectionTitle>
            <FilterOptions>
              {CATEGORIES.map((category) => (
                <FilterOption
                  key={category}
                  active={selectedCategory === category}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.7}
                >
                  <FilterOptionText active={selectedCategory === category}>
                    {category}
                  </FilterOptionText>
                </FilterOption>
              ))}
            </FilterOptions>
          </FilterSection>
        </FilterPanel>
      )}

      {/* Tier Filter Tabs */}
      <TierFilterContainer>
        {TIERS.map((tier) => {
          const isSelected = selectedTier === tier;
          const tierColor = tier === 'All' ? theme.colors.accent : getTierColor(tier);
          return (
            <TierFilterTab
              key={tier}
              active={isSelected}
              tierColor={tierColor}
              onPress={() => {
                setSelectedTier(tier);
                setSelectedCards(new Set());
              }}
              activeOpacity={0.7}
            >
              <TierFilterText active={isSelected} tierColor={tierColor}>
                {tier}
              </TierFilterText>
            </TierFilterTab>
          );
        })}
      </TierFilterContainer>

      {/* Cards Grid */}
      <CardsScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        <CardsGrid>
          {filteredCards.map((card, index) => {
            const isSelected = selectedCards.has(card.id);
            const tierColor = getTierColor(card.tier);
            const isLastInRow = (index + 1) % CARDS_PER_ROW === 0;

            return (
              <CardContainer
                key={card.id}
                selected={isSelected}
                isLastInRow={isLastInRow}
                onPress={() => toggleCardSelection(card.id)}
                activeOpacity={0.8}
              >
                {/* Selection Checkbox */}
                <Checkbox selected={isSelected}>
                  {isSelected && <Ionicons name="checkmark" size={16} color={theme.colors.primary} />}
                </Checkbox>

                {/* Card Image */}
                <CardImageContainer>
                  {card.image ? (
                    <Image source={{ uri: card.image }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <CardPlaceholder>
                      <Ionicons name="card" size={32} color={tierColor} />
                    </CardPlaceholder>
                  )}

                  {/* Tier Badge */}
                  <TierBadge tierColor={tierColor}>
                    <TierText>{card.tier}</TierText>
                  </TierBadge>
                </CardImageContainer>

                {/* Card Info */}
                <CardInfo>
                  <CardName numberOfLines={1}>{card.name}</CardName>
                  <CardSet numberOfLines={1}>{card.set}</CardSet>
                  <TokenValueContainer>
                    <Ionicons name="diamond" size={12} color={theme.colors.accent} />
                    <TokenValue>{card.tokenValue.toLocaleString()}</TokenValue>
                  </TokenValueContainer>
                </CardInfo>
              </CardContainer>
            );
          })}
        </CardsGrid>
      </CardsScrollView>

      {/* Action Buttons Bar */}
      <ActionBar>
        <SelectAllButton onPress={handleSelectAll} activeOpacity={0.7}>
          <Ionicons
            name={allSelected ? 'checkbox' : 'square-outline'}
            size={20}
            color={theme.colors.accent}
          />
          <SelectAllText>{allSelected ? 'Deselect All' : 'Select All'}</SelectAllText>
        </SelectAllButton>

        <ActionButtonsContainer>
          <ActionBarButton
            type="refund"
            disabled={!hasSelection || !canRefundSelected}
            onPress={() => handleAction('refund')}
            activeOpacity={0.7}
          >
            <Ionicons name="cash-outline" size={20} color={theme.colors.text} />
            <ActionBarButtonText type="refund">Refund</ActionBarButtonText>
          </ActionBarButton>
          <ActionBarButton
            type="ship"
            disabled={!hasSelection || !canShipSelected}
            onPress={() => handleAction('ship')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="cube-outline"
              size={20}
              color={!hasSelection || !canShipSelected ? theme.colors.text : theme.colors.primary}
            />
            <ActionBarButtonText type="ship" disabled={!hasSelection || !canShipSelected}>
              Ship
            </ActionBarButtonText>
          </ActionBarButton>
        </ActionButtonsContainer>
      </ActionBar>

      {/* Action Confirmation Modal */}
      <Modal
        visible={showActionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionModal(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>
              {actionType === 'refund' ? 'Refund Cards' : 'Ship Cards'}
            </ModalTitle>
            <ModalDescription>
              {actionType === 'refund'
                ? `Are you sure you want to refund ${selectedCards.size} card${selectedCards.size > 1 ? 's' : ''}? You will receive tokens back.`
                : `Ship ${selectedCards.size} card${selectedCards.size > 1 ? 's' : ''} to your registered address?`}
            </ModalDescription>
            <ModalButtons>
              <ModalButton
                type="cancel"
                onPress={() => setShowActionModal(false)}
                activeOpacity={0.7}
              >
                <ModalButtonText type="cancel">Cancel</ModalButtonText>
              </ModalButton>
              <ModalButton type="confirm" onPress={confirmAction} activeOpacity={0.7}>
                <ModalButtonText type="confirm">
                  {actionType === 'refund' ? 'Refund' : 'Ship'}
                </ModalButtonText>
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}


import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useState } from 'react';
import {
    Modal,
    Platform,
    ScrollView as RNScrollView,
    StatusBar as RNStatusBar,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import styled, { useTheme } from 'styled-components/native';

const Container = styled(View)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 20px;
  padding-vertical: 8px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
`;

const BackButton = styled(TouchableOpacity)`
  padding: 4px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const HeaderRight = styled.View`
  width: 32px;
`;

const ScrollView = styled(RNScrollView)`
  flex: 1;
`;

const ScrollContent = styled.View`
  padding: 24px;
  padding-bottom: 140px;
`;

const HeaderImageContainer = styled.View`
  width: 100%;
  height: 200px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  margin-bottom: 24px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const HeaderImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const HeaderImagePlaceholder = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => `${props.bgColor}30`};
`;

const DescriptionSection = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const DescriptionTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 8px;
`;

const DescriptionText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.8;
  line-height: 20px;
`;

const GemCard = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
  border-width: 2px;
  border-color: ${(props) =>
    props.selected
      ? props.rarityColor
      : props.theme.colors.borderLight};
  ${(props) =>
    props.selected &&
    `
    border-width: 3px;
    shadow-color: ${props.rarityColor};
    shadow-offset: 0px 4px;
    shadow-opacity: 0.5;
    shadow-radius: 12px;
    elevation: 8;
  `}
`;

const GemHeader = styled.View`
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => `${props.bgColor}20`};
`;

const GemHeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const GemIconContainer = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  background-color: ${(props) => props.bgColor};
`;

const GemHeaderText = styled.View`
  flex: 1;
`;

const GemName = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
`;

const GemRarityBadge = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RarityDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin-right: 6px;
  background-color: ${(props) => props.color};
`;

const RarityText = styled.Text`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${(props) => props.color};
`;

const GemPriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primary};
  opacity: 0.3;
  padding-horizontal: 12px;
  padding-vertical: 8px;
  border-radius: 8px;
`;

const GemPrice = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
  margin-left: 6px;
`;

const GemInfo = styled.View`
  padding: 20px;
  padding-top: 16px;
`;

const GemDescription = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.8;
  line-height: 22px;
  margin-bottom: 16px;
`;

const AvailabilityContainer = styled.View`
  margin-top: 8px;
`;

const AvailabilityRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const AvailabilityLabel = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
`;

const AvailabilityValue = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AvailabilityValueText = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
`;

const ProgressBar = styled.View`
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.View`
  height: 100%;
  border-radius: 3px;
  background-color: ${(props) => props.color};
`;

const PurchaseBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${(props) => props.theme.colors.secondary};
  border-top-width: 2px;
  border-top-color: ${(props) => props.theme.colors.borderLight};
  padding-horizontal: 20px;
  padding-vertical: 8px;
  flex-direction: row;
  align-items: center;
`;

const QuantityContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
  background-color: rgba(10, 0, 25, 0.3);
  border-radius: 8px;
  padding-horizontal: 12px;
  padding-vertical: 8px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const QuantityLabel = styled.Text`
  font-size: 14px;
  color: #ffffff;
  margin-right: 8px;
  font-weight: 600;
`;

const QuantityControls = styled.View`
  flex-direction: row;
  align-items: center;
`;

const QuantityButton = styled(TouchableOpacity)`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  background-color: rgba(64, 255, 220, 0.2);
  border-radius: 6px;
`;

const QuantityValueWrapper = styled.View`
  margin-horizontal: 12px;
  min-width: 40px;
`;

const PurchaseButton = styled(TouchableOpacity)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.disabled ? 'rgba(64, 255, 220, 0.3)' : props.theme.colors.accent};
  border-radius: 12px;
  padding-vertical: 10px;
  padding-horizontal: 8px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  min-width: 0;
`;

const PurchaseButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  flex-shrink: 1;
  flex-wrap: wrap;
  justify-content: center;
`;

const PurchaseButtonText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  flex-shrink: 1;
`;

const PurchaseButtonPrice = styled.Text`
  font-size: 11px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  opacity: 0.8;
  margin-left: 4px;
  flex-shrink: 1;
`;

const SelectedGemDetails = styled.View`
  padding: 20px;
  padding-top: 0;
`;

const DetailsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const DetailsHeaderIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  background-color: ${(props) => props.bgColor};
`;

const DetailsHeaderText = styled.View`
  flex: 1;
`;

const DetailsTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
`;

const DetailsSubtitle = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  line-height: 16px;
`;

const DetailsPriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primary};
  opacity: 0.3;
  padding-horizontal: 12px;
  padding-vertical: 8px;
  border-radius: 8px;
`;

const DetailsPrice = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
  margin-left: 6px;
`;

const PrizePoolSection = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 16px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const PrizePoolTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
`;

const PrizePoolSubtitle = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 16px;
`;

const PrizePoolTierGroup = styled.View`
  margin-bottom: 24px;
`;

const TierGroupHeader = styled.View`
  margin-bottom: 12px;
`;

const TierGroupTitle = styled.Text`
  font-size: 20px;
  font-weight: 800;
  color: ${(props) => props.color};
  letter-spacing: 1px;
`;

const CardsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const CardItem = styled.View`
  width: 19%;
  margin-right: 1.25%;
  margin-bottom: 12px;
  background-color: ${(props) => props.theme.colors.primary};
  opacity: 0.3;
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${(props) => props.tierColor || props.theme.colors.borderLight};
  ${(props) => props.tierColor && `
    shadow-color: ${props.tierColor};
    shadow-offset: 0px 0px;
    shadow-opacity: 0.6;
    shadow-radius: 8px;
    elevation: 4;
  `}
`;

const CardImageContainer = styled.View`
  width: 100%;
  aspect-ratio: 0.714;
  background-color: ${(props) => props.theme.colors.tertiary};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const CardPlaceholder = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background-color: rgba(26, 10, 58, 0.5);
`;

const ModalOverlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 20px;
  padding: 28px;
  width: 85%;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const ModalGemHeader = styled.View`
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  background-color: ${(props) => `${props.bgColor}20`};
`;

const ModalGemIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  background-color: ${(props) => props.bgColor};
`;

const ModalGemName = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;
  text-align: center;
`;

const ModalMessage = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.8;
  text-align: center;
  margin-bottom: 24px;
  line-height: 22px;
`;

const ModalDetails = styled.View`
  background-color: ${(props) => props.theme.colors.primary};
  opacity: 0.3;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
`;

const ModalDetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ModalDetailLabel = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
`;

const ModalDetailValue = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${(props) => props.color || props.theme.colors.accent};
`;

const ModalButtons = styled.View`
  flex-direction: row;
`;

const ModalButton = styled(TouchableOpacity)`
  flex: 1;
  padding-vertical: 14px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
`;

const ModalCancelButton = styled(ModalButton)`
  background-color: rgba(255, 255, 255, 0.1);
  margin-right: 12px;
`;

const ModalConfirmButton = styled(ModalButton)`
  background-color: ${(props) => props.theme.colors.accent};
`;

const ModalButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const ModalConfirmButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`;

const GEM_DROPS = [
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
    color: '#B9F2FF',
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
    color: '#50C878',
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
    color: '#E0115F',
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
    color: '#0F52BA',
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
    color: '#000000',
    prizePool: [
      { name: 'PSA 10 Charizard VMAX', tier: 'SSS', probability: 'Guaranteed' },
      { name: 'PSA 10 Pikachu VMAX', tier: 'SSS', probability: 'Guaranteed' },
      { name: 'PSA 10 Mewtwo VMAX', tier: 'SSS', probability: 'Guaranteed' },
      { name: 'PSA 10 Blastoise VMAX', tier: 'SSS', probability: 'Guaranteed' },
      { name: 'PSA 10 Venusaur VMAX', tier: 'SSS', probability: 'Guaranteed' },
    ],
  },
];

const getRarityColor = (rarity) => {
  switch (rarity) {
    case 'common':
      return '#40ffdc';
    case 'uncommon':
      return '#50C878';
    case 'rare':
      return '#E0115F';
    case 'epic':
      return '#0F52BA';
    case 'legendary':
      return '#FFD700';
    default:
      return '#40ffdc';
  }
};

const getTierColor = (tier) => {
  switch (tier) {
    case 'SSS':
      return '#9B59B6';
    case 'SS':
      return '#FFD700';
    case 'S':
      return '#FF69B4';
    case 'A':
      return '#FF4444';
    case 'B':
      return '#10B981';
    case 'C':
      return '#3498DB';
    case 'D':
      return '#95A5A6';
    default:
      return '#40ffdc';
  }
};

export default function GemDropsScreen({ route }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const gemDropId = route?.params?.gemDropId || null;
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [quantity, setQuantity] = useState('1');

  // Find the selected gem drop
  const selectedGem = useMemo(() => {
    if (!gemDropId) return null;
    return GEM_DROPS.find((gem) => gem.id === gemDropId) || null;
  }, [gemDropId]);

  // Sort prize pool by tiers (SSS, SS, S, A, B, C, D)
  const sortedPrizePool = useMemo(() => {
    if (!selectedGem) return [];
    const tierOrder = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'];
    const grouped = selectedGem.prizePool.reduce((acc, card) => {
      if (!acc[card.tier]) {
        acc[card.tier] = [];
      }
      acc[card.tier].push(card);
      return acc;
    }, {});
    
    return tierOrder
      .filter((tier) => grouped[tier])
      .map((tier) => ({
        tier,
        cards: grouped[tier],
      }));
  }, [selectedGem]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePurchase = useCallback(() => {
    if (!selectedGem) return;
    const qty = parseInt(quantity) || 1;
    // TODO: Implement purchase logic via API
    setShowPurchaseModal(false);
    setQuantity('1');
    // Optionally navigate back after purchase
    // navigation.goBack();
  }, [selectedGem, quantity]);

  const quantityNum = useMemo(() => parseInt(quantity) || 1, [quantity]);
  const totalCost = useMemo(
    () => (selectedGem ? selectedGem.price * quantityNum : 0),
    [selectedGem, quantityNum]
  );
  const canPurchase = useMemo(
    () => selectedGem && quantityNum > 0 && quantityNum <= (selectedGem?.remainingBoxes || 0),
    [selectedGem, quantityNum]
  );

  const handleQuantityChange = useCallback(
    (text) => {
      const num = parseInt(text) || 0;
      if (selectedGem) {
        setQuantity(Math.max(1, Math.min(selectedGem.remainingBoxes, num)).toString());
      } else {
        setQuantity(text);
      }
    },
    [selectedGem]
  );

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity(Math.max(1, quantityNum - 1).toString());
  }, [quantityNum]);

  const handleIncreaseQuantity = useCallback(() => {
    if (selectedGem) {
      setQuantity(Math.min(selectedGem.remainingBoxes, quantityNum + 1).toString());
    }
  }, [selectedGem, quantityNum]);

  return (
    <Container>
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
        <BackButton onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </BackButton>
        <HeaderTitle>Gem Drops</HeaderTitle>
        <HeaderRight />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollContent>
          {!selectedGem ? (
            <DescriptionSection>
              <DescriptionTitle>No Gem Drop Selected</DescriptionTitle>
              <DescriptionText>
                Please select a gem drop from the Play screen to view details.
              </DescriptionText>
            </DescriptionSection>
          ) : (
            <>
              {/* Header Image */}
              <HeaderImageContainer>
                {selectedGem.headerImage ? (
                  <HeaderImage 
                    source={{ uri: selectedGem.headerImage }} 
                    resizeMode="contain"
                  />
                ) : (
                  <HeaderImagePlaceholder bgColor={selectedGem.color}>
                    <GemIconContainer bgColor={selectedGem.color}>
                      <Ionicons name={selectedGem.icon} size={80} color="#ffffff" />
                    </GemIconContainer>
                  </HeaderImagePlaceholder>
                )}
              </HeaderImageContainer>

              {/* Title and Description */}
              <DescriptionSection>
                <DescriptionTitle>{selectedGem.name}</DescriptionTitle>
                <DescriptionText>{selectedGem.description}</DescriptionText>
              </DescriptionSection>

              {/* Price and Availability */}
              {(() => {
                const progress = ((selectedGem.totalBoxes - selectedGem.remainingBoxes) / selectedGem.totalBoxes) * 100;
                const rarityColor = getRarityColor(selectedGem.rarity);

                return (
                  <GemCard selected={true} rarityColor={rarityColor} activeOpacity={1}>
                    <GemInfo>
                      {/* Price */}
                      <AvailabilityContainer>
                        <AvailabilityRow>
                          <AvailabilityLabel>Price:</AvailabilityLabel>
                          <AvailabilityValue>
                            <Ionicons name="diamond" size={16} color={theme.colors.accent} style={{ marginRight: 4 }} />
                            <AvailabilityValueText>{selectedGem.price.toLocaleString()} tokens</AvailabilityValueText>
                          </AvailabilityValue>
                        </AvailabilityRow>
                      </AvailabilityContainer>

                      {/* Availability */}
                      <AvailabilityContainer style={{ marginTop: 16 }}>
                        <AvailabilityRow>
                          <AvailabilityLabel>Availability:</AvailabilityLabel>
                          <AvailabilityValue>
                            <AvailabilityValueText>
                              {selectedGem.remainingBoxes} / {selectedGem.totalBoxes} boxes
                            </AvailabilityValueText>
                          </AvailabilityValue>
                        </AvailabilityRow>
                        <ProgressBar>
                          <ProgressFill color={rarityColor} style={{ width: `${progress}%` }} />
                        </ProgressBar>
                      </AvailabilityContainer>
                    </GemInfo>
                  </GemCard>
                );
              })()}

              {/* Card Prize Pool - Sorted by Tiers */}
              <PrizePoolSection>
                <PrizePoolTitle>Card Prize Pool</PrizePoolTitle>
                <PrizePoolSubtitle>
                  Possible cards you can pull from {selectedGem.name}
                </PrizePoolSubtitle>

                {sortedPrizePool.map((tierGroup) => {
                  const tierColor = getTierColor(tierGroup.tier);
                  return (
                    <PrizePoolTierGroup key={tierGroup.tier}>
                      <TierGroupHeader>
                        <TierGroupTitle color={tierColor}>{tierGroup.tier}</TierGroupTitle>
                      </TierGroupHeader>
                      <CardsGrid>
                        {tierGroup.cards.map((card, index) => (
                          <CardItem key={`${tierGroup.tier}-${index}`} tierColor={tierColor}>
                            <CardImageContainer>
                              {card.image ? (
                                <CardImage source={{ uri: card.image }} resizeMode="cover" />
                              ) : (
                                <CardPlaceholder>
                                  <Ionicons name="card" size={24} color={tierColor} />
                                </CardPlaceholder>
                              )}
                            </CardImageContainer>
                          </CardItem>
                        ))}
                      </CardsGrid>
                    </PrizePoolTierGroup>
                  );
                })}
              </PrizePoolSection>
            </>
          )}
        </ScrollContent>
      </ScrollView>

      {/* Purchase Bar */}
      {selectedGem && (
        <PurchaseBar>
          <QuantityContainer>
            <QuantityLabel>Quantity:</QuantityLabel>
            <QuantityControls>
              <QuantityButton
                onPress={handleDecreaseQuantity}
                disabled={quantityNum <= 1}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="remove" 
                  size={20} 
                  color="#ffffff"
                />
              </QuantityButton>
              <QuantityValueWrapper>
                <TextInput
                  value={quantity}
                  onChangeText={handleQuantityChange}
                  keyboardType="numeric"
                  selectTextOnFocus
                  placeholderTextColor="#ffffff"
                  underlineColorAndroid="transparent"
                  style={{ 
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '700',
                    textAlign: 'center',
                    padding: 0,
                    minWidth: 40,
                  }}
                  selectionColor="#ffffff"
                />
              </QuantityValueWrapper>
              <QuantityButton
                onPress={handleIncreaseQuantity}
                disabled={quantityNum >= selectedGem.remainingBoxes}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name="add" 
                  size={20} 
                  color="#ffffff"
                />
              </QuantityButton>
            </QuantityControls>
          </QuantityContainer>
          <PurchaseButton
            disabled={!canPurchase}
            onPress={() => setShowPurchaseModal(true)}
            activeOpacity={0.8}
          >
            <PurchaseButtonContent>
              <Ionicons name="diamond" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
              <PurchaseButtonText>
                Buy {quantityNum} Box{quantityNum !== 1 ? 'es' : ''}
              </PurchaseButtonText>
              <PurchaseButtonPrice>{totalCost.toLocaleString()} tokens</PurchaseButtonPrice>
            </PurchaseButtonContent>
          </PurchaseButton>
        </PurchaseBar>
      )}

      {/* Purchase Confirmation Modal */}
      <Modal
        visible={showPurchaseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <ModalOverlay>
          <ModalContent>
            <ModalGemHeader bgColor={selectedGem?.color}>
              <ModalGemIcon bgColor={selectedGem?.color || theme.colors.accent}>
                <Ionicons name={selectedGem?.icon} size={40} color="#ffffff" />
              </ModalGemIcon>
              <ModalGemName>{selectedGem?.name}</ModalGemName>
            </ModalGemHeader>

            <ModalTitle>Confirm Purchase</ModalTitle>
            <ModalMessage>
              Purchase {quantityNum} {selectedGem?.name} box{quantityNum !== 1 ? 'es' : ''}?
            </ModalMessage>

            <ModalDetails>
              <ModalDetailRow>
                <ModalDetailLabel>Boxes:</ModalDetailLabel>
                <ModalDetailValue>{quantityNum}</ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Price per box:</ModalDetailLabel>
                <ModalDetailValue>{selectedGem?.price.toLocaleString()} tokens</ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Total cost:</ModalDetailLabel>
                <ModalDetailValue color={theme.colors.accent}>{totalCost.toLocaleString()} tokens</ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Remaining after:</ModalDetailLabel>
                <ModalDetailValue>{(selectedGem?.remainingBoxes || 0) - quantityNum} boxes</ModalDetailValue>
              </ModalDetailRow>
            </ModalDetails>

            <ModalButtons>
              <ModalCancelButton onPress={() => setShowPurchaseModal(false)} activeOpacity={0.7}>
                <ModalButtonText>Cancel</ModalButtonText>
              </ModalCancelButton>
              <ModalConfirmButton onPress={handlePurchase} activeOpacity={0.7}>
                <ModalConfirmButtonText>Confirm</ModalConfirmButtonText>
              </ModalConfirmButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}


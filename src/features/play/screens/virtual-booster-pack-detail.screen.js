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
  View,
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

const GemInfo = styled.View`
  padding: 20px;
  padding-top: 16px;
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

const GemIconContainer = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  background-color: ${(props) => props.bgColor};
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

const VIRTUAL_BOOSTER_PACKS = [
  {
    id: 'evolving-skies',
    name: 'Evolving Skies',
    set: 'Evolving Skies',
    price: 2000,
    description: 'Featuring powerful Eeveelution VMAX cards and stunning alternate art cards. One of the most sought-after sets.',
    rarity: 'epic',
    icon: 'sparkles',
    color: '#6B46C1',
    remainingPacks: 1234,
    totalPacks: 2000,
    prizePool: [
      { name: 'Umbreon VMAX Alt Art', tier: 'SSS', probability: '1%' },
      { name: 'Espeon VMAX Alt Art', tier: 'SSS', probability: '1.5%' },
      { name: 'Rayquaza VMAX Alt Art', tier: 'SS', probability: '3%' },
      { name: 'Various Eeveelution VMAX', tier: 'SS', probability: '15%' },
      { name: 'Eeveelution V Cards', tier: 'S', probability: '30%' },
      { name: 'Common Cards', tier: 'A', probability: '49.5%' },
    ],
  },
  {
    id: 'mega-inferno-x',
    name: 'Mega Inferno X',
    set: 'Mega Inferno X',
    price: 2500,
    description: 'Fire-type Pokemon collection with exclusive Mega Evolution cards. Hot pulls guaranteed!',
    rarity: 'rare',
    icon: 'flame',
    color: '#FF6B35',
    remainingPacks: 856,
    totalPacks: 1500,
    prizePool: [
      { name: 'Charizard Mega X Alt Art', tier: 'SSS', probability: '2%' },
      { name: 'Blaziken Mega Alt Art', tier: 'SS', probability: '5%' },
      { name: 'Various Mega Evolution Cards', tier: 'S', probability: '25%' },
      { name: 'Fire-type VMAX Cards', tier: 'A', probability: '35%' },
      { name: 'Common Fire Cards', tier: 'B', probability: '33%' },
    ],
  },
  {
    id: 'base-set',
    name: 'Base Set',
    set: 'Base Set',
    price: 3000,
    description: 'The original Pokemon TCG set featuring classic cards. A piece of history in every pack.',
    rarity: 'legendary',
    icon: 'star',
    color: '#FFD700',
    remainingPacks: 234,
    totalPacks: 500,
    prizePool: [
      { name: 'Charizard Base Set', tier: 'SSS', probability: '0.5%' },
      { name: 'Blastoise Base Set', tier: 'SSS', probability: '0.5%' },
      { name: 'Venusaur Base Set', tier: 'SSS', probability: '0.5%' },
      { name: 'Rare Holo Cards', tier: 'SS', probability: '10%' },
      { name: 'Uncommon Cards', tier: 'S', probability: '30%' },
      { name: 'Common Cards', tier: 'A', probability: '58.5%' },
    ],
  },
  {
    id: 'chilling-reign',
    name: 'Chilling Reign',
    set: 'Chilling Reign',
    price: 1800,
    description: 'Ice and water-type Pokemon with beautiful full-art cards. Cool your collection with these stunning cards.',
    rarity: 'uncommon',
    icon: 'snow',
    color: '#3B82F6',
    remainingPacks: 1789,
    totalPacks: 2500,
    prizePool: [
      { name: 'Calyrex VMAX Alt Art', tier: 'SS', probability: '2%' },
      { name: 'Various Ice VMAX Cards', tier: 'S', probability: '20%' },
      { name: 'Water-type V Cards', tier: 'A', probability: '40%' },
      { name: 'Common Cards', tier: 'B', probability: '38%' },
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

export default function VirtualBoosterPackDetailScreen({ route }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const packId = route?.params?.packId || null;
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [quantity, setQuantity] = useState('1');

  // Find the selected pack
  const selectedPack = useMemo(() => {
    if (!packId) return null;
    return VIRTUAL_BOOSTER_PACKS.find((pack) => pack.id === packId) || null;
  }, [packId]);

  // Sort prize pool by tiers (SSS, SS, S, A, B, C, D)
  const sortedPrizePool = useMemo(() => {
    if (!selectedPack) return [];
    const tierOrder = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'];
    const grouped = selectedPack.prizePool.reduce((acc, card) => {
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
  }, [selectedPack]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePurchase = useCallback(() => {
    if (!selectedPack) return;
    const qty = parseInt(quantity) || 1;
    // TODO: Implement purchase logic via API
    setShowPurchaseModal(false);
    setQuantity('1');
  }, [selectedPack, quantity]);

  const quantityNum = useMemo(() => parseInt(quantity) || 1, [quantity]);
  const totalCost = useMemo(
    () => (selectedPack ? selectedPack.price * quantityNum : 0),
    [selectedPack, quantityNum]
  );
  const canPurchase = useMemo(
    () => selectedPack && quantityNum > 0 && quantityNum <= (selectedPack?.remainingPacks || 0),
    [selectedPack, quantityNum]
  );

  const handleQuantityChange = useCallback(
    (text) => {
      const num = parseInt(text) || 0;
      if (selectedPack) {
        setQuantity(Math.max(1, Math.min(selectedPack.remainingPacks, num)).toString());
      } else {
        setQuantity(text);
      }
    },
    [selectedPack]
  );

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity(Math.max(1, quantityNum - 1).toString());
  }, [quantityNum]);

  const handleIncreaseQuantity = useCallback(() => {
    if (selectedPack) {
      setQuantity(Math.min(selectedPack.remainingPacks, quantityNum + 1).toString());
    }
  }, [selectedPack, quantityNum]);

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
        <HeaderTitle>Booster Pack</HeaderTitle>
        <HeaderRight />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollContent>
          {!selectedPack ? (
            <DescriptionSection>
              <DescriptionTitle>No Booster Pack Selected</DescriptionTitle>
              <DescriptionText>
                Please select a booster pack from the Play screen to view details.
              </DescriptionText>
            </DescriptionSection>
          ) : (
            <>
              {/* Header Image */}
              <HeaderImageContainer>
                {selectedPack.headerImage ? (
                  <HeaderImage 
                    source={{ uri: selectedPack.headerImage }} 
                    resizeMode="contain"
                  />
                ) : (
                  <HeaderImagePlaceholder bgColor={selectedPack.color}>
                    <GemIconContainer bgColor={selectedPack.color}>
                      <Ionicons name={selectedPack.icon || 'albums'} size={80} color="#ffffff" />
                    </GemIconContainer>
                  </HeaderImagePlaceholder>
                )}
              </HeaderImageContainer>

              {/* Title and Description */}
              <DescriptionSection>
                <DescriptionTitle>{selectedPack.name}</DescriptionTitle>
                <DescriptionText>{selectedPack.description}</DescriptionText>
              </DescriptionSection>

              {/* Price and Availability */}
              {(() => {
                const progress = ((selectedPack.totalPacks - selectedPack.remainingPacks) / selectedPack.totalPacks) * 100;
                const rarityColor = getRarityColor(selectedPack.rarity);

                return (
                  <GemCard selected={true} rarityColor={rarityColor} activeOpacity={1}>
                    <GemInfo>
                      {/* Price */}
                      <AvailabilityContainer>
                        <AvailabilityRow>
                          <AvailabilityLabel>Price:</AvailabilityLabel>
                          <AvailabilityValue>
                            <Ionicons name="diamond" size={16} color={theme.colors.accent} style={{ marginRight: 4 }} />
                            <AvailabilityValueText>{selectedPack.price.toLocaleString()} tokens</AvailabilityValueText>
                          </AvailabilityValue>
                        </AvailabilityRow>
                      </AvailabilityContainer>

                      {/* Availability */}
                      <AvailabilityContainer style={{ marginTop: 16 }}>
                        <AvailabilityRow>
                          <AvailabilityLabel>Availability:</AvailabilityLabel>
                          <AvailabilityValue>
                            <AvailabilityValueText>
                              {selectedPack.remainingPacks} / {selectedPack.totalPacks} packs
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
                  Possible cards you can pull from {selectedPack.name}
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
      {selectedPack && (
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
                disabled={quantityNum >= selectedPack.remainingPacks}
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
                Buy {quantityNum} Pack{quantityNum !== 1 ? 's' : ''}
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
            <ModalGemHeader bgColor={selectedPack?.color}>
              <ModalGemIcon bgColor={selectedPack?.color || theme.colors.accent}>
                <Ionicons name={selectedPack?.icon || 'albums'} size={40} color="#ffffff" />
              </ModalGemIcon>
              <ModalGemName>{selectedPack?.name}</ModalGemName>
            </ModalGemHeader>

            <ModalTitle>Confirm Purchase</ModalTitle>
            <ModalMessage>
              Purchase {quantityNum} {selectedPack?.name} pack{quantityNum !== 1 ? 's' : ''}?
            </ModalMessage>

            <ModalDetails>
              <ModalDetailRow>
                <ModalDetailLabel>Packs:</ModalDetailLabel>
                <ModalDetailValue>{quantityNum}</ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Price per pack:</ModalDetailLabel>
                <ModalDetailValue>{selectedPack?.price.toLocaleString()} tokens</ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Total cost:</ModalDetailLabel>
                <ModalDetailValue color={theme.colors.accent}>{totalCost.toLocaleString()} tokens</ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Remaining after:</ModalDetailLabel>
                <ModalDetailValue>{(selectedPack?.remainingPacks || 0) - quantityNum} packs</ModalDetailValue>
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


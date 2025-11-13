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

const MYSTERY_BOXES = [
  {
    id: 'charizard',
    name: 'Charizard Box',
    theme: 'Charizard',
    description: 'Every card features Charizard variants. Collect all the different Charizard forms and evolutions.',
    price: 3000,
    cardTierRange: 'A-SS',
    rarity: 'rare',
    icon: 'flame',
    color: '#FF6B35',
    remainingBoxes: 234,
    totalBoxes: 500,
    prizePool: [
      { name: 'Charizard VMAX Alt Art', tier: 'SS', probability: '5%' },
      { name: 'Charizard VMAX', tier: 'S', probability: '15%' },
      { name: 'Charizard V', tier: 'A', probability: '30%' },
      { name: 'Various Charizard Cards', tier: 'A', probability: '50%' },
    ],
  },
  {
    id: 'pikachu',
    name: 'Pikachu Box',
    theme: 'Pikachu',
    description: 'All Pikachu-themed cards collection. Featuring rare Pikachu variants and special editions.',
    price: 2500,
    cardTierRange: 'B-S',
    rarity: 'uncommon',
    icon: 'flash',
    color: '#FFD700',
    remainingBoxes: 456,
    totalBoxes: 750,
    prizePool: [
      { name: 'Pikachu VMAX', tier: 'S', probability: '10%' },
      { name: 'Pikachu V', tier: 'A', probability: '25%' },
      { name: 'Various Pikachu Cards', tier: 'B', probability: '65%' },
    ],
  },
  {
    id: 'eeveelution',
    name: 'Eeveelution Box',
    theme: 'Eeveelution',
    description: 'Complete Eeveelution evolution line. Collect all Eeveelutions in one box.',
    price: 4000,
    cardTierRange: 'S-SS',
    rarity: 'epic',
    icon: 'sparkles',
    color: '#9B59B6',
    remainingBoxes: 89,
    totalBoxes: 200,
    prizePool: [
      { name: 'Umbreon VMAX Alt Art', tier: 'SS', probability: '3%' },
      { name: 'Espeon VMAX', tier: 'SS', probability: '7%' },
      { name: 'Various Eeveelution VMAX', tier: 'S', probability: '40%' },
      { name: 'Eeveelution V Cards', tier: 'S', probability: '50%' },
    ],
  },
  {
    id: 'legendary',
    name: 'Legendary Box',
    theme: 'Legendary',
    description: 'Exclusive legendary Pokemon cards. The ultimate collection for serious collectors.',
    price: 6000,
    cardTierRange: 'SS-SSS',
    rarity: 'legendary',
    icon: 'star',
    color: '#FFD700',
    remainingBoxes: 45,
    totalBoxes: 150,
    prizePool: [
      { name: 'Mewtwo VMAX Alt Art', tier: 'SSS', probability: '2%' },
      { name: 'Rayquaza VMAX Alt Art', tier: 'SSS', probability: '3%' },
      { name: 'Various Legendary VMAX', tier: 'SS', probability: '45%' },
      { name: 'Legendary V Cards', tier: 'SS', probability: '50%' },
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

export default function MysteryBoxDetailScreen({ route }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const boxId = route?.params?.boxId || null;
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [quantity, setQuantity] = useState('1');

  // Find the selected mystery box
  const selectedBox = useMemo(() => {
    if (!boxId) return null;
    return MYSTERY_BOXES.find((box) => box.id === boxId) || null;
  }, [boxId]);

  // Sort prize pool by tiers (SSS, SS, S, A, B, C, D)
  const sortedPrizePool = useMemo(() => {
    if (!selectedBox) return [];
    const tierOrder = ['SSS', 'SS', 'S', 'A', 'B', 'C', 'D'];
    const grouped = selectedBox.prizePool.reduce((acc, card) => {
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
  }, [selectedBox]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePurchase = useCallback(() => {
    if (!selectedBox) return;
    const qty = parseInt(quantity) || 1;
    // TODO: Implement purchase logic via API
    setShowPurchaseModal(false);
    setQuantity('1');
  }, [selectedBox, quantity]);

  const quantityNum = useMemo(() => parseInt(quantity) || 1, [quantity]);
  const totalCost = useMemo(
    () => (selectedBox ? selectedBox.price * quantityNum : 0),
    [selectedBox, quantityNum]
  );
  const canPurchase = useMemo(
    () => selectedBox && quantityNum > 0 && quantityNum <= (selectedBox?.remainingBoxes || 0),
    [selectedBox, quantityNum]
  );

  const handleQuantityChange = useCallback(
    (text) => {
      const num = parseInt(text) || 0;
      if (selectedBox) {
        setQuantity(Math.max(1, Math.min(selectedBox.remainingBoxes, num)).toString());
      } else {
        setQuantity(text);
      }
    },
    [selectedBox]
  );

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity(Math.max(1, quantityNum - 1).toString());
  }, [quantityNum]);

  const handleIncreaseQuantity = useCallback(() => {
    if (selectedBox) {
      setQuantity(Math.min(selectedBox.remainingBoxes, quantityNum + 1).toString());
    }
  }, [selectedBox, quantityNum]);

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
        <HeaderTitle>Mystery Box</HeaderTitle>
        <HeaderRight />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollContent>
          {!selectedBox ? (
            <DescriptionSection>
              <DescriptionTitle>No Mystery Box Selected</DescriptionTitle>
              <DescriptionText>
                Please select a mystery box from the Play screen to view details.
              </DescriptionText>
            </DescriptionSection>
          ) : (
            <>
              {/* Header Image */}
              <HeaderImageContainer>
                {selectedBox.headerImage ? (
                  <HeaderImage 
                    source={{ uri: selectedBox.headerImage }} 
                    resizeMode="contain"
                  />
                ) : (
                  <HeaderImagePlaceholder bgColor={selectedBox.color}>
                    <GemIconContainer bgColor={selectedBox.color}>
                      <Ionicons name={selectedBox.icon} size={80} color="#ffffff" />
                    </GemIconContainer>
                  </HeaderImagePlaceholder>
                )}
              </HeaderImageContainer>

              {/* Title and Description */}
              <DescriptionSection>
                <DescriptionTitle>{selectedBox.name}</DescriptionTitle>
                <DescriptionText>{selectedBox.description}</DescriptionText>
              </DescriptionSection>

              {/* Price and Availability */}
              {(() => {
                const progress = ((selectedBox.totalBoxes - selectedBox.remainingBoxes) / selectedBox.totalBoxes) * 100;
                const rarityColor = getRarityColor(selectedBox.rarity);

                return (
                  <GemCard selected={true} rarityColor={rarityColor} activeOpacity={1}>
                    <GemInfo>
                      {/* Price */}
                      <AvailabilityContainer>
                        <AvailabilityRow>
                          <AvailabilityLabel>Price:</AvailabilityLabel>
                          <AvailabilityValue>
                            <Ionicons name="diamond" size={16} color={theme.colors.accent} style={{ marginRight: 4 }} />
                            <AvailabilityValueText>{selectedBox.price.toLocaleString()} tokens</AvailabilityValueText>
                          </AvailabilityValue>
                        </AvailabilityRow>
                      </AvailabilityContainer>

                      {/* Availability */}
                      <AvailabilityContainer style={{ marginTop: 16 }}>
                        <AvailabilityRow>
                          <AvailabilityLabel>Availability:</AvailabilityLabel>
                          <AvailabilityValue>
                            <AvailabilityValueText>
                              {selectedBox.remainingBoxes} / {selectedBox.totalBoxes} boxes
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
                  Possible cards you can pull from {selectedBox.name}
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
      {selectedBox && (
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
                disabled={quantityNum >= selectedBox.remainingBoxes}
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
            <ModalGemHeader bgColor={selectedBox?.color}>
              <ModalGemIcon bgColor={selectedBox?.color || theme.colors.accent}>
                <Ionicons name={selectedBox?.icon} size={40} color="#ffffff" />
              </ModalGemIcon>
              <ModalGemName>{selectedBox?.name}</ModalGemName>
            </ModalGemHeader>

            <ModalTitle>Confirm Purchase</ModalTitle>
            <ModalMessage>
              Purchase {quantityNum} {selectedBox?.name} box{quantityNum !== 1 ? 'es' : ''}?
            </ModalMessage>

            <ModalDetails>
              <ModalDetailRow>
                <ModalDetailLabel>Boxes:</ModalDetailLabel>
                <ModalDetailValue>{quantityNum}</ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Price per box:</ModalDetailLabel>
                <ModalDetailValue>{selectedBox?.price.toLocaleString()} tokens</ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Total cost:</ModalDetailLabel>
                <ModalDetailValue color={theme.colors.accent}>{totalCost.toLocaleString()} tokens</ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Remaining after:</ModalDetailLabel>
                <ModalDetailValue>{(selectedBox?.remainingBoxes || 0) - quantityNum} boxes</ModalDetailValue>
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


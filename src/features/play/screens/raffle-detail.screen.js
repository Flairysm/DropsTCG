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
  background-color: rgba(64, 255, 220, 0.1);
`;

const TrophyIconContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  background-color: ${(props) => props.theme.colors.accent};
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
  line-height: 22px;
`;

const InfoCard = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const InfoLabel = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
`;

const InfoValue = styled.View`
  flex-direction: row;
  align-items: center;
`;

const InfoValueText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
  margin-left: 6px;
`;

const ProgressBar = styled.View`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.View`
  height: 100%;
  background-color: ${(props) => props.theme.colors.accent};
  border-radius: 4px;
  width: ${(props) => props.width}%;
`;

const PrizesSection = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const PrizesTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
`;

const PrizesSubtitle = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 20px;
`;

const PrizeItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding-vertical: 12px;
  padding-horizontal: 16px;
  background-color: ${(props) => props.theme.colors.primary};
  opacity: 0.3;
  border-radius: 12px;
  margin-bottom: 12px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const PrizePosition = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${(props) => props.theme.colors.accent};
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const PrizePositionText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const PrizeName = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const ConsolationPrizeCard = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 32px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
  flex-direction: row;
  align-items: center;
`;

const ConsolationIcon = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: rgba(64, 255, 220, 0.2);
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const ConsolationText = styled.View`
  flex: 1;
`;

const ConsolationTitle = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 4px;
`;

const ConsolationValue = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
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

const ModalRaffleHeader = styled.View`
  align-items: center;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  background-color: rgba(64, 255, 220, 0.1);
`;

const ModalTrophyIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  background-color: ${(props) => props.theme.colors.accent};
`;

const ModalRaffleName = styled.Text`
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

// Sample raffle data - replace with real data from API/state
const RAFFLES = [
  {
    id: '1',
    title: 'Charizard VMAX Booster Box',
    description: 'Win an exclusive Charizard VMAX Booster Box! Join this exciting raffle for a chance to win premium Pokemon cards.',
    prizes: [
      { position: 1, name: 'Charizard VMAX Booster Box' },
      { position: 2, name: 'PSA 10 Charizard VMAX' },
      { position: 3, name: 'Charizard VMAX Single' },
    ],
    consolationPrize: {
      tokens: 1,
    },
    totalSlots: 100,
    filledSlots: 45,
    tokensPerSlot: 200,
    isActive: true,
  },
  {
    id: '2',
    title: 'PSA 10 Pikachu VMAX',
    description: 'Ultra-rare PSA 10 graded Pikachu VMAX card! This is a once-in-a-lifetime opportunity to own this collectible.',
    prizes: [
      { position: 1, name: 'PSA 10 Pikachu VMAX' },
      { position: 2, name: 'Pikachu VMAX Booster Box' },
      { position: 3, name: 'Pikachu VMAX Single' },
    ],
    consolationPrize: {
      tokens: 1,
    },
    totalSlots: 50,
    filledSlots: 32,
    tokensPerSlot: 400,
    isActive: true,
  },
];

export default function RaffleDetailScreen({ route }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const raffleId = route?.params?.raffleId || null;
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [quantity, setQuantity] = useState('1');

  // Find the selected raffle
  const selectedRaffle = useMemo(() => {
    if (!raffleId) return null;
    return RAFFLES.find((raffle) => raffle.id === raffleId) || null;
  }, [raffleId]);

  const progress = useMemo(() => {
    if (!selectedRaffle) return 0;
    return (selectedRaffle.filledSlots / selectedRaffle.totalSlots) * 100;
  }, [selectedRaffle]);

  const slotsRemaining = useMemo(() => {
    if (!selectedRaffle) return 0;
    return selectedRaffle.totalSlots - selectedRaffle.filledSlots;
  }, [selectedRaffle]);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handlePurchase = useCallback(() => {
    if (!selectedRaffle) return;
    const qty = parseInt(quantity) || 1;
    // TODO: Implement purchase logic via API
    setShowPurchaseModal(false);
    setQuantity('1');
  }, [selectedRaffle, quantity]);

  const quantityNum = useMemo(() => parseInt(quantity) || 1, [quantity]);
  const totalCost = useMemo(
    () => (selectedRaffle ? selectedRaffle.tokensPerSlot * quantityNum : 0),
    [selectedRaffle, quantityNum]
  );
  const canPurchase = useMemo(
    () =>
      selectedRaffle &&
      quantityNum > 0 &&
      quantityNum <= slotsRemaining &&
      selectedRaffle.isActive,
    [selectedRaffle, quantityNum, slotsRemaining]
  );

  const handleQuantityChange = useCallback(
    (text) => {
      const num = parseInt(text) || 0;
      if (selectedRaffle) {
        setQuantity(Math.max(1, Math.min(slotsRemaining, num)).toString());
      } else {
        setQuantity(text);
      }
    },
    [selectedRaffle, slotsRemaining]
  );

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity(Math.max(1, quantityNum - 1).toString());
  }, [quantityNum]);

  const handleIncreaseQuantity = useCallback(() => {
    if (selectedRaffle) {
      setQuantity(Math.min(slotsRemaining, quantityNum + 1).toString());
    }
  }, [selectedRaffle, quantityNum, slotsRemaining]);

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
        <HeaderTitle>Raffle Event</HeaderTitle>
        <HeaderRight />
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollContent>
          {!selectedRaffle ? (
            <DescriptionSection>
              <DescriptionTitle>No Raffle Selected</DescriptionTitle>
              <DescriptionText>
                Please select a raffle from the Play screen to view details.
              </DescriptionText>
            </DescriptionSection>
          ) : (
            <>
              {/* Header Image */}
              <HeaderImageContainer>
                {selectedRaffle.headerImage ? (
                  <HeaderImage
                    source={{ uri: selectedRaffle.headerImage }}
                    resizeMode="contain"
                  />
                ) : (
                  <HeaderImagePlaceholder>
                    <TrophyIconContainer>
                      <Ionicons name="trophy" size={60} color={theme.colors.primary} />
                    </TrophyIconContainer>
                  </HeaderImagePlaceholder>
                )}
              </HeaderImageContainer>

              {/* Title and Description */}
              <DescriptionSection>
                <DescriptionTitle>{selectedRaffle.title}</DescriptionTitle>
                <DescriptionText>{selectedRaffle.description}</DescriptionText>
              </DescriptionSection>

              {/* Info Card */}
              <InfoCard>
                <InfoRow>
                  <InfoLabel>Price per Slot:</InfoLabel>
                  <InfoValue>
                    <Ionicons name="diamond" size={16} color={theme.colors.accent} />
                    <InfoValueText>
                      {selectedRaffle.tokensPerSlot.toLocaleString()} tokens
                    </InfoValueText>
                  </InfoValue>
                </InfoRow>

                <InfoRow>
                  <InfoLabel>Progress:</InfoLabel>
                  <InfoValue>
                    <InfoValueText>
                      {selectedRaffle.filledSlots} / {selectedRaffle.totalSlots} slots
                    </InfoValueText>
                  </InfoValue>
                </InfoRow>
                <ProgressBar>
                  <ProgressFill width={progress} />
                </ProgressBar>

                <InfoRow style={{ marginTop: 16, marginBottom: 0 }}>
                  <InfoLabel>Slots Remaining:</InfoLabel>
                  <InfoValue>
                    <InfoValueText>{slotsRemaining} slots</InfoValueText>
                  </InfoValue>
                </InfoRow>
              </InfoCard>

              {/* Prizes Section */}
              <PrizesSection>
                <PrizesTitle>Prizes</PrizesTitle>
                <PrizesSubtitle>
                  Main prizes for this raffle event
                </PrizesSubtitle>

                {selectedRaffle.prizes.map((prize, index) => (
                  <PrizeItem key={index}>
                    <PrizePosition>
                      <PrizePositionText>
                        {prize.position === 1
                          ? '1st'
                          : prize.position === 2
                            ? '2nd'
                            : '3rd'}
                      </PrizePositionText>
                    </PrizePosition>
                    <PrizeName>{prize.name}</PrizeName>
                  </PrizeItem>
                ))}
              </PrizesSection>

              {/* Consolation Prize */}
              <ConsolationPrizeCard>
                <ConsolationIcon>
                  <Ionicons name="diamond" size={24} color={theme.colors.accent} />
                </ConsolationIcon>
                <ConsolationText>
                  <ConsolationTitle>Consolation Prize</ConsolationTitle>
                  <ConsolationValue>
                    {selectedRaffle.consolationPrize.tokens} token
                    {selectedRaffle.consolationPrize.tokens !== 1 ? 's' : ''} guaranteed
                  </ConsolationValue>
                </ConsolationText>
              </ConsolationPrizeCard>
            </>
          )}
        </ScrollContent>
      </ScrollView>

      {/* Purchase Bar */}
      {selectedRaffle && selectedRaffle.isActive && (
        <PurchaseBar>
          <QuantityContainer>
            <QuantityLabel>Slots:</QuantityLabel>
            <QuantityControls>
              <QuantityButton
                onPress={handleDecreaseQuantity}
                disabled={quantityNum <= 1}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={20} color="#ffffff" />
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
                disabled={quantityNum >= slotsRemaining}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={20} color="#ffffff" />
              </QuantityButton>
            </QuantityControls>
          </QuantityContainer>
          <PurchaseButton
            disabled={!canPurchase}
            onPress={() => setShowPurchaseModal(true)}
            activeOpacity={0.8}
          >
            <PurchaseButtonContent>
              <Ionicons
                name="diamond"
                size={14}
                color={theme.colors.primary}
                style={{ marginRight: 4 }}
              />
              <PurchaseButtonText>
                Buy {quantityNum} Slot{quantityNum !== 1 ? 's' : ''}
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
            <ModalRaffleHeader>
              <ModalTrophyIcon>
                <Ionicons name="trophy" size={40} color={theme.colors.primary} />
              </ModalTrophyIcon>
              <ModalRaffleName>{selectedRaffle?.title}</ModalRaffleName>
            </ModalRaffleHeader>

            <ModalTitle>Confirm Purchase</ModalTitle>
            <ModalMessage>
              Purchase {quantityNum} slot{quantityNum !== 1 ? 's' : ''} in{' '}
              {selectedRaffle?.title}?
            </ModalMessage>

            <ModalDetails>
              <ModalDetailRow>
                <ModalDetailLabel>Slots:</ModalDetailLabel>
                <ModalDetailValue>{quantityNum}</ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Price per slot:</ModalDetailLabel>
                <ModalDetailValue>
                  {selectedRaffle?.tokensPerSlot.toLocaleString()} tokens
                </ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Total cost:</ModalDetailLabel>
                <ModalDetailValue color={theme.colors.accent}>
                  {totalCost.toLocaleString()} tokens
                </ModalDetailValue>
              </ModalDetailRow>
              <ModalDetailRow>
                <ModalDetailLabel>Remaining after:</ModalDetailLabel>
                <ModalDetailValue>
                  {slotsRemaining - quantityNum} slots
                </ModalDetailValue>
              </ModalDetailRow>
            </ModalDetails>

            <ModalButtons>
              <ModalCancelButton
                onPress={() => setShowPurchaseModal(false)}
                activeOpacity={0.7}
              >
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


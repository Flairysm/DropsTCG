/**
 * Find Pikachu Minigame Screen
 * Simple and effective implementation
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Dimensions, Image, Modal, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { gameAssets } from '../../../constants/assets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Card dimensions for 3x3 grid
const GAME_AREA_PADDING = 40;
const CARD_GAP = 10;
const AVAILABLE_WIDTH = SCREEN_WIDTH - (GAME_AREA_PADDING * 2) - 40;
const CARD_WIDTH = Math.floor((AVAILABLE_WIDTH - (CARD_GAP * 2)) / 3);
const CARD_HEIGHT = Math.floor(CARD_WIDTH * 1.5);

// Image sources
const bushImageSource = gameAssets.bush;
const pikaImageSource = gameAssets.pika;
const rockImageSource = gameAssets.rock;

// Styled Components
const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  overflow: hidden;
`;

const GameArea = styled.View`
  width: 100%;
  padding: ${GAME_AREA_PADDING}px;
  border-radius: 20px;
  border-width: 2px;
  border-color: #00ffff;
  background-color: ${(props) => props.theme.colors.secondary};
  align-items: center;
  justify-content: center;
  shadow-color: #00ffff;
  shadow-offset: 0px 0px;
  shadow-opacity: 0.8;
  shadow-radius: 10px;
  elevation: 10;
  min-height: 400px;
  position: relative;
`;

const GameCardsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: ${CARD_WIDTH * 3 + CARD_GAP * 2}px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CardWrapper = styled.View`
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
`;

const Card = styled.View`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  border-width: 2px;
  border-color: #00ffff;
`;

const CardButton = styled(TouchableOpacity)`
  width: 100%;
  height: 100%;
`;

const PreStartOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const PreStartText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #00ffff;
  text-align: center;
  margin-bottom: 16px;
`;

const PreStartSubtext = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.8;
  text-align: center;
`;

const ControlButton = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.colors.accent};
  border-radius: 12px;
  padding: 16px 32px;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  opacity: ${(props) => props.disabled ? 0.5 : 1};
`;

const ControlButtonText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
`;

const ButtonRow = styled.View`
  width: 100%;
  margin-top: 20px;
`;

const HeaderSection = styled.View`
  width: 100%;
  margin-bottom: 24px;
  align-items: center;
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: 16px;
  position: relative;
`;

const IconContainer = styled.View`
  width: 70px;
  height: 70px;
  border-radius: 35px;
  background-color: #FFE66D;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  shadow-color: #FFE66D;
  shadow-offset: 0px 0px;
  shadow-opacity: 0.6;
  shadow-radius: 12px;
  elevation: 8;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 800;
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
`;

const TitleAccent = styled.View`
  width: 60px;
  height: 4px;
  background-color: #00ffff;
  border-radius: 2px;
  margin-top: 8px;
  shadow-color: #00ffff;
  shadow-offset: 0px 0px;
  shadow-opacity: 0.8;
  shadow-radius: 8px;
  elevation: 4;
`;

const DescriptionContainer = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
  width: 100%;
`;

const Description = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.9;
  text-align: center;
  line-height: 22px;
`;

const HowToPlaySection = styled.View`
  width: 100%;
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
  overflow: hidden;
`;

const HowToPlayHeader = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

const HowToPlayTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const HowToPlayContent = styled.View`
  padding: 16px;
  padding-top: 0;
`;

const HowToPlayText = styled.Text`
  font-size: 13px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.8;
  line-height: 20px;
`;

const ProgressBarContainer = styled.View`
  width: 100%;
  margin-bottom: 20px;
  padding-horizontal: 20px;
`;

const ProgressBarLabel = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 8px;
  text-align: center;
`;

const ProgressBarWrapper = styled.View`
  width: 100%;
  height: 24px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const ProgressBarFill = styled.View`
  height: 100%;
  background-color: #00ffff;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  min-width: 24px;
`;

const ProgressBarText = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
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
  align-items: center;
`;

const ModalIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  background-color: ${(props) => props.bgColor || props.theme.colors.accent};
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 12px;
  text-align: center;
`;

const ModalMessage = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.8;
  text-align: center;
  line-height: 20px;
  margin-bottom: 24px;
`;

const ModalButton = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.colors.accent};
  border-radius: 12px;
  padding: 14px 32px;
  min-width: 150px;
  align-items: center;
  justify-content: center;
`;

const ModalButtonText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const PrizePoolSection = styled.View`
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
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

// Prize pool card dimensions (Pokemon card size: 2.5" x 3.5" = 0.714 aspect ratio)
const PRIZE_POOL_CARD_WIDTH = Math.floor((SCREEN_WIDTH - 40) / 5.2); // ~5 cards per row with spacing
const PRIZE_POOL_CARD_HEIGHT = Math.floor(PRIZE_POOL_CARD_WIDTH / 0.714); // Maintain Pokemon card aspect ratio

const CardsGrid = styled.ScrollView`
  flex-direction: row;
`;

const CardItem = styled.View`
  width: ${PRIZE_POOL_CARD_WIDTH}px;
  height: ${PRIZE_POOL_CARD_HEIGHT}px;
  margin-right: 8px;
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
  height: 100%;
  background-color: ${(props) => props.theme.colors.tertiary};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CardPlaceholder = styled.View`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background-color: rgba(26, 10, 58, 0.5);
`;

// Reward tiers configuration
const REWARD_TIERS = [
  {
    name: 'Masterball Tier',
    pikachusRequired: 4,
    color: '#9D4EDD', // Purple
    cardPool: [
      { name: 'Card 1', tier: 'Masterball' },
      { name: 'Card 2', tier: 'Masterball' },
      { name: 'Card 3', tier: 'Masterball' },
      { name: 'Card 4', tier: 'Masterball' },
      { name: 'Card 5', tier: 'Masterball' },
    ],
  },
  {
    name: 'Ultraball Tier',
    pikachusRequired: 3,
    color: '#FF6B35', // Orange
    cardPool: [
      { name: 'Card 1', tier: 'Ultraball' },
      { name: 'Card 2', tier: 'Ultraball' },
      { name: 'Card 3', tier: 'Ultraball' },
      { name: 'Card 4', tier: 'Ultraball' },
    ],
  },
  {
    name: 'Greatball Tier',
    pikachusRequired: 2,
    color: '#4ECDC4', // Teal
    cardPool: [
      { name: 'Card 1', tier: 'Greatball' },
      { name: 'Card 2', tier: 'Greatball' },
      { name: 'Card 3', tier: 'Greatball' },
    ],
  },
  {
    name: 'Pokeball Tier',
    pikachusRequired: 1,
    color: '#FFE66D', // Yellow
    cardPool: [
      { name: 'Card 1', tier: 'Pokeball' },
      { name: 'Card 2', tier: 'Pokeball' },
    ],
  },
];

// Get tier color for display
const getTierColor = (tierName) => {
  const tier = REWARD_TIERS.find(t => t.name === tierName);
  return tier ? tier.color : '#40ffdc';
};

// Get current tier based on Pikachus found
const getCurrentTier = (pikachusFound) => {
  if (pikachusFound === 0) return null;
  return REWARD_TIERS.find(tier => tier.pikachusRequired === pikachusFound) || null;
};

export default function FindPikachuScreen() {
  const [cards, setCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [pikachusFound, setPikachusFound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [howToPlayExpanded, setHowToPlayExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'rock' or 'reward'
  const [rewardTier, setRewardTier] = useState(null);
  const [rewardPikachusCount, setRewardPikachusCount] = useState(0);

  // Initialize game - create 9 cards with 4 Pikachus randomly placed
  const initializeGame = useCallback(() => {
    const pikachuPositions = new Set();
    while (pikachuPositions.size < 4) {
      pikachuPositions.add(Math.floor(Math.random() * 9));
    }

    const newCards = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      isRevealed: false,
      isRock: !pikachuPositions.has(i),
    }));

    setCards(newCards);
    setGameStarted(false);
    setPikachusFound(0);
    setGameOver(false);
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  // Handle card click
  const handleCardClick = useCallback((cardId) => {
    if (!gameStarted || gameOver) return;

    const card = cards[cardId];
    if (card.isRevealed) return;

    const updatedCards = [...cards];
    updatedCards[cardId].isRevealed = true;
    setCards(updatedCards);

    if (card.isRock) {
      // Hit rock - reset to 0 and end game
      setPikachusFound(0);
      setGameOver(true);
      setModalType('rock');
      setShowModal(true);
    } else {
      // Found Pikachu
      const newCount = pikachusFound + 1;
      setPikachusFound(newCount);
      
      if (newCount === 4) {
        // Found all 4 - reveal all and end game
        updatedCards.forEach(c => c.isRevealed = true);
        setCards(updatedCards);
        setGameOver(true);
      }
    }
  }, [cards, gameStarted, gameOver, pikachusFound]);

  // Exit and claim rewards
  const handleExit = useCallback(() => {
    if (!gameStarted || pikachusFound === 0) return;
    const currentTier = getCurrentTier(pikachusFound);
    setRewardTier(currentTier);
    setRewardPikachusCount(pikachusFound);
    setModalType('reward');
    setShowModal(true);
  }, [gameStarted, pikachusFound]);

  // Close modal and reset game
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalType(null);
    setRewardTier(null);
    setRewardPikachusCount(0);
    initializeGame();
  }, [initializeGame]);

  // Get current tier
  const currentTier = gameStarted ? getCurrentTier(pikachusFound) : null;

  // Initialize on mount
  React.useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <Container>
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        bounces={true}
        contentContainerStyle={{ 
          paddingBottom: 40,
          alignItems: 'center',
        }}
        style={{ width: '100%' }}
      >
        {/* Header Section */}
        <HeaderSection>
          <TitleContainer>
            <Title>FIND PIKACHU</Title>
            <TitleAccent />
          </TitleContainer>
          <DescriptionContainer>
            <Description>
              Oh no! 4 Pikachu have hidden themselves among 9 bushes! Can you find them all without hitting a rock? 
            </Description>
          </DescriptionContainer>

          {/* How to Play Section */}
          <HowToPlaySection>
            <HowToPlayHeader
              onPress={() => setHowToPlayExpanded(!howToPlayExpanded)}
              activeOpacity={0.7}
            >
              <HowToPlayTitle>How to Play</HowToPlayTitle>
              <Ionicons
                name={howToPlayExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#00ffff"
              />
            </HowToPlayHeader>
            {howToPlayExpanded && (
              <HowToPlayContent>
                <HowToPlayText>
                  • Tap "Start Game" to begin{'\n'}
                  • Click on cards to reveal them{'\n'}
                  • Find 4 Pikachu cards to win the highest tier rewards{'\n'}
                  • Avoid rocks - hitting one resets your score to 0{'\n'}
                  • Exit anytime to claim rewards based on Pikachus found
                </HowToPlayText>
              </HowToPlayContent>
            )}
          </HowToPlaySection>

          {/* Progress Bar */}
          <ProgressBarContainer>
            <ProgressBarLabel>
              {pikachusFound}/4 Pikachu Found
            </ProgressBarLabel>
            <ProgressBarWrapper>
              <ProgressBarFill style={{ width: `${(pikachusFound / 4) * 100}%` }}>
                {pikachusFound > 0 && (
                  <ProgressBarText>{pikachusFound}/4</ProgressBarText>
                )}
              </ProgressBarFill>
            </ProgressBarWrapper>
          </ProgressBarContainer>
        </HeaderSection>

        <GameArea>
        {/* Pre-start Overlay */}
        {!gameStarted && (
          <PreStartOverlay>
            <PreStartText>Ready to Hunt?</PreStartText>
            <PreStartSubtext>Click "Start Game" to begin</PreStartSubtext>
          </PreStartOverlay>
        )}

        {/* Cards Grid */}
        <GameCardsGrid removeClippedSubviews={false}>
          {cards.length === 9 && cards.map((card) => {
            const isLastInRow = (card.id + 1) % 3 === 0;
            const isLastRow = card.id >= 6;
            
            return (
              <CardWrapper
                key={card.id}
                style={{
                  marginRight: isLastInRow ? 0 : CARD_GAP,
                  marginBottom: isLastRow ? 0 : CARD_GAP,
                }}
              >
                <CardButton
                  onPress={() => handleCardClick(card.id)}
                  disabled={!gameStarted || gameOver || card.isRevealed}
                  activeOpacity={0.9}
                >
                  <Card>
                    <Image
                      source={
                        card.isRevealed
                          ? (card.isRock ? rockImageSource : pikaImageSource)
                          : bushImageSource
                      }
                      resizeMode="contain"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Card>
                </CardButton>
              </CardWrapper>
            );
          })}
        </GameCardsGrid>
      </GameArea>

      {/* Controls */}
      <ButtonRow>
        {!gameStarted ? (
          <ControlButton onPress={startGame}>
            <ControlButtonText>Start Game</ControlButtonText>
          </ControlButton>
        ) : (
          <ControlButton
            onPress={handleExit}
            disabled={pikachusFound === 0}
          >
            <ControlButtonText>
              {pikachusFound > 0
                ? `Claim reward for ${getCurrentTier(pikachusFound)?.name || 'prizes'}`
                : 'End Game'}
            </ControlButtonText>
          </ControlButton>
        )}
      </ButtonRow>

      {/* Prize Pool - Show when game not started */}
      {!gameStarted && (
        <PrizePoolSection>
          <PrizePoolTitle>Card Prize Pool</PrizePoolTitle>
          <PrizePoolSubtitle>
            Possible rewards based on Pikachus found
          </PrizePoolSubtitle>

          {REWARD_TIERS.map((tier) => {
            const tierColor = getTierColor(tier.name);
            return (
              <PrizePoolTierGroup key={tier.name}>
                <TierGroupHeader>
                  <TierGroupTitle color={tierColor}>{tier.name}</TierGroupTitle>
                </TierGroupHeader>
                <CardsGrid
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 16 }}
                >
                  {tier.cardPool.map((card, index) => (
                    <CardItem key={`${tier.name}-${index}`} tierColor={tierColor}>
                      <CardImageContainer>
                        <CardPlaceholder>
                          <Ionicons name="card" size={24} color={tierColor} />
                        </CardPlaceholder>
                      </CardImageContainer>
                    </CardItem>
                  ))}
                </CardsGrid>
              </PrizePoolTierGroup>
            );
          })}
        </PrizePoolSection>
      )}

      {/* Current Tier Display - Show during game */}
      {gameStarted && currentTier && (
        <PrizePoolSection>
          <PrizePoolTitle>Current Tier: {currentTier.name}</PrizePoolTitle>
          <PrizePoolSubtitle>
            {pikachusFound}/4 Pikachus Found
          </PrizePoolSubtitle>

          <PrizePoolTierGroup>
            <TierGroupHeader>
              <TierGroupTitle color={currentTier.color}>{currentTier.name}</TierGroupTitle>
            </TierGroupHeader>
            <CardsGrid
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {currentTier.cardPool.map((card, index) => (
                <CardItem key={`${currentTier.name}-${index}`} tierColor={currentTier.color}>
                  <CardImageContainer>
                    <CardPlaceholder>
                      <Ionicons name="card" size={24} color={currentTier.color} />
                    </CardPlaceholder>
                  </CardImageContainer>
                </CardItem>
              ))}
            </CardsGrid>
          </PrizePoolTierGroup>
        </PrizePoolSection>
      )}
      </ScrollView>

      {/* Result Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <ModalOverlay>
          <ModalContent>
            {modalType === 'rock' ? (
              <>
                <ModalIcon bgColor="#FFE66D">
                  <Ionicons name="trophy" size={48} color="#ffffff" />
                </ModalIcon>
                <ModalTitle>Rock Hit!</ModalTitle>
                <ModalMessage>
                  You hit a rock!{'\n\n'}
                  You've earned rewards from the Pokeball Tier!
                </ModalMessage>
                <ModalButton onPress={handleCloseModal} activeOpacity={0.8}>
                  <ModalButtonText>Back to Game</ModalButtonText>
                </ModalButton>
              </>
            ) : modalType === 'reward' && rewardTier ? (
              <>
                <ModalIcon bgColor={rewardTier.color}>
                  <Ionicons name="trophy" size={48} color="#ffffff" />
                </ModalIcon>
                <ModalTitle>Rewards Claimed!</ModalTitle>
                <ModalMessage>
                  Congratulations! You found {rewardPikachusCount} Pikachu{rewardPikachusCount > 1 ? 's' : ''}!{'\n\n'}
                  You've earned rewards from the {rewardTier.name}!
                </ModalMessage>
                <ModalButton onPress={handleCloseModal} activeOpacity={0.8}>
                  <ModalButtonText>Continue</ModalButtonText>
                </ModalButton>
              </>
            ) : null}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}

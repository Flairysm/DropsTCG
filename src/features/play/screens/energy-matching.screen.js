/**
 * Energy Matching Minigame Screen
 * Follows Find Pikachu template and design
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Modal, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { gameAssets } from '../../../constants/assets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Card dimensions
// energy-card.png is 408x612px (aspect ratio ~0.667)
const GAME_AREA_PADDING = 40;
const CARD_GAP = 10;
const AVAILABLE_WIDTH = SCREEN_WIDTH - (GAME_AREA_PADDING * 2) - 40;
// For 2x2 energy selection - fit actual card image size (408x612 = 0.667 aspect ratio)
const ENERGY_CARD_WIDTH = Math.floor((AVAILABLE_WIDTH - (CARD_GAP * 1)) / 2);
const ENERGY_CARD_HEIGHT = Math.floor(ENERGY_CARD_WIDTH / 0.667); // Match energy-card.png aspect ratio

// For 20 cards grid (4x5) - fit actual card image size
const MATCHING_CARD_WIDTH = Math.floor((AVAILABLE_WIDTH - (CARD_GAP * 3)) / 4);
const MATCHING_CARD_HEIGHT = Math.floor(MATCHING_CARD_WIDTH / 0.667); // Match energy-card.png aspect ratio

// Energy types
const ENERGY_TYPES = [
  { id: 'grass', name: 'Grass', color: '#50C878', image: gameAssets.grass },
  { id: 'electric', name: 'Electric', color: '#FFE66D', image: gameAssets.electric },
  { id: 'fire', name: 'Fire', color: '#FF6B35', image: gameAssets.fire },
  { id: 'water', name: 'Water', color: '#4ECDC4', image: gameAssets.water },
];

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

const EnergySelectionGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: ${ENERGY_CARD_WIDTH * 2 + CARD_GAP * 1}px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const MatchingCardsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  width: ${MATCHING_CARD_WIDTH * 4 + CARD_GAP * 3}px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CardWrapper = styled.View`
  width: ${(props) => {
    if (props.isMatching) return MATCHING_CARD_WIDTH;
    if (props.isEnergy) return ENERGY_CARD_WIDTH;
    return ENERGY_CARD_WIDTH;
  }}px;
  height: ${(props) => {
    if (props.isMatching) return MATCHING_CARD_HEIGHT;
    if (props.isEnergy) return ENERGY_CARD_HEIGHT;
    return ENERGY_CARD_HEIGHT;
  }}px;
  min-width: ${(props) => {
    if (props.isMatching) return MATCHING_CARD_WIDTH;
    if (props.isEnergy) return ENERGY_CARD_WIDTH;
    return ENERGY_CARD_WIDTH;
  }}px;
  min-height: ${(props) => {
    if (props.isMatching) return MATCHING_CARD_HEIGHT;
    if (props.isEnergy) return ENERGY_CARD_HEIGHT;
    return ENERGY_CARD_HEIGHT;
  }}px;
  max-width: ${(props) => {
    if (props.isMatching) return MATCHING_CARD_WIDTH;
    if (props.isEnergy) return ENERGY_CARD_WIDTH;
    return ENERGY_CARD_WIDTH;
  }}px;
  max-height: ${(props) => {
    if (props.isMatching) return MATCHING_CARD_HEIGHT;
    if (props.isEnergy) return ENERGY_CARD_HEIGHT;
    return ENERGY_CARD_HEIGHT;
  }}px;
  flex-shrink: 0;
  flex-grow: 0;
`;

const Card = styled.View`
  width: 100%;
  height: 100%;
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: transparent;
  position: relative;
  align-items: center;
  justify-content: center;
`;

const CardImage = styled.Image.attrs((props) => ({
  resizeMode: 'contain',
}))`
  position: absolute;
  top: 0;
  left: 0;
  width: ${(props) => {
    if (props.isMatching) return `${MATCHING_CARD_WIDTH}px`;
    if (props.isEnergy) return `${ENERGY_CARD_WIDTH}px`;
    return '100%';
  }};
  height: ${(props) => {
    if (props.isMatching) return `${MATCHING_CARD_HEIGHT}px`;
    if (props.isEnergy) return `${ENERGY_CARD_HEIGHT}px`;
    return '100%';
  }};
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

const ShuffleOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  z-index: 20;
`;

const ShuffleAnimationContainer = styled.View`
  width: 120px;
  height: 180px;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`;

const ShuffleText = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #00ffff;
  text-align: center;
  margin-top: 20px;
`;

const ShuffleSubtext = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.8;
  text-align: center;
  margin-top: 8px;
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

const SelectedEnergyDisplay = styled.View`
  width: 100%;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props) => props.selectedColor || '#00ffff'};
  margin-bottom: 16px;
  align-items: center;
`;

const SelectedEnergyText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.selectedColor || props.theme.colors.text};
  margin-bottom: 8px;
`;

const SelectedEnergySubtext = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
`;

// Modal components
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

const MatchCountContainer = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 16px;
  border-width: 2px;
  border-color: ${(props) => props.borderColor || props.theme.colors.accent};
`;

const MatchCountLabel = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
`;

const MatchCountDisplay = styled.View`
  flex-direction: row;
  align-items: baseline;
  justify-content: center;
`;

const MatchCountNumber = styled.Text`
  font-size: 48px;
  font-weight: 800;
  color: ${(props) => props.color || props.theme.colors.accent};
  line-height: 56px;
`;

const MatchCountDivider = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.5;
  margin-horizontal: 8px;
`;

const MatchCountTotal = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.5;
`;

const MatchResultText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-top: 12px;
  text-align: center;
`;

const RewardInfoText = styled.Text`
  font-size: 13px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  text-align: center;
  margin-top: 8px;
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

export default function EnergyMatchingScreen() {
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [revealedEnergy, setRevealedEnergy] = useState(null); // Track which energy card is flipped
  const [shuffledEnergyTypes, setShuffledEnergyTypes] = useState([]); // Shuffled energy types for selection
  const [matchingCards, setMatchingCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showEnergySelection, setShowEnergySelection] = useState(false);
  const [showShuffleAnimation, setShowShuffleAnimation] = useState(false);
  const [cardsReady, setCardsReady] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [howToPlayExpanded, setHowToPlayExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'success' or 'failure'
  const [finalMatchCount, setFinalMatchCount] = useState(0); // Track final match count for modal
  
  // Shuffle animation refs
  const shuffleAnimations = useRef([]);

  // Initialize matching cards (20 cards: 5 of each energy type)
  const initializeMatchingCards = useCallback(() => {
    const cards = [];
    ENERGY_TYPES.forEach((energy) => {
      for (let i = 0; i < 5; i++) {
        cards.push({
          id: `${energy.id}-${i}`,
          energyType: energy.id,
          energy: energy,
          isSelected: false,
        });
      }
    });
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setMatchingCards(cards);
    setSelectedCards([]);
    setGameOver(false);
  }, []);

  // Start game - show energy selection
  const startGame = useCallback(() => {
    // Shuffle energy types for random selection order
    const shuffled = [...ENERGY_TYPES];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledEnergyTypes(shuffled);
    setGameStarted(true);
    setShowEnergySelection(true);
    setRevealedEnergy(null);
  }, []);

  // Handle energy card reveal
  const handleEnergyFlip = useCallback((energy) => {
    if (revealedEnergy) return; // Only allow one card to be revealed at a time
    
    setRevealedEnergy(energy.id);
    
    // Simple reveal - just show the energy and start shuffle after a brief delay
    setTimeout(() => {
      setSelectedEnergy(energy);
      setShowEnergySelection(false);
      setShowShuffleAnimation(true);
      setCardsReady(false);
      initializeMatchingCards();
      
      // Create shuffle animations
      const anims = Array.from({ length: 6 }, () => ({
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        scale: new Animated.Value(1),
      }));
      shuffleAnimations.current = anims;
      
      // Start shuffle animation
      anims.forEach((anim, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(anim.x, {
                toValue: Math.sin(i * 0.5) * 40,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(anim.y, {
                toValue: Math.cos(i * 0.5) * 30,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 0.85 + Math.sin(i * 0.4) * 0.15,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(anim.x, {
                toValue: Math.sin(i * 1) * -40,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(anim.y, {
                toValue: Math.cos(i * 1) * -30,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 0.85 + Math.sin(i * 0.8) * 0.15,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(anim.x, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(anim.y, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      });
      
      // After 2 seconds, stop shuffle and show cards
      setTimeout(() => {
        setShowShuffleAnimation(false);
        setCardsReady(true);
        // Stop all animations
        anims.forEach(anim => {
          anim.x.stopAnimation();
          anim.y.stopAnimation();
          anim.scale.stopAnimation();
        });
      }, 2000);
    }, 500); // Brief delay to show the revealed card
  }, [revealedEnergy, initializeMatchingCards]);

  // Select energy type and start shuffle
  const handleEnergySelect = useCallback((energy) => {
    handleEnergyFlip(energy);
  }, [handleEnergyFlip]);

  // Handle card selection
  const handleCardSelect = useCallback((cardId) => {
    if (!cardsReady || gameOver) return;

    const card = matchingCards.find(c => c.id === cardId);
    if (!card || card.isSelected) return;

    // Check if already selected 5 cards
    if (selectedCards.length >= 5) return;

    // Add card to selected (regardless of match)
    const updatedCards = matchingCards.map(c => 
      c.id === cardId ? { ...c, isSelected: true } : c
    );
    setMatchingCards(updatedCards);

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    // Check if selected 5 cards total - then end game and show results
    if (newSelected.length === 5) {
      setGameOver(true);
      // Count how many match the selected energy type
      const matchCount = newSelected.filter(c => c.energyType === selectedEnergy.id).length;
      setFinalMatchCount(matchCount);
      setModalType(matchCount > 0 ? 'success' : 'failure');
      setShowModal(true);
    }
    }, [cardsReady, gameOver, matchingCards, selectedCards, selectedEnergy]);

  // Reset game
  const resetGame = useCallback(() => {
    setSelectedEnergy(null);
    setRevealedEnergy(null);
    setShuffledEnergyTypes([]);
    setGameStarted(false);
    setShowEnergySelection(false);
    setShowShuffleAnimation(false);
    setCardsReady(false);
    setGameOver(false);
    setSelectedCards([]);
    setMatchingCards([]);
    setShowModal(false);
    setModalType(null);
    setFinalMatchCount(0);
    // Stop all animations
    shuffleAnimations.current.forEach(anim => {
      anim.x.stopAnimation();
      anim.y.stopAnimation();
      anim.scale.stopAnimation();
    });
    shuffleAnimations.current = [];
  }, []);

  // Close modal
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalType(null);
    resetGame();
  }, [resetGame]);

  const selectedCount = selectedCards.length;
  const matchedCount = selectedCards.filter(c => c.energyType === selectedEnergy?.id).length;

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
            <Title>ENERGY MATCH</Title>
            <TitleAccent />
          </TitleContainer>
              <DescriptionContainer>
                <Description>
                  Choose your energy type, then select 5 cards from the grid! Match as many as possible to your chosen energy type! ⚡
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
                  • Select one energy type (Grass, Electric, Fire, or Water){'\n'}
                  • Click "Start Game" to begin{'\n'}
                  • Select 5 cards from the 20 cards shown{'\n'}
                  • Match as many cards as possible to your chosen energy type{'\n'}
                  • Rewards are based on how many matches you get (0/5 to 5/5)!
                </HowToPlayText>
              </HowToPlayContent>
            )}
          </HowToPlaySection>

          {/* Progress Bar */}
          {selectedEnergy && cardsReady && (
            <ProgressBarContainer>
              <ProgressBarLabel>
                {selectedCount}/5 Cards Selected • {matchedCount} {selectedEnergy.name} Energy Matched
              </ProgressBarLabel>
              <ProgressBarWrapper>
                <ProgressBarFill style={{ width: `${(selectedCount / 5) * 100}%` }}>
                  {selectedCount > 0 && (
                    <ProgressBarText>{selectedCount}/5</ProgressBarText>
                  )}
                </ProgressBarFill>
              </ProgressBarWrapper>
            </ProgressBarContainer>
          )}

          {/* Selected Energy Display */}
          {selectedEnergy && (
            <SelectedEnergyDisplay selectedColor={selectedEnergy.color}>
              <SelectedEnergyText selectedColor={selectedEnergy.color}>
                Selected: {selectedEnergy.name} Energy
              </SelectedEnergyText>
                  <SelectedEnergySubtext>
                    Select 5 cards and match as many {selectedEnergy.name.toLowerCase()} energy cards as possible
                  </SelectedEnergySubtext>
            </SelectedEnergyDisplay>
          )}
        </HeaderSection>

        <GameArea>
          {/* Pre-start Overlay */}
          {!gameStarted && (
            <PreStartOverlay>
              <PreStartText>Ready to Match?</PreStartText>
              <PreStartSubtext>Click "Start Game" to begin</PreStartSubtext>
            </PreStartOverlay>
          )}

          {/* Energy Selection (2x2 grid with energy-card.png as back) */}
          {showEnergySelection && shuffledEnergyTypes.length > 0 && (
            <EnergySelectionGrid>
              {shuffledEnergyTypes.map((energy, index) => {
                const isLastInRow = (index + 1) % 2 === 0;
                const isLastRow = index >= 2;
                const isRevealed = revealedEnergy === energy.id;
                
                return (
                  <CardWrapper
                    key={energy.id}
                    isEnergy={true}
                    style={{
                      marginRight: isLastInRow ? 0 : CARD_GAP,
                      marginBottom: isLastRow ? 0 : CARD_GAP,
                    }}
                  >
                    <CardButton
                      onPress={() => handleEnergySelect(energy)}
                      activeOpacity={0.9}
                      disabled={isRevealed || revealedEnergy !== null}
                    >
                      <Card>
                        {isRevealed ? (
                          <CardImage
                            source={energy.image}
                            isEnergy={true}
                          />
                        ) : (
                          <CardImage
                            source={gameAssets.energyCard}
                            isEnergy={true}
                          />
                        )}
                      </Card>
                    </CardButton>
                  </CardWrapper>
                );
              })}
            </EnergySelectionGrid>
          )}

          {/* Shuffle Animation */}
          {showShuffleAnimation && (
            <ShuffleOverlay>
              <ShuffleAnimationContainer>
                {Array.from({ length: 6 }, (_, i) => {
                  const anim = shuffleAnimations.current[i];
                  if (!anim) return null;
                  
                  return (
                    <Animated.View
                      key={i}
                      style={{
                        position: 'absolute',
                        width: 100,
                        height: 150,
                        transform: [
                          { translateX: anim.x },
                          { translateY: anim.y },
                          { scale: anim.scale },
                        ],
                        zIndex: i,
                      }}
                    >
                      <Image
                        source={gameAssets.energyCard}
                        resizeMode="contain"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Animated.View>
                  );
                })}
              </ShuffleAnimationContainer>
              <ShuffleText>Shuffling Cards...</ShuffleText>
              <ShuffleSubtext>Preparing energy cards</ShuffleSubtext>
            </ShuffleOverlay>
          )}

          {/* Matching Cards Grid (20 cards) */}
          {cardsReady && matchingCards.length > 0 && (
            <MatchingCardsGrid>
              {matchingCards.map((card, index) => {
                const isLastInRow = (index + 1) % 4 === 0;
                const isLastRow = index >= 16;
                const isMatch = card.energyType === selectedEnergy.id;
                
                return (
                  <CardWrapper
                    key={card.id}
                    isMatching={true}
                    style={{
                      marginRight: isLastInRow ? 0 : CARD_GAP,
                      marginBottom: isLastRow ? 0 : CARD_GAP,
                    }}
                  >
                    <CardButton
                      onPress={() => handleCardSelect(card.id)}
                      disabled={!cardsReady || gameOver || card.isSelected || selectedCards.length >= 5}
                      activeOpacity={0.9}
                    >
                      <Card>
                        {card.isSelected ? (
                          <CardImage
                            source={card.energy.image}
                            isMatching={true}
                          />
                        ) : (
                          <CardImage
                            source={gameAssets.energyCard}
                            isMatching={true}
                          />
                        )}
                      </Card>
                    </CardButton>
                  </CardWrapper>
                );
              })}
            </MatchingCardsGrid>
          )}
        </GameArea>

        {/* Controls */}
        <ButtonRow>
          {!gameStarted ? (
            <ControlButton onPress={startGame}>
              <ControlButtonText>Start Game</ControlButtonText>
            </ControlButton>
          ) : showShuffleAnimation ? (
            <ControlButton disabled>
              <ControlButtonText>Shuffling...</ControlButtonText>
            </ControlButton>
          ) : gameStarted && !gameOver ? (
            <ControlButton disabled>
              <ControlButtonText>In Play</ControlButtonText>
            </ControlButton>
          ) : (
            <ControlButton
              onPress={resetGame}
              disabled={false}
            >
              <ControlButtonText>New Game</ControlButtonText>
            </ControlButton>
          )}
        </ButtonRow>
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
            {modalType === 'success' ? (
              <>
                <ModalIcon bgColor={selectedEnergy?.color || '#00ffff'}>
                  <Ionicons name="trophy" size={48} color="#ffffff" />
                </ModalIcon>
                <ModalTitle>Game Complete!</ModalTitle>
                
                <MatchCountContainer borderColor={selectedEnergy?.color || '#00ffff'}>
                  <MatchCountLabel>{selectedEnergy?.name} Energy Matched</MatchCountLabel>
                  <MatchCountDisplay>
                    <MatchCountNumber color={selectedEnergy?.color || '#00ffff'}>
                      {finalMatchCount}
                    </MatchCountNumber>
                    <MatchCountDivider>/</MatchCountDivider>
                    <MatchCountTotal>5</MatchCountTotal>
                  </MatchCountDisplay>
                  <MatchResultText>
                    {finalMatchCount === 5 
                      ? '🎉 Perfect! All matches found!'
                      : finalMatchCount >= 3
                      ? '✨ Great job!'
                      : '👍 Keep trying!'}
                  </MatchResultText>
                </MatchCountContainer>
                
                <RewardInfoText>
                  Rewards have been added to your account
                </RewardInfoText>
                
                <ModalButton onPress={handleCloseModal} activeOpacity={0.8}>
                  <ModalButtonText>Continue</ModalButtonText>
                </ModalButton>
              </>
            ) : modalType === 'failure' ? (
              <>
                <ModalIcon bgColor="#FF4444">
                  <Ionicons name="close-circle" size={48} color="#ffffff" />
                </ModalIcon>
                <ModalTitle>Game Complete!</ModalTitle>
                
                <MatchCountContainer borderColor="#FF4444">
                  <MatchCountLabel>{selectedEnergy?.name} Energy Matched</MatchCountLabel>
                  <MatchCountDisplay>
                    <MatchCountNumber color="#FF4444">
                      {finalMatchCount}
                    </MatchCountNumber>
                    <MatchCountDivider>/</MatchCountDivider>
                    <MatchCountTotal>5</MatchCountTotal>
                  </MatchCountDisplay>
                  <MatchResultText>
                    Better luck next time!
                  </MatchResultText>
                </MatchCountContainer>
                
                <RewardInfoText>
                  Rewards have been added to your account
                </RewardInfoText>
                
                <ModalButton onPress={handleCloseModal} activeOpacity={0.8}>
                  <ModalButtonText>Back to Game</ModalButtonText>
                </ModalButton>
              </>
            ) : null}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Container>
  );
}


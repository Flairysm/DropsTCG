import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logger } from '../../../utils/logger';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_MARGIN) / 1.5;

const Container = styled.View`
  padding-top: 24px;
  padding-bottom: 24px;
  position: relative;
`;

const Header = styled.View`
  padding-horizontal: ${HORIZONTAL_PADDING}px;
  margin-bottom: 16px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const VerticalBar = styled.View`
  width: 4px;
  height: 24px;
  background-color: ${(props) => props.theme.colors.accent};
  margin-right: 12px;
  border-radius: 2px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  letter-spacing: 1px;
`;

const Carousel = styled.ScrollView`
  margin-bottom: 16px;
`;

const GameCard = styled(TouchableOpacity)`
  width: ${CARD_WIDTH}px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  overflow: hidden;
  margin-right: ${CARD_MARGIN}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
  position: relative;
  z-index: 10;
  elevation: 10;
`;

const LastCard = styled(GameCard)`
  margin-right: ${HORIZONTAL_PADDING}px;
`;

const GameIconContainer = styled.View`
  width: 100%;
  height: 120px;
  background-color: ${(props) => props.theme.colors.primary};
  opacity: 0.3;
  justify-content: center;
  align-items: center;
`;

const GameInfo = styled.View`
  padding: 16px;
`;

const GameName = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 6px;
`;

const GameDescription = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 12px;
  min-height: 32px;
`;

const EntryCostContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const EntryCostText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.accent};
  margin-left: 4px;
  font-weight: 600;
`;

const RewardsContainer = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-top: 8px;
  padding-top: 8px;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.borderLight};
`;

const RewardsText = styled.Text`
  font-size: 11px;
  color: #ffd700;
  margin-left: 4px;
  flex: 1;
  opacity: 0.9;
`;

const defaultGames = [
  {
    id: 'find-pikachu',
    name: 'Find Pikachu',
    description: 'Find all 4 Pikachu cards. Avoid the rocks!',
    icon: 'flash',
    entryCost: 50,
    rewards: 'Tier D-S rewards based on score',
  },
  {
    id: 'energy-matching',
    name: 'Energy Match',
    description: 'Match energy cards to win',
    icon: 'flash',
    entryCost: 50,
    rewards: 'Rare cards, tokens, pack entries',
  },
];

export default function MinigamesSection({ games, category }) {
  const theme = useTheme();
  const navigation = useNavigation();

  const displayGames = games || defaultGames;

  const handleGamePress = (gameId) => {
    if (gameId === 'find-pikachu') {
      navigation.navigate('FindPikachu');
    } else if (gameId === 'energy-matching') {
      navigation.navigate('EnergyMatching');
    } else {
      logger.debug('Navigate to minigame', { gameId, category });
      // TODO: Navigate to other minigame screens when implemented
    }
  };

  return (
    <Container>
      <Header>
        <TitleContainer>
          <VerticalBar />
          <SectionTitle>MINIGAMES</SectionTitle>
        </TitleContainer>
      </Header>
      <Carousel
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: HORIZONTAL_PADDING,
          paddingRight: HORIZONTAL_PADDING,
        }}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        {displayGames.map((game, index) => {
          const isLast = index === displayGames.length - 1;
          const CardComponent = isLast ? LastCard : GameCard;

          return (
            <CardComponent
              key={game.id}
              onPress={() => handleGamePress(game.id)}
              activeOpacity={0.8}
            >
              {/* Game Icon Container */}
              <GameIconContainer>
                <Ionicons name={game.icon} size={48} color={theme.colors.accent} />
              </GameIconContainer>

              {/* Game Info */}
              <GameInfo>
                <GameName numberOfLines={1}>{game.name}</GameName>
                <GameDescription numberOfLines={2}>{game.description}</GameDescription>

                {game.entryCost && (
                  <EntryCostContainer>
                    <Ionicons name="diamond" size={14} color={theme.colors.accent} />
                    <EntryCostText>{game.entryCost} tokens to play</EntryCostText>
                  </EntryCostContainer>
                )}

                <RewardsContainer>
                  <Ionicons name="trophy-outline" size={14} color="#FFD700" />
                  <RewardsText numberOfLines={2}>{game.rewards}</RewardsText>
                </RewardsContainer>
              </GameInfo>
            </CardComponent>
          );
        })}
      </Carousel>
    </Container>
  );
}


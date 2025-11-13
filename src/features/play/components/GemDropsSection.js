import React, { useMemo, useCallback } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_MARGIN) / 1.5;

const Container = styled.View`
  padding-top: 32px;
  padding-bottom: 32px;
  position: relative;
`;

const Header = styled.View`
  padding-horizontal: ${HORIZONTAL_PADDING}px;
  margin-bottom: 20px;
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

const CarouselContent = styled.View`
  padding-left: ${HORIZONTAL_PADDING}px;
  padding-right: ${HORIZONTAL_PADDING}px;
`;

const DropCard = styled(TouchableOpacity)`
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

const LastCard = styled(DropCard)`
  margin-right: ${HORIZONTAL_PADDING}px;
`;

const DropImageContainer = styled.View`
  width: 100%;
  height: 180px;
  justify-content: center;
  align-items: center;
  padding-vertical: 20px;
  background-color: ${(props) => `${props.bgColor}20`};
`;

const GemIconContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  background-color: ${(props) => props.bgColor};
`;

const RarityBadgeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-radius: 12px;
`;

const RarityDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  margin-right: 6px;
  background-color: ${(props) => props.color};
`;

const RarityText = styled.Text`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${(props) => props.color};
`;

const DropInfo = styled.View`
  padding: 16px;
`;

const DropName = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
`;

const DropDescription = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 8px;
  min-height: 32px;
`;

const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const PriceText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
  margin-left: 6px;
`;

const defaultDrops = [
  {
    id: 'diamond',
    name: 'Diamond Drops',
    gemType: 'Diamond',
    description: 'Mid-range cards with guaranteed chase cards',
    price: 1000,
    cardTierRange: 'B-S',
    rarity: 'common',
    icon: 'diamond',
    color: '#B9F2FF',
    remainingBoxes: 756,
    totalBoxes: 1000,
  },
  {
    id: 'emerald',
    name: 'Emerald Drops',
    gemType: 'Emerald',
    description: 'Higher tier cards with increased chances',
    price: 2000,
    cardTierRange: 'A-SS',
    rarity: 'uncommon',
    icon: 'leaf',
    color: '#50C878',
    remainingBoxes: 342,
    totalBoxes: 500,
  },
  {
    id: 'ruby',
    name: 'Ruby Drops',
    gemType: 'Ruby',
    description: 'Premium cards with guaranteed high-tier pulls',
    price: 5000,
    cardTierRange: 'S-SS',
    rarity: 'rare',
    icon: 'flame',
    color: '#E0115F',
    remainingBoxes: 89,
    totalBoxes: 200,
  },
  {
    id: 'sapphire',
    name: 'Sapphire Drops',
    gemType: 'Sapphire',
    description: 'Ultra-premium drops with finest cards',
    price: 7500,
    cardTierRange: 'SS-SSS',
    rarity: 'epic',
    icon: 'water',
    color: '#0F52BA',
    remainingBoxes: 45,
    totalBoxes: 150,
  },
  {
    id: 'obsidian',
    name: 'Obsidian Drops',
    gemType: 'Obsidian',
    description: 'The ultimate gem drop - all premium chase cards',
    price: 10000,
    cardTierRange: 'SSS only',
    rarity: 'legendary',
    icon: 'moon',
    color: '#000000',
    remainingBoxes: 12,
    totalBoxes: 100,
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

export default function GemDropsSection({ drops, category }) {
  const theme = useTheme();
  const navigation = useNavigation();

  const displayDrops = drops || defaultDrops;

  const handleDropPress = useCallback(
    (dropId) => {
      navigation.navigate('GemDrops', { gemDropId: dropId });
    },
    [navigation]
  );

  const rarityColors = useMemo(() => {
    return displayDrops.reduce((acc, drop) => {
      acc[drop.id] = getRarityColor(drop.rarity);
      return acc;
    }, {});
  }, [displayDrops]);

  return (
    <Container>
      <Header>
        <TitleContainer>
          <VerticalBar />
          <SectionTitle>GEM DROPS</SectionTitle>
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
        {displayDrops.map((drop, index) => {
          const rarityColor = rarityColors[drop.id];
          const isLast = index === displayDrops.length - 1;
          const CardComponent = isLast ? LastCard : DropCard;

          return (
            <CardComponent
              key={drop.id}
              onPress={() => handleDropPress(drop.id)}
              activeOpacity={0.8}
            >
              {/* Gem Icon Header */}
              <DropImageContainer bgColor={drop.color}>
                <GemIconContainer bgColor={drop.color}>
                  <Ionicons name={drop.icon} size={48} color="#ffffff" />
                </GemIconContainer>
                <RarityBadgeContainer>
                  <RarityDot color={rarityColor} />
                  <RarityText color={rarityColor}>{drop.rarity.toUpperCase()}</RarityText>
                </RarityBadgeContainer>
              </DropImageContainer>

              {/* Drop Info */}
              <DropInfo>
                <DropName numberOfLines={1}>{drop.name}</DropName>
                <DropDescription numberOfLines={2}>{drop.description}</DropDescription>

                <PriceContainer>
                  <Ionicons name="diamond" size={16} color={theme.colors.accent} />
                  <PriceText>{drop.price.toLocaleString()} tokens</PriceText>
                </PriceContainer>
              </DropInfo>
            </CardComponent>
          );
        })}
      </Carousel>
    </Container>
  );
}


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

const BoxCard = styled(TouchableOpacity)`
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

const LastCard = styled(BoxCard)`
  margin-right: ${HORIZONTAL_PADDING}px;
`;

const BoxImageContainer = styled.View`
  width: 100%;
  height: 180px;
  justify-content: center;
  align-items: center;
  padding-vertical: 20px;
  background-color: ${(props) => `${props.bgColor}20`};
`;

const BoxIconContainer = styled.View`
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

const BoxInfo = styled.View`
  padding: 16px;
`;

const BoxName = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
`;

const BoxDescription = styled.Text`
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

const defaultBoxes = [
  {
    id: 'charizard',
    name: 'Charizard Box',
    theme: 'Charizard',
    description: 'Every card features Charizard variants',
    price: 3000,
    cardTierRange: 'A-SS',
    rarity: 'rare',
    icon: 'flame',
    color: '#FF6B35',
    remainingBoxes: 234,
    totalBoxes: 500,
  },
  {
    id: 'pikachu',
    name: 'Pikachu Box',
    theme: 'Pikachu',
    description: 'All Pikachu-themed cards collection',
    price: 2500,
    cardTierRange: 'B-S',
    rarity: 'uncommon',
    icon: 'flash',
    color: '#FFD700',
    remainingBoxes: 456,
    totalBoxes: 750,
  },
  {
    id: 'eeveelution',
    name: 'Eeveelution Box',
    theme: 'Eeveelution',
    description: 'Complete Eeveelution evolution line',
    price: 4000,
    cardTierRange: 'S-SS',
    rarity: 'epic',
    icon: 'sparkles',
    color: '#9B59B6',
    remainingBoxes: 89,
    totalBoxes: 200,
  },
  {
    id: 'legendary',
    name: 'Legendary Box',
    theme: 'Legendary',
    description: 'Exclusive legendary Pokemon cards',
    price: 6000,
    cardTierRange: 'SS-SSS',
    rarity: 'legendary',
    icon: 'star',
    color: '#FFD700',
    remainingBoxes: 45,
    totalBoxes: 150,
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

export default function MysteryBoxesSection({ boxes, category }) {
  const theme = useTheme();
  const navigation = useNavigation();

  const displayBoxes = boxes || defaultBoxes;

  const handleBoxPress = useCallback(
    (boxId) => {
      navigation.navigate('MysteryBox', { boxId });
    },
    [navigation]
  );

  const rarityColors = useMemo(() => {
    return displayBoxes.reduce((acc, box) => {
      acc[box.id] = getRarityColor(box.rarity);
      return acc;
    }, {});
  }, [displayBoxes]);

  return (
    <Container>
      <Header>
        <TitleContainer>
          <VerticalBar />
          <SectionTitle>MYSTERY BOXES</SectionTitle>
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
        {displayBoxes.map((box, index) => {
          const rarityColor = rarityColors[box.id];
          const isLast = index === displayBoxes.length - 1;
          const CardComponent = isLast ? LastCard : BoxCard;

          return (
            <CardComponent
              key={box.id}
              onPress={() => handleBoxPress(box.id)}
              activeOpacity={0.8}
            >
              {/* Box Icon Header */}
              <BoxImageContainer bgColor={box.color}>
                <BoxIconContainer bgColor={box.color}>
                  <Ionicons name={box.icon} size={48} color="#ffffff" />
                </BoxIconContainer>
                <RarityBadgeContainer>
                  <RarityDot color={rarityColor} />
                  <RarityText color={rarityColor}>{box.rarity.toUpperCase()}</RarityText>
                </RarityBadgeContainer>
              </BoxImageContainer>

              {/* Box Info */}
              <BoxInfo>
                <BoxName numberOfLines={1}>{box.name}</BoxName>
                <BoxDescription numberOfLines={2}>{box.description}</BoxDescription>

                <PriceContainer>
                  <Ionicons name="diamond" size={16} color={theme.colors.accent} />
                  <PriceText>{box.price.toLocaleString()} tokens</PriceText>
                </PriceContainer>
              </BoxInfo>
            </CardComponent>
          );
        })}
      </Carousel>
    </Container>
  );
}


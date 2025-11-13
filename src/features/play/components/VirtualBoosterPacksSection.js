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

const PackCard = styled(TouchableOpacity)`
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

const LastCard = styled(PackCard)`
  margin-right: ${HORIZONTAL_PADDING}px;
`;

const PackImageContainer = styled.View`
  width: 100%;
  height: 180px;
  justify-content: center;
  align-items: center;
  padding-vertical: 20px;
  background-color: ${(props) => (props.bgColor ? `${props.bgColor}20` : props.theme.colors.primary)};
  opacity: ${(props) => (props.bgColor ? 1 : 0.3)};
`;

const PackIconContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
  background-color: ${(props) => props.bgColor || props.theme.colors.accent};
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

const PackInfo = styled.View`
  padding: 16px;
`;

const PackName = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
`;

const PackSet = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 12px;
`;

const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const PriceText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
  margin-left: 6px;
`;

const defaultPacks = [
  {
    id: 'evolving-skies',
    name: 'Evolving Skies',
    set: 'Evolving Skies',
    price: 2000,
    description: 'Featuring powerful Eeveelution VMAX cards and stunning alternate art cards',
    rarity: 'epic',
    icon: 'sparkles',
    color: '#6B46C1',
  },
  {
    id: 'mega-inferno-x',
    name: 'Mega Inferno X',
    set: 'Mega Inferno X',
    price: 2500,
    description: 'Fire-type Pokemon collection with exclusive Mega Evolution cards',
    rarity: 'rare',
    icon: 'flame',
    color: '#FF6B35',
  },
  {
    id: 'base-set',
    name: 'Base Set',
    set: 'Base Set',
    price: 3000,
    description: 'The original Pokemon TCG set featuring classic cards',
    rarity: 'legendary',
    icon: 'star',
    color: '#FFD700',
  },
  {
    id: 'chilling-reign',
    name: 'Chilling Reign',
    set: 'Chilling Reign',
    price: 1800,
    description: 'Ice and water-type Pokemon with beautiful full-art cards',
    rarity: 'uncommon',
    icon: 'snow',
    color: '#3B82F6',
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

export default function VirtualBoosterPacksSection({ packs, category }) {
  const theme = useTheme();
  const navigation = useNavigation();

  const displayPacks = packs || defaultPacks;

  const handlePackPress = useCallback(
    (packId) => {
      navigation.navigate('VirtualBoosterPack', { packId });
    },
    [navigation]
  );

  const rarityColors = useMemo(() => {
    return displayPacks.reduce((acc, pack) => {
      if (pack.rarity) {
        acc[pack.id] = getRarityColor(pack.rarity);
      }
      return acc;
    }, {});
  }, [displayPacks]);

  return (
    <Container>
      <Header>
        <TitleContainer>
          <VerticalBar />
          <SectionTitle>VIRTUAL BOOSTER PACKS</SectionTitle>
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
        {displayPacks.map((pack, index) => {
          const rarityColor = pack.rarity ? rarityColors[pack.id] : theme.colors.accent;
          const isLast = index === displayPacks.length - 1;
          const CardComponent = isLast ? LastCard : PackCard;

          return (
            <CardComponent
              key={pack.id}
              onPress={() => handlePackPress(pack.id)}
              activeOpacity={0.8}
            >
              {/* Pack Icon Header */}
              <PackImageContainer bgColor={pack.color}>
                <PackIconContainer bgColor={pack.color}>
                  <Ionicons name={pack.icon || 'albums'} size={48} color="#ffffff" />
                </PackIconContainer>
                {pack.rarity && (
                  <RarityBadgeContainer>
                    <RarityDot color={rarityColor} />
                    <RarityText color={rarityColor}>{pack.rarity.toUpperCase()}</RarityText>
                  </RarityBadgeContainer>
                )}
              </PackImageContainer>

              {/* Pack Info */}
              <PackInfo>
                <PackName numberOfLines={1}>{pack.name}</PackName>
                <PackSet numberOfLines={1}>{pack.set}</PackSet>

                <PriceContainer>
                  <Ionicons name="diamond" size={16} color={theme.colors.accent} />
                  <PriceText>{pack.price.toLocaleString()} tokens</PriceText>
                </PriceContainer>
              </PackInfo>
            </CardComponent>
          );
        })}
      </Carousel>
    </Container>
  );
}


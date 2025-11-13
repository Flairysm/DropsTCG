import React from 'react';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 12;
// Show 2.5 cards per screen
const CARD_WIDTH =
  (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_MARGIN * 1.5) / 2.5;
// Pokemon card dimensions: 2.5" × 3.5" (aspect ratio = 3.5/2.5 = 1.4 for height/width)
const POKEMON_CARD_ASPECT_RATIO = 3.5 / 2.5; // height/width = 1.4
const CARD_IMAGE_HEIGHT = CARD_WIDTH * POKEMON_CARD_ASPECT_RATIO;

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
  background-color: #40ffdc;
  margin-right: 12px;
  border-radius: 2px;
`;

const SectionTitle = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
`;

const Carousel = styled.ScrollView`
  margin-bottom: 16px;
`;

const PullCard = styled.TouchableOpacity`
  width: ${CARD_WIDTH}px;
  background-color: #12042b;
  border-radius: 16px;
  overflow: hidden;
  margin-right: ${(props) =>
    props.isLast ? HORIZONTAL_PADDING : CARD_MARGIN}px;
  border-width: 1px;
  border-color: rgba(64, 255, 220, 0.2);
  position: relative;
  z-index: 10;
  elevation: 10;
`;

const CardImageContainer = styled.View`
  width: 100%;
  height: ${CARD_IMAGE_HEIGHT}px;
  background-color: #1a0a3a;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CardImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const CardPlaceholderText = styled.Text`
  color: #40ffdc;
  font-size: 12px;
  font-weight: 600;
  margin-top: 8px;
  text-align: center;
  padding-horizontal: 16px;
`;

const PullInfo = styled.View`
  padding: 12px;
  flex: 1;
  justify-content: space-between;
  min-height: 120px;
`;

const TopSection = styled.View`
  flex: 1;
`;

const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const UserName = styled.Text`
  font-size: 12px;
  color: #ffffff;
  margin-left: 6px;
  opacity: 0.8;
  flex: 1;
`;

const CardName = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
  min-height: 38px;
`;

const TierBadge = styled.View`
  align-self: flex-start;
  padding-horizontal: 8px;
  padding-vertical: 4px;
  border-radius: 4px;
  border-width: 1px;
  border-color: ${(props) => props.borderColor};
  margin-top: 4px;
`;

const TierText = styled.Text`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: ${(props) => props.color};
`;

const BottomSection = styled.View`
  margin-top: auto;
`;

const TimeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const TimeText = styled.Text`
  font-size: 11px;
  color: #ffffff;
  margin-left: 4px;
  opacity: 0.6;
`;

const RecentPulls = ({ pulls }) => {
  // Sample recent pulls data - replace with real data from your API/state
  const defaultPulls = [
    {
      id: '1',
      userName: 'Player123',
      cardName: 'Charizard VMAX',
      tier: 'SSS',
      pulledAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: '2',
      userName: 'TCGCollector',
      cardName: 'Pikachu VMAX',
      tier: 'SS',
      pulledAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    {
      id: '3',
      userName: 'CardMaster',
      cardName: 'Blastoise VMAX',
      tier: 'SSS',
      pulledAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    },
    {
      id: '4',
      userName: 'PokemonFan',
      cardName: 'Venusaur VMAX',
      tier: 'S',
      pulledAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
  ];

  const displayPulls = pulls || defaultPulls;

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case 'SSS':
        return '#9B59B6'; // Purple
      case 'SS':
        return '#FFD700'; // Gold
      case 'S':
        return '#FF69B4'; // Pink
      case 'A':
        return '#FF4444'; // Red
      case 'B':
        return '#10B981'; // Green
      case 'C':
        return '#3498DB'; // Blue
      case 'D':
        return '#95A5A6'; // Gray
      default:
        return '#40ffdc';
    }
  };

  return (
    <Container>
      <Header>
        <TitleContainer>
          <VerticalBar />
          <SectionTitle>RECENT PULLS</SectionTitle>
        </TitleContainer>
      </Header>
      <Carousel
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: HORIZONTAL_PADDING,
          paddingRight: HORIZONTAL_PADDING,
        }}
      >
        {displayPulls.map((pull, index) => {
          const timeAgo = formatTimeAgo(pull.pulledAt);
          const tierColor = getTierColor(pull.tier);

          return (
            <PullCard key={pull.id} isLast={index === displayPulls.length - 1}>
              {/* Card Image */}
              <CardImageContainer>
                {pull.cardImage ? (
                  <CardImage
                    source={{ uri: pull.cardImage }}
                    resizeMode="cover"
                  />
                ) : (
                  <>
                    <Ionicons name="card-outline" size={48} color={tierColor} />
                    <CardPlaceholderText>{pull.cardName}</CardPlaceholderText>
                  </>
                )}
              </CardImageContainer>

              {/* Pull Info */}
              <PullInfo>
                <TopSection>
                  {/* User Info */}
                  <UserInfo>
                    <Ionicons
                      name="person-circle-outline"
                      size={16}
                      color="#40ffdc"
                    />
                    <UserName numberOfLines={1}>{pull.userName}</UserName>
                  </UserInfo>

                  {/* Card Name */}
                  <CardName numberOfLines={2}>{pull.cardName}</CardName>

                  {/* Tier Badge */}
                  <TierBadge borderColor={tierColor}>
                    <TierText color={tierColor}>{pull.tier}</TierText>
                  </TierBadge>
                </TopSection>

                {/* Bottom Section - Time */}
                <BottomSection>
                  <TimeContainer>
                    <Ionicons
                      name="time-outline"
                      size={14}
                      color="#ffffff"
                      style={{ opacity: 0.6 }}
                    />
                    <TimeText>{timeAgo}</TimeText>
                  </TimeContainer>
                </BottomSection>
              </PullInfo>
            </PullCard>
          );
        })}
      </Carousel>
    </Container>
  );
};

export default RecentPulls;

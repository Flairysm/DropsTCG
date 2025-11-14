import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_MARGIN = 16; // Space between cards
// Show 1.5 cards per screen: card width = (screen width - padding - margin) / 1.5
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

const RaffleCard = styled.TouchableOpacity`
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

const PrizeImageContainer = styled.View`
  width: 100%;
  height: 180px;
  background-color: #1a0a3a;
  justify-content: center;
  align-items: center;
`;

const PrizePlaceholderText = styled.Text`
  color: #40ffdc;
  font-size: 14px;
  font-weight: 700;
  margin-top: 8px;
  text-align: center;
  padding-horizontal: 16px;
`;

const ConsolationText = styled.Text`
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  margin-top: 4px;
  text-align: center;
  padding-horizontal: 16px;
  opacity: 0.8;
`;

const RaffleInfo = styled.View`
  padding: 16px;
  flex: 1;
  justify-content: space-between;
  min-height: 220px;
`;

const TopSection = styled.View`
  flex: 1;
`;

const RaffleTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  min-height: 50px;
`;

const ProgressContainer = styled.View`
  margin-bottom: 12px;
`;

const ProgressBar = styled.View`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
`;

const ProgressFill = styled.View`
  height: 100%;
  background-color: #40ffdc;
  border-radius: 4px;
  width: ${(props) => props.width}%;
`;

const ProgressText = styled.Text`
  font-size: 12px;
  color: #ffffff;
  opacity: 0.7;
`;

const DetailsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const DetailItem = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const DetailText = styled.Text`
  font-size: 14px;
  color: #ffffff;
  margin-left: 6px;
  opacity: 0.9;
`;

const PrizesContainer = styled.View`
  margin-top: 12px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: rgba(64, 255, 220, 0.1);
`;

const PrizeItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const PrizePosition = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #40ffdc;
  width: 32px;
  margin-right: 8px;
`;

const PrizeName = styled.Text`
  font-size: 12px;
  color: #ffffff;
  flex: 1;
  opacity: 0.9;
`;

const BottomSection = styled.View`
  margin-top: auto;
`;

const SlotsRemainingContainer = styled.View`
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: rgba(64, 255, 220, 0.1);
  margin-bottom: 12px;
`;

const SlotsRemainingText = styled.Text`
  font-size: 14px;
  color: #40ffdc;
  font-weight: 600;
  text-align: center;
`;

const ViewDetailsButton = styled.TouchableOpacity`
  margin-top: 12px;
  background-color: #40ffdc;
  border-radius: 8px;
  padding-vertical: 12px;
  padding-horizontal: 16px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ViewDetailsText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: #0a0019;
  margin-right: 4px;
`;

const RafflesSection = ({ raffles }) => {
  const navigation = useNavigation();

  // Sample raffle data - replace with real data from your API/state
  const defaultRaffles = [
    {
      id: '1',
      title: 'Charizard VMAX Booster Box',
      prizes: [
        { position: 1, name: 'Charizard VMAX Booster Box' },
        { position: 2, name: 'PSA 10 Charizard VMAX' },
        { position: 3, name: 'Charizard VMAX Single' },
      ],
      consolationPrize: {
        tokens: 1, // 1 token guaranteed for non-winners
      },
      totalSlots: 100,
      filledSlots: 45,
      tokensPerSlot: 200,
      isActive: true,
    },
    {
      id: '2',
      title: 'PSA 10 Pikachu VMAX',
      prizes: [
        { position: 1, name: 'PSA 10 Pikachu VMAX' },
        { position: 2, name: 'Pikachu VMAX Booster Box' },
        { position: 3, name: 'Pikachu VMAX Single' },
      ],
      consolationPrize: {
        tokens: 1, // 1 token guaranteed for non-winners
      },
      totalSlots: 50,
      filledSlots: 32,
      tokensPerSlot: 400,
      isActive: true,
    },
  ];

  const displayRaffles = raffles || defaultRaffles;

  const getProgressPercentage = (filled, total) => {
    return (filled / total) * 100;
  };

  const handleViewDetails = (raffleId) => {
    // Navigate to Play tab, then to Raffle screen within PlayNavigator
    navigation.navigate('Play', { 
      screen: 'Raffle', 
      params: { raffleId } 
    });
  };

  return (
    <Container>
      <Header>
        <TitleContainer>
          <VerticalBar />
          <SectionTitle>RAFFLE EVENTS</SectionTitle>
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
        {displayRaffles.map((raffle, index) => {
          const progress = getProgressPercentage(
            raffle.filledSlots,
            raffle.totalSlots
          );
          const slotsRemaining = raffle.totalSlots - raffle.filledSlots;

          return (
            <RaffleCard
              key={raffle.id}
              isLast={index === displayRaffles.length - 1}
              onPress={() => handleViewDetails(raffle.id)}
              activeOpacity={0.8}
            >
              {/* Prize Image Placeholder */}
              <PrizeImageContainer>
                <Ionicons name="trophy-outline" size={48} color="#40ffdc" />
                <PrizePlaceholderText>
                  {raffle.prizes.length} Main Prizes
                </PrizePlaceholderText>
                <ConsolationText>
                  + {raffle.consolationPrize.tokens} token consolation
                </ConsolationText>
              </PrizeImageContainer>

              {/* Raffle Info */}
              <RaffleInfo>
                <TopSection>
                  <RaffleTitle numberOfLines={2}>{raffle.title}</RaffleTitle>

                  {/* Progress Bar */}
                  <ProgressContainer>
                    <ProgressBar>
                      <ProgressFill width={progress} />
                    </ProgressBar>
                    <ProgressText>
                      {raffle.filledSlots} / {raffle.totalSlots} slots
                    </ProgressText>
                  </ProgressContainer>

                  {/* Price in Tokens */}
                  <DetailsRow>
                    <DetailItem>
                      <Ionicons name="cash-outline" size={16} color="#40ffdc" />
                      <DetailText>
                        {raffle.tokensPerSlot.toLocaleString()} tokens per slot
                      </DetailText>
                    </DetailItem>
                  </DetailsRow>

                  {/* Prizes List */}
                  <PrizesContainer>
                    {raffle.prizes.map((prize, prizeIndex) => (
                      <PrizeItem key={prizeIndex}>
                        <PrizePosition>
                          {prize.position === 1
                            ? '1st'
                            : prize.position === 2
                              ? '2nd'
                              : '3rd'}
                        </PrizePosition>
                        <PrizeName numberOfLines={1}>{prize.name}</PrizeName>
                      </PrizeItem>
                    ))}
                  </PrizesContainer>
                </TopSection>

                {/* Bottom Section - Fixed at bottom */}
                <BottomSection>
                  {/* Slots Remaining */}
                  <SlotsRemainingContainer>
                    <SlotsRemainingText>
                      {slotsRemaining} slots remaining
                    </SlotsRemainingText>
                  </SlotsRemainingContainer>

                  {/* View Details Button */}
                  <ViewDetailsButton
                    onPress={() => handleViewDetails(raffle.id)}
                  >
                    <ViewDetailsText>View Details</ViewDetailsText>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#0a0019"
                    />
                  </ViewDetailsButton>
                </BottomSection>
              </RaffleInfo>
            </RaffleCard>
          );
        })}
      </Carousel>
    </Container>
  );
};

export default RafflesSection;

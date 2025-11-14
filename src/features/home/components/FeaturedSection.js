import React, { useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from 'styled-components/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2; // Full width minus padding

const Container = styled.View`
  padding-top: 24px;
  padding-bottom: 32px;
  z-index: 10;
  elevation: 10;
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

const FeaturedCard = styled.TouchableOpacity`
  width: ${CARD_WIDTH}px;
  background-color: #12042b;
  border-radius: 16px;
  overflow: hidden;
  margin-right: ${(props) =>
    props.isLast ? HORIZONTAL_PADDING : HORIZONTAL_PADDING}px;
  border-width: 1px;
  border-color: rgba(64, 255, 220, 0.2);
  z-index: 10;
  elevation: 10;
`;

const ImageContainer = styled.View`
  width: 100%;
  height: 200px;
`;

const PlaceholderImage = styled.View`
  width: 100%;
  height: 100%;
  background-color: #1a0a3a;
  justify-content: center;
  align-items: center;
`;

const PlaceholderText = styled.Text`
  color: #40ffdc;
  font-size: 14px;
  font-weight: 600;
  margin-top: 8px;
`;

const Pagination = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-horizontal: ${HORIZONTAL_PADDING}px;
  margin-top: 4px;
`;

const PaginationDot = styled.TouchableOpacity`
  width: ${(props) => (props.isActive ? '24px' : '8px')};
  height: 8px;
  border-radius: 4px;
  background-color: ${(props) =>
    props.isActive ? '#40ffdc' : 'rgba(255, 255, 255, 0.3)'};
  margin-right: ${(props) => (props.isLast ? '0px' : '8px')};
`;

const FeaturedSection = React.memo(({ events }) => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample featured events - replace with real data from your API/state
  const defaultEvents = [{ id: '1' }, { id: '2' }, { id: '3' }];

  const displayEvents = events || defaultEvents;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidthWithSpacing = CARD_WIDTH + HORIZONTAL_PADDING;
    const index = Math.round(scrollPosition / cardWidthWithSpacing);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index) => {
    const cardWidthWithSpacing = CARD_WIDTH + HORIZONTAL_PADDING;
    scrollViewRef.current?.scrollTo({
      x: index * cardWidthWithSpacing,
      animated: true,
    });
  };

  return (
    <Container>
      <Header>
        <TitleContainer>
          <VerticalBar />
          <SectionTitle>FEATURED</SectionTitle>
        </TitleContainer>
      </Header>
      <Carousel
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH + HORIZONTAL_PADDING}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: HORIZONTAL_PADDING,
          paddingRight: HORIZONTAL_PADDING,
        }}
      >
        {displayEvents.map((event, index) => (
          <FeaturedCard
            key={event.id}
            isLast={index === displayEvents.length - 1}
          >
            {/* Placeholder Image */}
            <ImageContainer>
              <PlaceholderImage>
                <Ionicons name="image-outline" size={48} color="#40ffdc" />
                <PlaceholderText>Featured Poster</PlaceholderText>
              </PlaceholderImage>
            </ImageContainer>
          </FeaturedCard>
        ))}
      </Carousel>
      {/* Pagination Indicators */}
      {displayEvents.length > 1 && (
        <Pagination>
          {displayEvents.map((_, index) => (
            <PaginationDot
              key={index}
              isActive={index === currentIndex}
              isLast={index === displayEvents.length - 1}
              onPress={() => scrollToIndex(index)}
            />
          ))}
        </Pagination>
      )}
    </Container>
  );
});

FeaturedSection.displayName = 'FeaturedSection';

export default FeaturedSection;

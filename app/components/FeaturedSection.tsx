import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeaturedEvent {
  id: string;
  image?: string;
}

interface FeaturedSectionProps {
  events?: FeaturedEvent[];
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH = SCREEN_WIDTH - (HORIZONTAL_PADDING * 2); // Full width minus padding

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ events }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample featured events - replace with real data from your API/state
  const defaultEvents: FeaturedEvent[] = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];

  const displayEvents = events || defaultEvents;

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const cardWidthWithSpacing = CARD_WIDTH + HORIZONTAL_PADDING;
    const index = Math.round(scrollPosition / cardWidthWithSpacing);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    const cardWidthWithSpacing = CARD_WIDTH + HORIZONTAL_PADDING;
    scrollViewRef.current?.scrollTo({
      x: index * cardWidthWithSpacing,
      animated: true,
    });
  };

  return (
    <View style={[styles.container, { zIndex: 10, elevation: 10 }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.verticalBar} />
          <Text style={styles.sectionTitle}>FEATURED</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
        contentContainerStyle={styles.carouselContent}
        snapToInterval={CARD_WIDTH + HORIZONTAL_PADDING}
        snapToAlignment="start"
        decelerationRate="fast"
      >
        {displayEvents.map((event, index) => (
          <TouchableOpacity 
            key={event.id} 
            style={[
              styles.featuredCard,
              index === displayEvents.length - 1 && styles.lastCard
            ]}
          >
            {/* Placeholder Image */}
            <View style={styles.imageContainer}>
              <View style={styles.placeholderImage}>
                <Ionicons name="image-outline" size={48} color="#40ffdc" />
                <Text style={styles.placeholderText}>Featured Poster</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination Indicators */}
      {displayEvents.length > 1 && (
        <View style={styles.pagination}>
          {displayEvents.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                index === currentIndex && styles.paginationDotActive,
                index < displayEvents.length - 1 && { marginRight: 8 },
              ]}
              onPress={() => scrollToIndex(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: HORIZONTAL_PADDING,
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalBar: {
    width: 4,
    height: 24,
    backgroundColor: '#40ffdc',
    marginRight: 12,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  carousel: {
    marginBottom: 16,
  },
  carouselContent: {
    paddingLeft: HORIZONTAL_PADDING,
    paddingRight: HORIZONTAL_PADDING,
  },
  featuredCard: {
    width: CARD_WIDTH,
    backgroundColor: '#12042b',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: HORIZONTAL_PADDING,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    zIndex: 10,
    elevation: 10,
  },
  lastCard: {
    marginRight: HORIZONTAL_PADDING,
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#40ffdc',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    marginTop: 4,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  paginationDotActive: {
    backgroundColor: '#40ffdc',
    width: 24,
  },
});

export default FeaturedSection;


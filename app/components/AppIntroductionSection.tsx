import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppIntroductionSection: React.FC = () => {
  const features = [
    {
      icon: 'ticket',
      title: 'Raffle Events',
      description: 'Join limited-slot raffles for a chance to win exclusive collectibles and prizes.',
    },
    {
      icon: 'cube',
      title: 'Virtual Pack Opening',
      description: 'Open real TCG packs digitally and claim physical cards that get shipped to you.',
    },
    {
      icon: 'gift',
      title: 'Mystery Boxes',
      description: 'Discover themed mystery boxes with guaranteed hits and surprise cards.',
    },
    {
      icon: 'game-controller',
      title: 'Minigames',
      description: 'Play interactive games to win high-end cards, mystery packs, or raffle entries.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={styles.verticalBar} />
          <Text style={styles.sectionTitle}>WELCOME TO DROPS TCG</Text>
        </View>
      </View>

      <View style={styles.introCard}>
        <Text style={styles.introText}>
          Experience the thrill of trading card games in a whole new way. Collect rare cards, 
          join exciting raffles, and discover amazing prizes—all in one place.
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={styles.featureIconContainer}>
              <Ionicons name={feature.icon as any} size={28} color="#40ffdc" />
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerCard}>
        <Ionicons name="diamond" size={24} color="#40ffdc" />
        <Text style={styles.footerText}>
          Start your collecting journey today with Drops TCG
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 24,
    position: 'relative',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
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
  introCard: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  introText: {
    fontSize: 15,
    color: '#ffffff',
    lineHeight: 24,
    opacity: 0.9,
    textAlign: 'center',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: '#12042b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 13,
    color: '#ffffff',
    opacity: 0.7,
    lineHeight: 20,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  footerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#40ffdc',
    marginLeft: 12,
    flex: 1,
  },
});

export default AppIntroductionSection;


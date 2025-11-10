import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  // Default to "Player" if no username provided
  const displayName = userName || 'Player';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="sparkles" size={24} color="#40ffdc" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>
            Welcome back, <Text style={styles.nameText}>{displayName}</Text>!
          </Text>
          <Text style={styles.subtitleText}>
            Ready to discover your next rare pull?
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  nameText: {
    color: '#40ffdc',
    fontWeight: '700',
  },
  subtitleText: {
    fontSize: 13,
    color: '#ffffff',
    opacity: 0.7,
  },
});

export default WelcomeSection;


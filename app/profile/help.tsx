import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HelpOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

export default function Help() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const helpOptions: HelpOption[] = [
    {
      id: 'contact',
      title: 'Contact Support',
      description: 'Get in touch with our support team',
      icon: 'mail-outline',
      action: () => {
        Linking.openURL('mailto:support@dropstcg.com');
      },
    },
    {
      id: 'live-chat',
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      icon: 'chatbubbles-outline',
      action: () => {
        // TODO: Open live chat
        console.log('Open live chat');
      },
    },
    {
      id: 'faq',
      title: 'FAQ',
      description: 'Browse frequently asked questions',
      icon: 'help-circle-outline',
      action: () => {
        router.push('/profile/faq');
      },
    },
    {
      id: 'tutorial',
      title: 'Tutorials',
      description: 'Learn how to use the app',
      icon: 'school-outline',
      action: () => {
        // TODO: Open tutorials
        console.log('Open tutorials');
      },
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help and Support</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.introText}>
          We're here to help! Choose an option below to get support.
        </Text>

        {helpOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.helpCard}
            onPress={option.action}
            activeOpacity={0.7}
          >
            <View style={styles.helpCardLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name={option.icon as any} size={28} color="#40ffdc" />
              </View>
              <View style={styles.helpCardInfo}>
                <Text style={styles.helpCardTitle}>{option.title}</Text>
                <Text style={styles.helpCardDescription}>{option.description}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>
        ))}

        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Contact Information</Text>
          <View style={styles.contactRow}>
            <Ionicons name="mail" size={20} color="#40ffdc" />
            <Text style={styles.contactText}>support@dropstcg.com</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="call" size={20} color="#40ffdc" />
            <Text style={styles.contactText}>+60 12-345-6789</Text>
          </View>
          <View style={styles.contactRow}>
            <Ionicons name="time" size={20} color="#40ffdc" />
            <Text style={styles.contactText}>Mon-Fri: 9AM - 6PM (MYT)</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0019',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#12042b',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  introText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  helpCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1a0a3a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  helpCardInfo: {
    flex: 1,
  },
  helpCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  helpCardDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  contactInfo: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginLeft: 12,
  },
});


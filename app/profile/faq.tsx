import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I purchase tokens?',
    answer: 'You can purchase tokens by going to the Reload tab and selecting your desired amount. Tokens can be purchased using various payment methods.',
  },
  {
    id: '2',
    question: 'How do raffles work?',
    answer: 'Raffles allow you to purchase slots for a chance to win prizes. Once all slots are filled, winners are randomly selected. All non-winners receive a consolation prize in tokens.',
  },
  {
    id: '3',
    question: 'What are Gem Drops?',
    answer: 'Gem Drops are themed mystery boxes with varying rarity levels. Each gem drop has a specific card tier range and limited availability.',
  },
  {
    id: '4',
    question: 'How do I ship my cards?',
    answer: 'Go to your Vault, select the cards you want to ship, and click the Ship button. Make sure your address is up to date in the Address section.',
  },
  {
    id: '5',
    question: 'Can I refund cards?',
    answer: 'Yes, you can refund cards from your Vault. Refunded cards will be removed from your collection and tokens will be returned to your balance.',
  },
  {
    id: '6',
    question: 'What are the card tiers?',
    answer: 'Cards are ranked from D (lowest) to SSS (highest). Higher tier cards have more value and are rarer to obtain.',
  },
];

export default function FAQ() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.introText}>
          Frequently Asked Questions
        </Text>

        {faqData.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          return (
            <View key={item.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleItem(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#40ffdc"
                />
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          );
        })}
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
  },
  faqCard: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 255, 220, 0.1)',
  },
  answerText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 22,
    marginTop: 12,
  },
});


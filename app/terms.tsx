import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Terms() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using DropsTCG, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.',
    },
    {
      title: 'Account Registration',
      content: 'You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
    },
    {
      title: 'Use of Service',
      content: 'You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to use the service in any way that could damage, disable, overburden, or impair our servers or networks.',
    },
    {
      title: 'Purchases and Payments',
      content: 'All purchases are final. Tokens purchased are non-refundable except as required by law. Prices are subject to change without notice. We reserve the right to refuse or cancel any order at our discretion.',
    },
    {
      title: 'Virtual Items and Cards',
      content: 'Virtual items, cards, and tokens purchased or obtained through our platform are digital assets. Physical cards will be shipped according to our shipping policy. We are not responsible for lost or damaged shipments once they leave our facility.',
    },
    {
      title: 'Raffles and Contests',
      content: 'Participation in raffles is subject to availability. Winners are selected randomly. All decisions are final. Non-winners will receive consolation prizes as specified in each raffle.',
    },
    {
      title: 'Intellectual Property',
      content: 'All content, features, and functionality of our platform are owned by DropsTCG and are protected by international copyright, trademark, and other intellectual property laws.',
    },
    {
      title: 'Limitation of Liability',
      content: 'To the maximum extent permitted by law, DropsTCG shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.',
    },
    {
      title: 'Termination',
      content: 'We reserve the right to terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.',
    },
    {
      title: 'Changes to Terms',
      content: 'We reserve the right to modify these Terms at any time. We will notify users of any material changes. Your continued use of the service after such modifications constitutes acceptance of the updated Terms.',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: January 2024</Text>

        <Text style={styles.introText}>
          Please read these Terms and Conditions carefully before using DropsTCG. By using our service, you agree to be bound by these terms.
        </Text>

        {sections.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Questions?</Text>
          <Text style={styles.contactText}>
            If you have any questions about these Terms, please contact us at:
          </Text>
          <Text style={styles.contactEmail}>legal@dropstcg.com</Text>
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
  lastUpdated: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.6,
    marginBottom: 16,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#40ffdc',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 22,
  },
  contactSection: {
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
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.8,
    lineHeight: 22,
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#40ffdc',
  },
});


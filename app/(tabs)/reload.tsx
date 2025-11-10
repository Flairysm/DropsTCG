import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Token conversion: RM1 = 20 tokens
const TOKENS_PER_RM = 20;

const QUICK_AMOUNTS = [
  { rm: 10, tokens: 10 * TOKENS_PER_RM },
  { rm: 20, tokens: 20 * TOKENS_PER_RM },
  { rm: 50, tokens: 50 * TOKENS_PER_RM },
  { rm: 100, tokens: 100 * TOKENS_PER_RM },
  { rm: 200, tokens: 200 * TOKENS_PER_RM },
  { rm: 500, tokens: 500 * TOKENS_PER_RM },
];

export default function Reload() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [currentTokens, setCurrentTokens] = useState(0); // Replace with actual user token balance

  const handleQuickSelect = (rm: number) => {
    setSelectedAmount(rm);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (text: string) => {
    // Only allow numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return; // Only one decimal point allowed
    
    setCustomAmount(cleaned);
    setSelectedAmount(null);
  };

  const getSelectedRM = (): number => {
    if (selectedAmount !== null) {
      return selectedAmount;
    }
    if (customAmount && !isNaN(parseFloat(customAmount))) {
      return parseFloat(customAmount);
    }
    return 0;
  };

  const getTotalTokens = (): number => {
    const rm = getSelectedRM();
    return Math.floor(rm * TOKENS_PER_RM);
  };

  const handleReload = () => {
    const rm = getSelectedRM();
    const tokens = getTotalTokens();
    
    if (rm <= 0) {
      // Show error - no amount selected
      return;
    }

    // TODO: Implement payment processing
    console.log(`Reloading ${tokens} tokens for RM${rm}`);
    // After successful payment, update token balance
  };

  const selectedRM = getSelectedRM();
  const totalTokens = getTotalTokens();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons name="diamond" size={24} color="#40ffdc" style={styles.titleIcon} />
              <Text style={styles.title}>RELOAD TOKENS</Text>
            </View>
            <Text style={styles.subtitle}>
              PURCHASE TOKENS TO PARTICIPATE IN RAFFLES, OPEN PACKS, AND MORE
            </Text>
          </View>

          {/* Current Balance */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Your Token Balance</Text>
            <View style={styles.balanceAmount}>
              <Ionicons name="diamond" size={24} color="#40ffdc" />
              <Text style={styles.balanceText}>
                {currentTokens.toLocaleString()} tokens
              </Text>
            </View>
          </View>

          {/* Conversion Rate */}
          <View style={styles.conversionCard}>
            <Ionicons name="information-circle-outline" size={20} color="#40ffdc" />
            <Text style={styles.conversionText}>
              RM1 = {TOKENS_PER_RM} tokens
            </Text>
          </View>

          {/* Quick Select Amounts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Select</Text>
            <View style={styles.quickSelectGrid}>
              {QUICK_AMOUNTS.map((option) => (
                <TouchableOpacity
                  key={option.rm}
                  style={[
                    styles.quickSelectButton,
                    selectedAmount === option.rm && styles.quickSelectButtonActive
                  ]}
                  onPress={() => handleQuickSelect(option.rm)}
                >
                  <Text
                    style={[
                      styles.quickSelectRM,
                      selectedAmount === option.rm && styles.quickSelectRMActive
                    ]}
                  >
                    RM{option.rm}
                  </Text>
                  <Text
                    style={[
                      styles.quickSelectTokens,
                      selectedAmount === option.rm && styles.quickSelectTokensActive
                    ]}
                  >
                    {option.tokens.toLocaleString()} tokens
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Amount */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Amount</Text>
            <View style={styles.customAmountContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>RM</Text>
                <TextInput
                  style={styles.customInput}
                  placeholder="Enter amount"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={customAmount}
                  onChangeText={handleCustomAmountChange}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
              </View>
              {customAmount && !isNaN(parseFloat(customAmount)) && parseFloat(customAmount) > 0 && (
                <View style={styles.customAmountPreview}>
                  <Text style={styles.customAmountText}>
                    = {Math.floor(parseFloat(customAmount) * TOKENS_PER_RM).toLocaleString()} tokens
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Summary */}
          {selectedRM > 0 && (
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount</Text>
                <Text style={styles.summaryValue}>RM{selectedRM.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>You'll Receive</Text>
                <View style={styles.summaryTokens}>
                  <Ionicons name="diamond" size={18} color="#40ffdc" />
                  <Text style={styles.summaryTokensText}>
                    {totalTokens.toLocaleString()} tokens
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Reload Button */}
          <TouchableOpacity
            style={[
              styles.reloadButton,
              selectedRM <= 0 && styles.reloadButtonDisabled
            ]}
            onPress={handleReload}
            disabled={selectedRM <= 0}
            activeOpacity={0.8}
          >
            <Text style={styles.reloadButtonText}>Reload</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0019',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
    lineHeight: 20,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  balanceCard: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 8,
  },
  conversionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12042b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.1)',
  },
  conversionText: {
    fontSize: 13,
    color: '#40ffdc',
    marginLeft: 8,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  quickSelectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickSelectButton: {
    width: '48%',
    backgroundColor: '#12042b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    alignItems: 'center',
  },
  quickSelectButtonActive: {
    backgroundColor: '#1a0a3a',
    borderColor: '#40ffdc',
    borderWidth: 2,
  },
  quickSelectRM: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  quickSelectRMActive: {
    color: '#40ffdc',
  },
  quickSelectTokens: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.6,
  },
  quickSelectTokensActive: {
    color: '#40ffdc',
    opacity: 1,
  },
  customAmountContainer: {
    backgroundColor: '#12042b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#40ffdc',
    marginRight: 12,
  },
  customInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1a0a3a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.1)',
  },
  customAmountPreview: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 255, 220, 0.1)',
  },
  customAmountText: {
    fontSize: 14,
    color: '#40ffdc',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.3)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  summaryTokens: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTokensText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#40ffdc',
    marginLeft: 6,
  },
  reloadButton: {
    backgroundColor: '#40ffdc',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  reloadButtonDisabled: {
    backgroundColor: 'rgba(64, 255, 220, 0.3)',
  },
  reloadButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0a0019',
  },
});

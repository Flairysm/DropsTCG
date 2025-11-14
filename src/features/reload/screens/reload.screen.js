import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ScrollView as RNScrollView,
  StatusBar as RNStatusBar,
  Platform,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../services/authentication/authentication.context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { userProfilesApi } from '../../../services/api/api.service';
import { toast } from '../../../components/Toast';
import { logger } from '../../../utils/logger';
import { InlineLoader, OverlayLoader, ButtonLoader } from '../../../components/LoadingIndicator';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  z-index: 10;
  elevation: 10;
`;

const KeyboardView = styled(KeyboardAvoidingView).attrs({
  behavior: Platform.OS === 'ios' ? 'padding' : 'height',
})`
  flex: 1;
`;

const StyledScrollView = styled(RNScrollView)`
  flex: 1;
  z-index: 10;
  elevation: 10;
`;

const ScrollContent = styled.View`
  padding: 20px;
  padding-bottom: 40px;
`;

const Header = styled.View`
  margin-bottom: 24px;
  align-items: center;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  letter-spacing: 1px;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.5px;
`;

const BalanceCard = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
`;

const BalanceLabel = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BalanceAmount = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BalanceText = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
  margin-left: 8px;
`;

const ConversionCard = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 24px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const ConversionText = styled.Text`
  font-size: 13px;
  color: ${(props) => props.theme.colors.accent};
  margin-left: 8px;
  font-weight: 600;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 12px;
`;

const QuickSelectGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const QuickSelectButton = styled(TouchableOpacity)`
  width: 48%;
  background-color: ${(props) =>
    props.active ? props.theme.colors.tertiary : props.theme.colors.secondary};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-width: 2px;
  border-color: ${(props) =>
    props.active ? props.theme.colors.accent : props.theme.colors.border};
  align-items: center;
`;

const QuickSelectRM = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => (props.active ? props.theme.colors.accent : props.theme.colors.text)};
  margin-bottom: 4px;
`;

const QuickSelectTokens = styled.Text`
  font-size: 12px;
  color: ${(props) => (props.active ? props.theme.colors.accent : props.theme.colors.text)};
  opacity: ${(props) => (props.active ? 1 : 0.6)};
`;

const CustomAmountContainer = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 12px;
  padding: 16px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const InputLabel = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
  margin-right: 12px;
`;

const CustomInput = styled(TextInput)`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  padding-vertical: 12px;
  padding-horizontal: 16px;
  background-color: ${(props) => props.theme.colors.tertiary};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const CustomAmountPreview = styled.View`
  margin-top: 12px;
  padding-top: 12px;
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.borderLight};
`;

const CustomAmountText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.accent};
  font-weight: 600;
`;

const SummaryCard = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border-width: 1px;
  border-color: rgba(64, 255, 220, 0.3);
`;

const SummaryRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SummaryLabel = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
`;

const SummaryValue = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const SummaryTokens = styled.View`
  flex-direction: row;
  align-items: center;
`;

const SummaryTokensText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
  margin-left: 6px;
`;

const ReloadButton = styled(TouchableOpacity)`
  background-color: ${(props) =>
    props.disabled ? 'rgba(64, 255, 220, 0.3)' : props.theme.colors.accent};
  border-radius: 16px;
  padding: 20px;
  align-items: center;
  margin-top: 8px;
`;

const ReloadButtonText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

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

export default function ReloadScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [currentTokens, setCurrentTokens] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);

  // Redirect to login if not authenticated
  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('Account', { screen: 'Login' });
        } else {
          navigation.navigate('Account', { screen: 'Login' });
        }
      }
    }, [isAuthenticated, navigation])
  );

  // Fetch current token balance using API service
  const fetchTokenBalance = useCallback(async () => {
    if (!user?.id) return;

    setIsFetchingBalance(true);
    try {
      const result = await userProfilesApi.getById(user.id);

      if (result.success && result.data) {
        setCurrentTokens(result.data.token_balance || 0);
      } else {
        setCurrentTokens(user.tokenBalance || 0);
      }
    } catch (err) {
      logger.warn('Could not fetch token balance', err);
      setCurrentTokens(user.tokenBalance || 0);
    } finally {
      setIsFetchingBalance(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setCurrentTokens(user.tokenBalance || 0);
      fetchTokenBalance();
    }
  }, [user, fetchTokenBalance]);

  // Refresh token balance when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTokenBalance();
    }, [fetchTokenBalance])
  );

  const handleQuickSelect = useCallback((rm) => {
    setSelectedAmount(rm);
    setCustomAmount('');
  }, []);

  const handleCustomAmountChange = useCallback((text) => {
    // Only allow numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) return; // Only one decimal point allowed

    setCustomAmount(cleaned);
    setSelectedAmount(null);
  }, []);

  const selectedRM = useMemo(() => {
    if (selectedAmount !== null) {
      return selectedAmount;
    }
    if (customAmount && !isNaN(parseFloat(customAmount))) {
      return parseFloat(customAmount);
    }
    return 0;
  }, [selectedAmount, customAmount]);

  const totalTokens = useMemo(() => {
    return Math.floor(selectedRM * TOKENS_PER_RM);
  }, [selectedRM]);

  const handleReload = useCallback(async () => {
    if (selectedRM <= 0) {
      toast.error('Please select an amount to reload');
      return;
    }

    if (!user?.id) {
      logger.warn('User not authenticated for reload');
      return;
    }

    setIsReloading(true);
    try {
      // TODO: Implement payment processing
      // For now, simulate adding tokens to balance
      const tokensToAdd = totalTokens;
      
      // Update token balance using API service
      const result = await userProfilesApi.updateTokenBalance(user.id, tokensToAdd);

      if (result.success) {
        // Refresh token balance
        await fetchTokenBalance();
        // Reset form
        setSelectedAmount(null);
        setCustomAmount('');
        // Show success message
        toast.success(`Successfully reloaded ${totalTokens.toLocaleString()} tokens!`);
      } else {
        logger.error('Error updating token balance', result.error);
        toast.error('Failed to reload tokens. Please try again.');
      }
    } catch (error) {
      logger.error('Error processing reload', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsReloading(false);
    }
  }, [selectedRM, totalTokens, user, fetchTokenBalance]);

  return (
    <Container edges={['left', 'right']}>
      {/* Expo StatusBar for iOS */}
      <StatusBar style="light" />
      {/* React Native StatusBar for Android */}
      {Platform.OS === 'android' && (
        <RNStatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.primary}
          translucent={false}
        />
      )}

      <KeyboardView>
        <StyledScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="never"
        >
          <ScrollContent>
            {/* Header */}
            <Header>
              <TitleContainer>
                <Ionicons name="diamond" size={24} color={theme.colors.accent} style={{ marginRight: 8 }} />
                <Title>RELOAD TOKENS</Title>
              </TitleContainer>
              <Subtitle>
                PURCHASE TOKENS TO PARTICIPATE IN RAFFLES, OPEN PACKS, AND MORE
              </Subtitle>
            </Header>

            {/* Current Balance */}
            <BalanceCard>
              <BalanceLabel>Your Token Balance</BalanceLabel>
              <BalanceAmount>
                <Ionicons name="diamond" size={24} color={theme.colors.accent} />
                <BalanceText>{currentTokens.toLocaleString()} tokens</BalanceText>
              </BalanceAmount>
            </BalanceCard>

            {/* Conversion Rate */}
            <ConversionCard>
              <Ionicons name="information-circle-outline" size={20} color={theme.colors.accent} />
              <ConversionText>RM1 = {TOKENS_PER_RM} tokens</ConversionText>
            </ConversionCard>

            {/* Quick Select Amounts */}
            <Section>
              <SectionTitle>Quick Select</SectionTitle>
              <QuickSelectGrid>
                {QUICK_AMOUNTS.map((option) => (
                  <QuickSelectButton
                    key={option.rm}
                    active={selectedAmount === option.rm}
                    onPress={() => handleQuickSelect(option.rm)}
                    activeOpacity={0.7}
                  >
                    <QuickSelectRM active={selectedAmount === option.rm}>
                      RM{option.rm}
                    </QuickSelectRM>
                    <QuickSelectTokens active={selectedAmount === option.rm}>
                      {option.tokens.toLocaleString()} tokens
                    </QuickSelectTokens>
                  </QuickSelectButton>
                ))}
              </QuickSelectGrid>
            </Section>

            {/* Custom Amount */}
            <Section>
              <SectionTitle>Custom Amount</SectionTitle>
              <CustomAmountContainer>
                <InputWrapper>
                  <InputLabel>RM</InputLabel>
                  <CustomInput
                    placeholder="Enter amount"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    value={customAmount}
                    onChangeText={handleCustomAmountChange}
                    keyboardType="decimal-pad"
                    returnKeyType="done"
                  />
                </InputWrapper>
                {customAmount &&
                  !isNaN(parseFloat(customAmount)) &&
                  parseFloat(customAmount) > 0 && (
                    <CustomAmountPreview>
                      <CustomAmountText>
                        = {Math.floor(parseFloat(customAmount) * TOKENS_PER_RM).toLocaleString()}{' '}
                        tokens
                      </CustomAmountText>
                    </CustomAmountPreview>
                  )}
              </CustomAmountContainer>
            </Section>

            {/* Summary */}
            {selectedRM > 0 && (
              <SummaryCard>
                <SummaryRow>
                  <SummaryLabel>Amount</SummaryLabel>
                  <SummaryValue>RM{selectedRM.toFixed(2)}</SummaryValue>
                </SummaryRow>
                <SummaryRow>
                  <SummaryLabel>You'll Receive</SummaryLabel>
                  <SummaryTokens>
                    <Ionicons name="diamond" size={18} color={theme.colors.accent} />
                    <SummaryTokensText>{totalTokens.toLocaleString()} tokens</SummaryTokensText>
                  </SummaryTokens>
                </SummaryRow>
              </SummaryCard>
            )}

            {/* Reload Button */}
            <ReloadButton
              disabled={selectedRM <= 0 || isReloading}
              onPress={handleReload}
              activeOpacity={0.8}
            >
              {isReloading ? (
                <>
                  <ButtonLoader color="#0a0019" />
                  <ReloadButtonText>Processing...</ReloadButtonText>
                </>
              ) : (
                <ReloadButtonText>Reload</ReloadButtonText>
              )}
            </ReloadButton>
          </ScrollContent>
        </StyledScrollView>
      </KeyboardView>
      <OverlayLoader visible={isReloading} message="Processing your reload..." />
      {isFetchingBalance && (
        <View style={{ position: 'absolute', top: 100, right: 20 }}>
          <InlineLoader size="small" />
        </View>
      )}
    </Container>
  );
}

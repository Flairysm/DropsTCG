import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useAuth } from '../../../services/authentication/authentication.context';

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
  min-height: 100%;
`;

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 32px;
`;

const LogoImage = styled.Image`
  height: 60px;
  width: 180px;
  resize-mode: contain;
  margin-bottom: 16px;
`;

const VerifyCard = styled.View`
  width: 100%;
  max-width: 400px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 20px;
  padding: 36px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  shadow-color: ${(props) => props.theme.colors.accent};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  elevation: 8;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 8px;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 32px;
  text-align: center;
  line-height: 20px;
`;

const EmailText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.accent};
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
`;

const OTPContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 32px;
  gap: 12px;
`;

const OTPInput = styled(TextInput)`
  flex: 1;
  height: 60px;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props) => (props.focused ? props.theme.colors.accent : props.theme.colors.border)};
  color: ${(props) => props.theme.colors.text};
  font-size: 24px;
  font-weight: 700;
  text-align: center;
`;

const VerifyButton = styled(TouchableOpacity)`
  background-color: ${(props) => (props.disabled ? 'rgba(255, 255, 255, 0.3)' : props.theme.colors.accent)};
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  margin-bottom: 20px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const VerifyButtonText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const ResendContainer = styled.View`
  align-items: center;
  margin-top: 20px;
`;

const ResendText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 8px;
`;

const ResendButton = styled(TouchableOpacity)`
  padding: 8px;
`;

const ResendButtonText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.accent};
`;

const ErrorText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.error || '#ff4444'};
  margin-bottom: 16px;
  text-align: center;
`;

const OTP_LENGTH = 6;

export default function VerifyOTPScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { verifyOTP, resendOTP, pendingVerificationEmail } = useAuth();
  
  // Get email from route params or from auth context
  const email = route.params?.email || pendingVerificationEmail || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  
  const inputRefs = useRef([]);

  const handleOTPChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.length === OTP_LENGTH) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (index, key) => {
    // Handle backspace
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode = null) => {
    const code = otpCode || otp.join('');
    
    if (code.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    if (!email) {
      setError('Email is required for verification');
      return;
    }

    setIsVerifying(true);
    setError('');

    console.log('Verifying OTP code for email:', email);

    try {
      const result = await verifyOTP(email, code);
      
      console.log('Verify OTP result:', result);
      
      if (result.success) {
        console.log('OTP verification successful, user should be authenticated now');
        // Navigation will automatically switch to main app via RootNavigator
        // after successful verification
      } else {
        setError(result.error || 'Invalid verification code. Please try again.');
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      console.error('Verify OTP exception:', err);
      setError('An unexpected error occurred. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError('');

    try {
      const result = await resendOTP(email);
      
      if (result.success) {
        // Start cooldown timer (60 seconds)
        setResendCooldown(60);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(result.error || 'Failed to resend code. Please try again.');
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Container>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollContainer
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          nestedScrollEnabled={false}
        >
          <Content>
            <LogoContainer>
              <LogoImage
                source={require('../../../../assets/drops-logo.png')}
                resizeMode="contain"
              />
            </LogoContainer>
            <VerifyCard>
              <Title>Verify Email</Title>
              <Subtitle>
                We've sent a 6-digit verification code to your email address
              </Subtitle>
              {email && (
                <EmailText>{email}</EmailText>
              )}

              {error ? <ErrorText>{error}</ErrorText> : null}

              <OTPContainer>
                {otp.map((digit, index) => (
                  <OTPInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    value={digit}
                    onChangeText={(value) => handleOTPChange(index, value)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    focused={digit !== ''}
                    editable={!isVerifying}
                  />
                ))}
              </OTPContainer>

              <VerifyButton
                onPress={() => handleVerify()}
                disabled={isVerifying || otp.some(digit => !digit)}
                activeOpacity={0.8}
              >
                {isVerifying ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <VerifyButtonText>Verify</VerifyButtonText>
                )}
              </VerifyButton>

              <ResendContainer>
                <ResendText>Didn't receive the code?</ResendText>
                <ResendButton
                  onPress={handleResend}
                  disabled={resendCooldown > 0 || isResending}
                  activeOpacity={0.7}
                >
                  <ResendButtonText>
                    {isResending
                      ? 'Sending...'
                      : resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : 'Resend Code'}
                  </ResendButtonText>
                </ResendButton>
              </ResendContainer>
            </VerifyCard>
          </Content>
        </ScrollContainer>
      </KeyboardAvoidingView>
    </Container>
  );
}


import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
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

const RegisterCard = styled.View`
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
  font-size: 32px;
  font-weight: 800;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 8px;
  text-align: center;
  letter-spacing: 0.5px;
`;

const Subtitle = styled.Text`
  font-size: 15px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-bottom: 32px;
  text-align: center;
  line-height: 22px;
`;

const InputContainer = styled.View`
  margin-bottom: 20px;
  pointer-events: auto;
`;

const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 12px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
  padding-horizontal: 4px;
`;

const InputIcon = styled.View`
  padding: 12px;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`;

const Input = styled.TextInput`
  flex: 1;
  padding: 16px 12px;
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  min-height: 50px;
`;

const ErrorText = styled.Text`
  color: ${(props) => props.theme.colors.error};
  font-size: 13px;
  margin-top: 8px;
  margin-left: 4px;
  font-weight: 500;
`;

const SuccessText = styled.Text`
  color: ${(props) => props.theme.colors.success};
  font-size: 13px;
  margin-top: 8px;
  margin-left: 4px;
  font-weight: 500;
  text-align: center;
`;

const PasswordRequirement = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.5;
  margin-top: 6px;
  margin-left: 4px;
  font-weight: 400;
`;

const RegisterButton = styled(TouchableOpacity)`
  background-color: ${(props) =>
    props.disabled ? 'rgba(64, 255, 220, 0.3)' : props.theme.colors.accent};
  border-radius: 12px;
  padding: 18px;
  align-items: center;
  margin-top: 8px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  shadow-color: ${(props) => props.disabled ? 'transparent' : props.theme.colors.accent};
  shadow-offset: 0px 4px;
  shadow-opacity: ${(props) => props.disabled ? 0 : 0.4};
  shadow-radius: 12px;
  elevation: ${(props) => props.disabled ? 0 : 6};
`;

const RegisterButtonText = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.5px;
`;

const Divider = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 24px;
`;

const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${(props) => props.theme.colors.borderLight};
`;

const DividerText = styled.Text`
  margin-horizontal: 16px;
  font-size: 13px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.5;
`;

const LoginLink = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

const LoginLinkText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
`;

const LoginLinkButton = styled(TouchableOpacity)`
  margin-left: 4px;
  padding: 4px;
`;

const LoginLinkButtonText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.accent};
  font-weight: 700;
  letter-spacing: 0.3px;
`;

const RegisterScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { register, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const validateForm = () => {
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }

    if (!email.trim()) {
      setError('Email is required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }

    // Basic phone number validation (allows numbers, +, -, spaces, parentheses)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      setError('Please enter a valid phone number');
      return false;
    }

    // Check if phone number has at least 8 digits
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 8) {
      setError('Phone number must contain at least 8 digits');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);

    const result = await register(email.trim(), password, username.trim(), phoneNumber.trim());

    console.log('Register screen result:', result);

    if (result.success) {
      // If verification is required (which it should be with Supabase email confirmation)
      if (result.requiresVerification) {
        console.log('Registration requires verification, navigating to VerifyOTP screen');
        setIsRegistering(false);
        // Navigate to VerifyOTP screen
        // Use a small delay to ensure state updates are processed
        setTimeout(() => {
          console.log('Navigating to VerifyOTP with email:', email.trim());
          try {
            navigation.replace('VerifyOTP', { email: email.trim() });
          } catch (error) {
            console.error('Navigation error:', error);
            // Fallback: try navigate instead
            navigation.navigate('VerifyOTP', { email: email.trim() });
          }
        }, 50);
        return; // Exit early
      } else {
        // If no verification needed (shouldn't happen with email confirmation enabled)
        console.log('No verification required, redirecting to app');
        setSuccess('Registration successful! Redirecting...');
        // Navigation will automatically switch to main app via RootNavigator
      }
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
    
    setIsRegistering(false);
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
            <RegisterCard>
              <Title>Create Account</Title>
              <Subtitle>Sign up to start your DropsTCG journey</Subtitle>

              <InputContainer>
                <InputWrapper>
                  <InputIcon>
                    <Ionicons 
                      name="person-outline" 
                      size={20} 
                      color="rgba(255, 255, 255, 0.5)" 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Username *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect={false}
                  />
                </InputWrapper>
              </InputContainer>

              <InputContainer>
                <InputWrapper>
                  <InputIcon>
                    <Ionicons 
                      name="mail-outline" 
                      size={20} 
                      color="rgba(255, 255, 255, 0.5)" 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Email *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                  />
                </InputWrapper>
              </InputContainer>

              <InputContainer>
                <InputWrapper>
                  <InputIcon>
                    <Ionicons 
                      name="call-outline" 
                      size={20} 
                      color="rgba(255, 255, 255, 0.5)" 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Phone Number *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoComplete="tel"
                    autoCorrect={false}
                  />
                </InputWrapper>
              </InputContainer>

              <InputContainer>
                <InputWrapper>
                  <InputIcon>
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={20} 
                      color="rgba(255, 255, 255, 0.5)" 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Password *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                    autoCorrect={false}
                  />
                </InputWrapper>
              </InputContainer>

              <InputContainer>
                <InputWrapper>
                  <InputIcon>
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={20} 
                      color="rgba(255, 255, 255, 0.5)" 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Confirm Password *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password-new"
                    autoCorrect={false}
                  />
                </InputWrapper>
                {error ? <ErrorText>{error}</ErrorText> : null}
                {success ? <SuccessText>{success}</SuccessText> : null}
              </InputContainer>

              <RegisterButton onPress={handleRegister} disabled={isRegistering || isLoading} activeOpacity={0.8}>
                {isRegistering || isLoading ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <RegisterButtonText>Create Account</RegisterButtonText>
                )}
              </RegisterButton>

              <Divider>
                <DividerLine />
                <DividerText>OR</DividerText>
                <DividerLine />
              </Divider>

              <LoginLink>
                <LoginLinkText>Already have an account?</LoginLinkText>
                <LoginLinkButton onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                  <LoginLinkButtonText>Sign In</LoginLinkButtonText>
                </LoginLinkButton>
              </LoginLink>
            </RegisterCard>
        </Content>
      </ScrollContainer>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default RegisterScreen;


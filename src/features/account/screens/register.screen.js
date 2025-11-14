import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useAuth } from '../../../services/authentication/authentication.context';
import { logger } from '../../../utils/logger';

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

const PasswordToggle = styled(TouchableOpacity)`
  padding: 12px;
  justify-content: center;
  align-items: center;
`;

const ErrorText = styled.Text`
  color: ${(props) => props.theme.colors.error};
  font-size: 13px;
  margin-top: 8px;
  margin-left: 4px;
  font-weight: 500;
`;

const FieldError = styled.Text`
  color: ${(props) => props.theme.colors.error};
  font-size: 12px;
  margin-top: 6px;
  margin-left: 4px;
  font-weight: 400;
`;

const SuccessText = styled.Text`
  color: ${(props) => props.theme.colors.success || '#4ade80'};
  font-size: 13px;
  margin-top: 8px;
  margin-left: 4px;
  font-weight: 500;
  text-align: center;
`;

const PasswordMatchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 6px;
  margin-left: 4px;
`;

const PasswordMatchText = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.isMatch ? (props.theme.colors.success || '#4ade80') : 'rgba(255, 255, 255, 0.5)'};
  margin-left: 4px;
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Field-specific errors
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateUsername = (usernameValue) => {
    if (!usernameValue.trim()) {
      setUsernameError('Username is required');
      return false;
    }
    if (usernameValue.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validateEmail = (emailValue) => {
    if (!emailValue.trim()) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue.trim())) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = (phoneValue) => {
    if (!phoneValue.trim()) {
      setPhoneError('Phone number is required');
      return false;
    }
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phoneValue.trim())) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    const digitsOnly = phoneValue.replace(/\D/g, '');
    if (digitsOnly.length < 8) {
      setPhoneError('Phone number must contain at least 8 digits');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = (passwordValue) => {
    if (!passwordValue) {
      setPasswordError('Password is required');
      return false;
    }
    if (passwordValue.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPasswordValue, passwordValue) => {
    if (!confirmPasswordValue) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPasswordValue !== passwordValue) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleUsernameChange = (text) => {
    setUsername(text);
    setError('');
    if (text.trim()) {
      validateUsername(text);
    } else {
      setUsernameError('');
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setError('');
    if (text.trim()) {
      validateEmail(text);
    } else {
      setEmailError('');
    }
  };

  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    setError('');
    if (text.trim()) {
      validatePhone(text);
    } else {
      setPhoneError('');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setError('');
    if (text.trim()) {
      validatePassword(text);
      // Re-validate confirm password if it has a value
      if (confirmPassword) {
        validateConfirmPassword(confirmPassword, text);
      }
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setError('');
    if (text.trim()) {
      validateConfirmPassword(text, password);
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateForm = () => {
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phoneNumber);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);

    return isUsernameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid;
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);

    const result = await register(email.trim(), password, username.trim(), phoneNumber.trim());

    logger.debug('Register screen result', { requiresVerification: result.requiresVerification });

    if (result.success) {
      // If verification is required (which it should be with Supabase email confirmation)
      if (result.requiresVerification) {
        logger.debug('Registration requires verification, navigating to VerifyOTP screen');
        setIsRegistering(false);
        // Navigate to VerifyOTP screen
        // Use a small delay to ensure state updates are processed
        setTimeout(() => {
          logger.debug('Navigating to VerifyOTP', { email: email.trim() });
          try {
            navigation.replace('VerifyOTP', { email: email.trim() });
          } catch (error) {
            logger.error('Navigation error', error);
            // Fallback: try navigate instead
            navigation.navigate('VerifyOTP', { email: email.trim() });
          }
        }, 50);
        return; // Exit early
      } else {
        // If no verification needed (shouldn't happen with email confirmation enabled)
        logger.debug('No verification required, redirecting to app');
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
                <InputWrapper style={{ borderColor: usernameError ? theme.colors.error : theme.colors.borderLight }}>
                  <InputIcon>
                    <Ionicons 
                      name="person-outline" 
                      size={20} 
                      color={usernameError ? theme.colors.error : "rgba(255, 255, 255, 0.5)"} 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Username *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={username}
                    onChangeText={handleUsernameChange}
                    onBlur={() => validateUsername(username)}
                    autoCapitalize="none"
                    autoComplete="username"
                    autoCorrect={false}
                  />
                </InputWrapper>
                {usernameError ? <FieldError>{usernameError}</FieldError> : null}
              </InputContainer>

              <InputContainer>
                <InputWrapper style={{ borderColor: emailError ? theme.colors.error : theme.colors.borderLight }}>
                  <InputIcon>
                    <Ionicons 
                      name="mail-outline" 
                      size={20} 
                      color={emailError ? theme.colors.error : "rgba(255, 255, 255, 0.5)"} 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Email *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={email}
                    onChangeText={handleEmailChange}
                    onBlur={() => validateEmail(email)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                  />
                </InputWrapper>
                {emailError ? <FieldError>{emailError}</FieldError> : null}
              </InputContainer>

              <InputContainer>
                <InputWrapper style={{ borderColor: phoneError ? theme.colors.error : theme.colors.borderLight }}>
                  <InputIcon>
                    <Ionicons 
                      name="call-outline" 
                      size={20} 
                      color={phoneError ? theme.colors.error : "rgba(255, 255, 255, 0.5)"} 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Phone Number *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    onBlur={() => validatePhone(phoneNumber)}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoComplete="tel"
                    autoCorrect={false}
                  />
                </InputWrapper>
                {phoneError ? <FieldError>{phoneError}</FieldError> : null}
              </InputContainer>

              <InputContainer>
                <InputWrapper style={{ borderColor: passwordError ? theme.colors.error : theme.colors.borderLight }}>
                  <InputIcon>
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={20} 
                      color={passwordError ? theme.colors.error : "rgba(255, 255, 255, 0.5)"} 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Password *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={() => validatePassword(password)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    autoCorrect={false}
                  />
                  <PasswordToggle onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="rgba(255, 255, 255, 0.5)" 
                    />
                  </PasswordToggle>
                </InputWrapper>
                {passwordError ? <FieldError>{passwordError}</FieldError> : null}
                {password && !passwordError && password.length >= 6 ? (
                  <PasswordRequirement>✓ Password meets requirements</PasswordRequirement>
                ) : null}
              </InputContainer>

              <InputContainer>
                <InputWrapper style={{ borderColor: confirmPasswordError ? theme.colors.error : (confirmPassword && confirmPassword === password ? (theme.colors.success || '#4ade80') : theme.colors.borderLight) }}>
                  <InputIcon>
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={20} 
                      color={confirmPasswordError ? theme.colors.error : (confirmPassword && confirmPassword === password ? (theme.colors.success || '#4ade80') : "rgba(255, 255, 255, 0.5)")} 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Confirm Password *"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    onBlur={() => validateConfirmPassword(confirmPassword, password)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoComplete="password-new"
                    autoCorrect={false}
                  />
                  <PasswordToggle onPress={() => setShowConfirmPassword(!showConfirmPassword)} activeOpacity={0.7}>
                    <Ionicons 
                      name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="rgba(255, 255, 255, 0.5)" 
                    />
                  </PasswordToggle>
                </InputWrapper>
                {confirmPasswordError ? (
                  <FieldError>{confirmPasswordError}</FieldError>
                ) : confirmPassword && confirmPassword === password ? (
                  <PasswordMatchContainer>
                    <Ionicons name="checkmark-circle" size={14} color={theme.colors.success || '#4ade80'} />
                    <PasswordMatchText isMatch={true}>Passwords match</PasswordMatchText>
                  </PasswordMatchContainer>
                ) : null}
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



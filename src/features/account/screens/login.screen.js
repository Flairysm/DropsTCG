import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { toast } from '../../../components/Toast';
import { useAuth } from '../../../services/authentication/authentication.context';
import { validateEmail, validatePassword } from '../../../utils/validation';

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

const LoginCard = styled.View`
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

const LoginButton = styled(TouchableOpacity)`
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

const LoginButtonText = styled.Text`
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

const RegisterLink = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

const RegisterLinkText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
`;

const RegisterLinkButton = styled(TouchableOpacity)`
  margin-left: 4px;
  padding: 4px;
`;

const RegisterLinkButtonText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.accent};
  font-weight: 700;
  letter-spacing: 0.3px;
`;

const LoginScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const validateEmailField = (emailValue) => {
    const result = validateEmail(emailValue);
    if (!result.isValid) {
      setEmailError(result.error);
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePasswordField = (passwordValue) => {
    const result = validatePassword(passwordValue);
    if (!result.isValid) {
      setPasswordError(result.error);
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setError('');
    if (text.trim()) {
      validateEmailField(text);
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setError('');
    if (text.trim()) {
      validatePasswordField(text);
    } else {
      setPasswordError('');
    }
  };

  const handleLogin = async () => {
    setError('');
    const isEmailValid = validateEmailField(email);
    const isPasswordValid = validatePasswordField(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoggingIn(true);

    const result = await login(email.trim(), password);

    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
      setIsLoggingIn(false);
    } else {
      // Show success toast
      toast.success('Welcome back! You have successfully logged in.');
      // Navigation will automatically switch to main app via RootNavigator
    }
  };

  return (
    <Container>
      <StatusBar style="light" />
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
            <LoginCard>
              <Title>Welcome Back</Title>
              <Subtitle>Sign in to continue your DropsTCG journey</Subtitle>

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
                    placeholder="Email"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={email}
                    onChangeText={handleEmailChange}
                    onBlur={() => validateEmailField(email)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                  />
                </InputWrapper>
                {emailError ? <FieldError>{emailError}</FieldError> : null}
              </InputContainer>

              <InputContainer>
                <InputWrapper style={{ borderColor: (passwordError || error) ? theme.colors.error : theme.colors.borderLight }}>
                  <InputIcon>
                    <Ionicons 
                      name="lock-closed-outline" 
                      size={20} 
                      color={(passwordError || error) ? theme.colors.error : "rgba(255, 255, 255, 0.5)"} 
                    />
                  </InputIcon>
                  <Input
                    placeholder="Password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={password}
                    onChangeText={handlePasswordChange}
                    onBlur={() => validatePasswordField(password)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
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
                {error ? (
                  <ErrorText style={{ marginTop: passwordError ? 4 : 8 }}>
                    {error}
                  </ErrorText>
                ) : null}
              </InputContainer>

              <LoginButton onPress={handleLogin} disabled={isLoggingIn || isLoading} activeOpacity={0.8}>
                {isLoggingIn || isLoading ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <LoginButtonText>Sign In</LoginButtonText>
                )}
              </LoginButton>

              <Divider>
                <DividerLine />
                <DividerText>OR</DividerText>
                <DividerLine />
              </Divider>

              <RegisterLink>
                <RegisterLinkText>Don't have an account?</RegisterLinkText>
                <RegisterLinkButton onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
                  <RegisterLinkButtonText>Sign Up</RegisterLinkButtonText>
                </RegisterLinkButton>
              </RegisterLink>
            </LoginCard>
        </Content>
      </ScrollContainer>
    </Container>
  );
};

export default LoginScreen;


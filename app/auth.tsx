import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

type AuthMode = 'login' | 'signup';
type SignupStep = 'form' | 'verify';

export default function Auth() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<AuthMode>(
    (params.mode === 'signup' ? 'signup' : 'login') as AuthMode
  );
  const [signupStep, setSignupStep] = useState<SignupStep>('form');
  
  useEffect(() => {
    if (params.mode === 'signup') {
      setMode('signup');
    }
  }, [params.mode]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const sendEmailOTP = async () => {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Format phone number
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber.replace(/\s/g, '') 
        : `+${phoneNumber.replace(/\s/g, '')}`;

      // Send OTP to email using Supabase - use email OTP type
      // Note: We'll save username and phone_number to user_profiles table after OTP verification
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: undefined, // Don't use magic link
        },
      });

      if (error) throw error;

      setOtpSent(true);
      setSignupStep('verify');
      Alert.alert('Success', '6-digit OTP code sent to your email address!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send OTP. Please check your email address.');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailOTPAndSignup = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP code');
      return;
    }

    setLoading(true);

    try {
      // Format phone number
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber.replace(/\s/g, '') 
        : `+${phoneNumber.replace(/\s/g, '')}`;

      // Verify OTP - this will create/authenticate the user
      const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email',
      });

      if (otpError) throw otpError;

      // If OTP is verified, update user with password and create profile
      if (otpData.user) {
        const userId = otpData.user.id;

        // Update user with password
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        });

        if (updateError) throw updateError;

        // Create user profile in database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            username: username,
            phone_number: formattedPhone,
          });

        if (profileError) {
          // If profile insert fails, try updating instead (in case profile already exists)
          const { error: updateProfileError } = await supabase
            .from('user_profiles')
            .update({
              username: username,
              phone_number: formattedPhone,
            })
            .eq('id', userId);

          if (updateProfileError) throw updateProfileError;
        }

        // Success - session is now established
        // Wait for session to propagate, then navigate
        // Use multiple attempts with increasing delays to ensure navigation works
        const attemptNavigation = async (attempt = 0) => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              // Clear navigation stack and navigate to home
              router.dismissAll();
              setTimeout(() => {
                try {
                  router.replace('/(tabs)/index' as any);
                } catch {
                  router.push('/(tabs)/index' as any);
                }
              }, 100);
            } else if (attempt < 3) {
              // Retry up to 3 times with increasing delays
              setTimeout(() => attemptNavigation(attempt + 1), 300 * (attempt + 1));
            }
          } catch (error) {
            // If there's an error, clear stack and try navigation anyway
            router.dismissAll();
            setTimeout(() => {
              try {
                router.replace('/(tabs)/index' as any);
              } catch {
                router.push('/(tabs)/index' as any);
              }
            }, 100);
          }
        };
        
        // Start navigation attempt after a short delay
        setTimeout(() => attemptNavigation(), 300);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    if (mode === 'login') {
      if (!email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      setLoading(true);

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Navigate to home on successful login
        // Wait for session to propagate, then navigate
        const attemptLoginNavigation = async (attempt = 0) => {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              // Clear navigation stack and navigate to home
              router.dismissAll();
              setTimeout(() => {
                try {
                  router.replace('/(tabs)/index' as any);
                } catch {
                  router.push('/(tabs)/index' as any);
                }
              }, 100);
            } else if (attempt < 3) {
              setTimeout(() => attemptLoginNavigation(attempt + 1), 200 * (attempt + 1));
            }
          } catch (error) {
            router.dismissAll();
            setTimeout(() => {
              try {
                router.replace('/(tabs)/index' as any);
              } catch {
                router.push('/(tabs)/index' as any);
              }
            }, 100);
          }
        };
        
        setTimeout(() => attemptLoginNavigation(), 200);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    } else {
      // Signup flow - first validate form, then send email OTP
      if (signupStep === 'form') {
        // Form validation
        if (!email || !password || !confirmPassword || !phoneNumber || !username) {
          Alert.alert('Error', 'Please fill in all fields');
          return;
        }
        if (password !== confirmPassword) {
          Alert.alert('Error', 'Passwords do not match');
          return;
        }
        if (password.length < 6) {
          Alert.alert('Error', 'Password must be at least 6 characters');
          return;
        }
        if (username.length < 3) {
          Alert.alert('Error', 'Username must be at least 3 characters');
          return;
        }

        // Send email OTP
        await sendEmailOTP();
      } else {
        // Verify email OTP and complete signup
        await verifyEmailOTPAndSignup();
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo/Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/drops-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subtitle}>
            {mode === 'login' 
              ? 'Welcome back!' 
              : signupStep === 'verify' 
                ? 'Verify your email address' 
                : 'Create your account'}
          </Text>
        </View>

        {/* OTP Verification Screen (Signup only) */}
        {mode === 'signup' && signupStep === 'verify' ? (
          <View style={styles.form}>
            <View style={styles.otpInfo}>
              <Text style={styles.otpInfoText}>
                We sent a 6-digit code to
              </Text>
              <Text style={styles.otpPhoneNumber}>{email}</Text>
              <Text style={styles.otpInfoText}>
                Please enter the code below.
              </Text>
            </View>

            {/* OTP Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="keypad-outline" size={20} color="#40ffdc" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#ffffff40"
                value={otp}
                onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
                autoFocus
              />
            </View>

            {/* Resend OTP Button */}
            <TouchableOpacity
              onPress={sendEmailOTP}
              disabled={loading}
              style={styles.resendButton}
            >
              <Text style={styles.resendButtonText}>
                Resend Code
              </Text>
            </TouchableOpacity>

            {/* Verify Button */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0a0019" />
              ) : (
                <Text style={styles.submitButtonText}>Verify & Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity
              onPress={() => {
                setSignupStep('form');
                setOtp('');
                setOtpSent(false);
              }}
              disabled={loading}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={20} color="#40ffdc" style={styles.backButtonIcon} />
              <Text style={styles.backButtonText}>Change email address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Auth Form */
          <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#40ffdc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#ffffff40"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!loading}
            />
          </View>

          {/* Username Input (Signup only, form step) */}
          {mode === 'signup' && signupStep === 'form' && (
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#40ffdc" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#ffffff40"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
                editable={!loading}
              />
            </View>
          )}

          {/* Phone Number Input (Signup only, form step) */}
          {mode === 'signup' && signupStep === 'form' && (
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#40ffdc" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number (e.g., +60123456789)"
                placeholderTextColor="#ffffff40"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                autoComplete="tel"
                editable={!loading}
              />
            </View>
          )}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#40ffdc" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#ffffff40"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete={mode === 'login' ? 'password' : 'password-new'}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#ffffff60"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password (Signup only, form step) */}
          {mode === 'signup' && signupStep === 'form' && (
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#40ffdc" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#ffffff40"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#ffffff60"
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#0a0019" />
            ) : (
              <Text style={styles.submitButtonText}>
                {mode === 'login' ? 'Login' : signupStep === 'verify' ? 'Verify & Sign Up' : 'Proceed to verification'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Mode Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setPassword('');
                setConfirmPassword('');
                setPhoneNumber('');
                setUsername('');
                setOtp('');
                setSignupStep('form');
                setOtpSent(false);
              }}
              disabled={loading}
            >
              <Text style={styles.toggleLink}>
                {mode === 'login' ? 'Sign Up' : 'Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0019',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 200,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12042b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    paddingVertical: 14,
  },
  eyeIcon: {
    padding: 4,
  },
  submitButton: {
    backgroundColor: '#40ffdc',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0a0019',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  toggleLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#40ffdc',
  },
  otpInfo: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  otpInfoText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 8,
  },
  otpPhoneNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#40ffdc',
    marginBottom: 8,
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: '#40ffdc',
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  backButtonIcon: {
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 14,
    color: '#40ffdc',
    fontWeight: '600',
  },
});


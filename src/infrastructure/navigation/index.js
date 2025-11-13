import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../services/authentication/authentication.context';
import { AccountNavigator } from './account.navigator';
import { AppNavigator } from './app.navigator';

const Stack = createNativeStackNavigator();

// Root Navigator - conditionally shows Auth or App based on authentication
export const RootNavigator = () => {
  const { isAuthenticated, isLoading, pendingVerificationEmail } = useAuth();
  const navigationRef = useRef(null);
  const hasNavigatedToOTP = useRef(false);

  // Navigate to VerifyOTP when pendingVerificationEmail is set
  useEffect(() => {
    if (pendingVerificationEmail && navigationRef.current && !hasNavigatedToOTP.current) {
      console.log('RootNavigator - Navigating to VerifyOTP for:', pendingVerificationEmail);
      hasNavigatedToOTP.current = true;
      setTimeout(() => {
        try {
          navigationRef.current?.navigate('Account', {
            screen: 'VerifyOTP',
            params: { email: pendingVerificationEmail },
          });
        } catch (error) {
          console.error('RootNavigator navigation error:', error);
        }
      }, 100);
    } else if (!pendingVerificationEmail) {
      hasNavigatedToOTP.current = false;
    }
  }, [pendingVerificationEmail]);

  if (isLoading) {
    // Show loading screen while checking auth status
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0019' }}>
        <ActivityIndicator size="large" color="#40ffdc" />
      </View>
    );
  }

  console.log('RootNavigator - isAuthenticated:', isAuthenticated, 'pendingVerificationEmail:', pendingVerificationEmail);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <Stack.Screen 
            name="Account" 
            component={AccountNavigator}
            key={pendingVerificationEmail || 'default'} // Force remount when pendingVerificationEmail changes
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Export all navigators
export { AccountNavigator } from './account.navigator';
export { AdminNavigator } from './admin.navigator';
export { AppNavigator } from './app.navigator';
export { HomeNavigator } from './home.navigator';
export { PlayNavigator } from './play.navigator';
export { ProfileNavigator } from './profile.navigator';
export { ReloadNavigator } from './reload.navigator';
export { VaultNavigator } from './vault.navigator';


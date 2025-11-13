import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../../features/account/screens/login.screen';
import RegisterScreen from '../../features/account/screens/register.screen';
import VerifyOTPScreen from '../../features/account/screens/verify-otp.screen';
import { useAuth } from '../../services/authentication/authentication.context';

const Stack = createNativeStackNavigator();

export const AccountNavigator = () => {
  const { pendingVerificationEmail } = useAuth();
  
  // Determine initial route based on pending verification
  const initialRouteName = pendingVerificationEmail ? 'VerifyOTP' : 'Login';
  
  console.log('AccountNavigator - pendingVerificationEmail:', pendingVerificationEmail, 'initialRouteName:', initialRouteName);
  
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
    </Stack.Navigator>
  );
};


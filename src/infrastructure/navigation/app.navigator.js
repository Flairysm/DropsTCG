import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopNavbar from '../../components/TopNavbar';
import { useAuth } from '../../services/authentication/authentication.context';
import { AccountNavigator } from './account.navigator';
import { AdminNavigator } from './admin.navigator';
import { HomeNavigator } from './home.navigator';
import { PlayNavigator } from './play.navigator';
import { ProfileNavigator } from './profile.navigator';
import { ReloadNavigator } from './reload.navigator';
import { VaultNavigator } from './vault.navigator';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_COLORS = {
  active: '#40ffdc',
  inactive: '#ffffff',
  barBg: '#12042b',
};

const BottomTabNavigator = React.memo(() => {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom || 0;
  const { isAuthenticated } = useAuth();

  const screenOptions = React.useMemo(
    () => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarActiveTintColor: TAB_COLORS.active,
      tabBarInactiveTintColor: TAB_COLORS.inactive,
      tabBarStyle: {
        backgroundColor: TAB_COLORS.barBg,
        borderTopWidth: 0,
        height: 64 + bottomInset,
        paddingBottom: Math.max(bottomInset, 10),
        paddingTop: 6,
      },
      tabBarLabelStyle: {
        fontSize: 10,
        fontWeight: '400',
        letterSpacing: 0.3,
        marginTop: 2,
      },
      animationEnabled: true,
      detachInactiveScreens: false, // Keep screens mounted for smoother transitions
    }),
    [bottomInset]
  );

  // Memoize screen options to prevent re-renders
  const homeOptions = React.useMemo(
    () => ({
      headerShown: false,
      title: 'Home',
      tabBarIcon: ({ color, focused }) => (
        <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
      ),
      tabBarLabel: 'HOME',
    }),
    []
  );

  const reloadOptions = React.useMemo(
    () => ({
      headerShown: false,
      title: 'Reload',
      tabBarIcon: ({ color, focused }) => (
        <Ionicons name={focused ? 'refresh' : 'refresh-outline'} size={24} color={color} />
      ),
      tabBarLabel: 'RELOAD',
    }),
    []
  );

  const playOptions = React.useMemo(
    () => ({
      headerShown: false,
      title: 'Play',
      tabBarIcon: ({ color, focused }) => (
        <Ionicons
          name={focused ? 'game-controller' : 'game-controller-outline'}
          size={24}
          color={color}
        />
      ),
      tabBarLabel: 'PLAY',
    }),
    []
  );

  const vaultOptions = React.useMemo(
    () => ({
      headerShown: false,
      title: 'Vault',
      tabBarIcon: ({ color }) => <MaterialCommunityIcons name="safe" size={24} color={color} />,
      tabBarLabel: 'VAULT',
    }),
    []
  );

  const profileOptions = React.useMemo(
    () => ({
      headerShown: false,
      title: 'Profile',
      tabBarIcon: ({ color, focused }) => (
        <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
      ),
      tabBarLabel: 'PROFILE',
    }),
    []
  );

  // Protected screens that require authentication
  const protectedScreens = ['Reload', 'Play', 'Vault', 'Profile'];

  return (
    <View style={{ flex: 1 }}>
      <TopNavbar />
      <Tab.Navigator
        screenOptions={screenOptions}
        screenListeners={({ navigation, route }) => ({
          tabPress: (e) => {
            // Check if the screen requires authentication
            if (protectedScreens.includes(route.name) && !isAuthenticated) {
              // Prevent default navigation
              e.preventDefault();
              // Navigate to login via parent navigator
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('Account', { screen: 'Login' });
              } else {
                navigation.navigate('Account', { screen: 'Login' });
              }
            }
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeNavigator} options={homeOptions} />
        <Tab.Screen name="Reload" component={ReloadNavigator} options={reloadOptions} />
        <Tab.Screen name="Play" component={PlayNavigator} options={playOptions} />
        <Tab.Screen name="Vault" component={VaultNavigator} options={vaultOptions} />
        <Tab.Screen name="Profile" component={ProfileNavigator} options={profileOptions} />
      </Tab.Navigator>
    </View>
  );
});

BottomTabNavigator.displayName = 'BottomTabNavigator';

export const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Admin" component={AdminNavigator} />
      <Stack.Screen name="Account" component={AccountNavigator} />
    </Stack.Navigator>
  );
};


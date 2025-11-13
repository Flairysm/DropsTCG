import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TopNavbar from '../../components/TopNavbar';
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

  return (
    <View style={{ flex: 1 }}>
      <TopNavbar />
      <Tab.Navigator screenOptions={screenOptions}>
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
    <NavigationContainer
      independent={false}
      onReady={() => {
        // Navigation is ready
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="Admin" component={AdminNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import TopNavbar from './src/components/TopNavbar';
import HomeScreen from './src/features/home/screens/home.screen';
import PlayScreen from './src/features/play/screens/play.screen';
import ProfileScreen from './src/features/profile/screens/profile.screen';
import ReloadScreen from './src/features/reload/screens/reload.screen';
import VaultScreen from './src/features/vault/screens/vault.screen';
import { ThemeProvider } from './src/infrastructure/theme';

const Tab = createBottomTabNavigator();

const TAB_COLORS = {
  active: '#40ffdc',
  inactive: '#ffffff',
  barBg: '#12042b',
};

function BottomTabNavigator() {
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
        <Tab.Screen name="Home" component={HomeScreen} options={homeOptions} />
        <Tab.Screen name="Reload" component={ReloadScreen} options={reloadOptions} />
        <Tab.Screen name="Play" component={PlayScreen} options={playOptions} />
        <Tab.Screen name="Vault" component={VaultScreen} options={vaultOptions} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={profileOptions} />
      </Tab.Navigator>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer
          independent={false}
          onReady={() => {
            // Navigation is ready
          }}
        >
          <BottomTabNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

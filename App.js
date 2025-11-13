import React from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider } from './src/infrastructure/theme';
import TopNavbar from './src/components/TopNavbar';
import HomeScreen from './src/features/home/screens/home.screen';
import ReloadScreen from './src/features/reload/screens/reload.screen';
import PlayScreen from './src/features/play/screens/play.screen';
import VaultScreen from './src/features/vault/screens/vault.screen';
import ProfileScreen from './src/features/profile/screens/profile.screen';

const Tab = createBottomTabNavigator();

const TAB_COLORS = {
  active: '#40ffdc',
  inactive: '#ffffff',
  barBg: '#12042b',
};

function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom || 0;

  return (
    <View style={{ flex: 1 }}>
      <TopNavbar />
      <Tab.Navigator
        screenOptions={{
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
        }}
      >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
          tabBarLabel: 'HOME',
        }}
      />
      <Tab.Screen
        name="Reload"
        component={ReloadScreen}
        options={{
          headerShown: false,
          title: 'Reload',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'refresh' : 'refresh-outline'} size={24} color={color} />
          ),
          tabBarLabel: 'RELOAD',
        }}
      />
      <Tab.Screen
        name="Play"
        component={PlayScreen}
        options={{
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
        }}
      />
      <Tab.Screen
        name="Vault"
        component={VaultScreen}
        options={{
          headerShown: false,
          title: 'Vault',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons name="safe" size={24} color={color} />
          ),
          tabBarLabel: 'VAULT',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />
          ),
          tabBarLabel: 'PROFILE',
        }}
      />
      </Tab.Navigator>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

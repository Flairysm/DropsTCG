import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import EnergyMatchingScreen from '../../features/play/screens/energy-matching.screen';
import FindPikachuScreen from '../../features/play/screens/find-pikachu.screen';
import GemDropsScreen from '../../features/play/screens/gem-drops.screen';
import MysteryBoxDetailScreen from '../../features/play/screens/mystery-box-detail.screen';
import PlayScreen from '../../features/play/screens/play.screen';
import RaffleDetailScreen from '../../features/play/screens/raffle-detail.screen';
import VirtualBoosterPackDetailScreen from '../../features/play/screens/virtual-booster-pack-detail.screen';

const Stack = createNativeStackNavigator();

export const PlayNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="PlayMain" component={PlayScreen} />
      <Stack.Screen
        name="GemDrops"
        component={GemDropsScreen}
        options={{
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="MysteryBox"
        component={MysteryBoxDetailScreen}
        options={{
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="VirtualBoosterPack"
        component={VirtualBoosterPackDetailScreen}
        options={{
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="Raffle"
        component={RaffleDetailScreen}
        options={{
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="FindPikachu"
        component={FindPikachuScreen}
        options={{
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
      <Stack.Screen
        name="EnergyMatching"
        component={EnergyMatchingScreen}
        options={{
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </Stack.Navigator>
  );
};


import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  { name: 'Home', route: '/(tabs)/index', icon: 'home' },
  { name: 'Reload', route: '/(tabs)/reload', icon: 'refresh' },
  { name: 'Play', route: '/(tabs)/play', icon: 'game-controller' },
  { name: 'Vault', route: '/(tabs)/vault', icon: 'cube' },
  { name: 'Profile', route: '/(tabs)/profile', icon: 'person' },
];

const TopNavbar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  const toggleMenu = () => {
    if (isMenuOpen) {
      // Close menu
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Open menu
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigate = (route: string) => {
    router.push(route as any);
    toggleMenu();
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0],
  });

  return (
    <View style={[styles.container, { 
      paddingTop: insets.top + 8,
      paddingLeft: Math.max(insets.left, 16),
      paddingRight: Math.max(insets.right, 16),
    }]}>
      <Image
        source={require('../../assets/images/drops-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons 
          name={isMenuOpen ? 'close' : 'menu'} 
          size={28} 
          color="#ffffff" 
        />
      </TouchableOpacity>

      {isMenuOpen && (
        <Animated.View
          style={[
            styles.dropdown,
            {
              opacity: fadeAnim,
              transform: [{ translateY }],
              top: insets.top + 48,
            },
          ]}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast
              ]}
              onPress={() => handleNavigate(item.route)}
            >
              <Ionicons name={item.icon as any} size={20} color="#40ffdc" style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#12042b',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)', // Subtle accent color border
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    height: 28,
    width: 84,
  },
  menuButton: {
    padding: 4,
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#12042b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TopNavbar;


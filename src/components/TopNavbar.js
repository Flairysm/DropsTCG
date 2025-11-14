import React, { useState, useMemo, useCallback } from 'react';
import { Image, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import NotificationsPanel from './NotificationsPanel';
import { useAuth } from '../services/authentication/authentication.context';

const Container = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  padding-bottom: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
  z-index: 10;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const Logo = styled.Image`
  height: 28px;
  width: 84px;
`;

const RightButtons = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NotificationButton = styled(TouchableOpacity)`
  padding: 4px;
  position: relative;
  margin-right: 8px;
`;

const Badge = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${(props) => props.theme.colors.error};
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  justify-content: center;
  align-items: center;
  padding-horizontal: 4px;
`;

const BadgeText = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 10px;
  font-weight: 700;
`;

const MenuButton = styled(TouchableOpacity)`
  padding: 4px;
`;

const Dropdown = styled(Animated.View)`
  position: absolute;
  right: 0;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
`;

const MenuItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding-vertical: 14px;
  padding-horizontal: 16px;
  border-bottom-width: ${(props) => (props.isLast ? '0px' : '1px')};
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
`;

const MenuIcon = styled.View`
  margin-right: 12px;
`;

const MenuText = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  font-weight: 500;
`;

const AuthButtons = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LoginButton = styled(TouchableOpacity)`
  padding-horizontal: 16px;
  padding-vertical: 8px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.accent};
  margin-right: 12px;
`;

const LoginButtonText = styled.Text`
  color: ${(props) => props.theme.colors.accent};
  font-size: 14px;
  font-weight: 600;
`;

const RegisterButton = styled(TouchableOpacity)`
  padding-horizontal: 16px;
  padding-vertical: 8px;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.accent};
`;

const RegisterButtonText = styled.Text`
  color: ${(props) => props.theme.colors.primary};
  font-size: 14px;
  font-weight: 700;
`;

const menuItems = [
  { name: 'Home', route: 'Home', icon: 'home' },
  { name: 'Reload', route: 'Reload', icon: 'refresh' },
  { name: 'Play', route: 'Play', icon: 'game-controller' },
  { name: 'Vault', route: 'Vault', icon: 'cube' },
  { name: 'Profile', route: 'Profile', icon: 'person' },
  { name: 'Admin', route: 'Admin', icon: 'shield' },
];

const TopNavbar = React.memo(() => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isAuthenticated, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  // TODO: Replace with real state/API
  const unreadCount = 2;

  // Protected routes that require authentication
  const protectedRoutes = ['Reload', 'Play', 'Vault', 'Profile'];

  const toggleMenu = useCallback(() => {
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
  }, [isMenuOpen, slideAnim, fadeAnim]);

  const handleNavigate = useCallback(
    (route) => {
      // Check if route requires authentication
      if (protectedRoutes.includes(route) && !isAuthenticated) {
        // Navigate to login via parent navigator
        const parent = navigation.getParent();
        if (parent) {
          parent.navigate('Account', { screen: 'Login' });
        } else {
          navigation.navigate('Account', { screen: 'Login' });
        }
      } else {
        navigation.navigate(route);
      }
      toggleMenu();
    },
    [navigation, toggleMenu, isAuthenticated]
  );

  const translateY = useMemo(
    () =>
      slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 0],
      }),
    [slideAnim]
  );

  const containerStyle = useMemo(
    () => ({
      paddingTop: insets.top + 8,
      paddingLeft: Math.max(insets.left, 16),
      paddingRight: Math.max(insets.right, 16),
    }),
    [insets.top, insets.left, insets.right]
  );

  const dropdownStyle = useMemo(
    () => ({
      opacity: fadeAnim,
      transform: [{ translateY }],
      top: insets.top + 48,
    }),
    [fadeAnim, translateY, insets.top]
  );

  const handleNotificationOpen = useCallback(() => setIsNotificationsOpen(true), []);
  const handleNotificationClose = useCallback(() => setIsNotificationsOpen(false), []);

  return (
    <Container style={containerStyle}>
      <Logo
        source={require('../../assets/drops-logo.png')}
        resizeMode="contain"
      />

      <RightButtons>
        {isAuthenticated ? (
          <>
            <NotificationButton onPress={handleNotificationOpen}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
              {unreadCount > 0 && (
                <Badge>
                  <BadgeText>{unreadCount > 9 ? '9+' : unreadCount}</BadgeText>
                </Badge>
              )}
            </NotificationButton>
            <MenuButton onPress={toggleMenu}>
              <Ionicons
                name={isMenuOpen ? 'close' : 'menu'}
                size={28}
                color={theme.colors.text}
              />
            </MenuButton>
          </>
        ) : (
          <AuthButtons>
            <LoginButton onPress={() => navigation.navigate('Account', { screen: 'Login' })}>
              <LoginButtonText>Login</LoginButtonText>
            </LoginButton>
            <RegisterButton onPress={() => navigation.navigate('Account', { screen: 'Register' })}>
              <RegisterButtonText>Register</RegisterButtonText>
            </RegisterButton>
          </AuthButtons>
        )}
      </RightButtons>

      {isMenuOpen && isAuthenticated && (
        <Dropdown style={dropdownStyle}>
          {menuItems
            .filter((item) => {
              // Only show Admin menu item for admins
              if (item.name === 'Admin') {
                return isAdmin();
              }
              return true;
            })
            .map((item, index, filteredItems) => (
              <MenuItem
                key={item.name}
                isLast={index === filteredItems.length - 1}
                onPress={() => handleNavigate(item.route)}
                activeOpacity={0.7}
              >
                <MenuIcon>
                  <Ionicons name={item.icon} size={20} color={theme.colors.accent} />
                </MenuIcon>
                <MenuText>{item.name}</MenuText>
              </MenuItem>
            ))}
        </Dropdown>
      )}

      <NotificationsPanel visible={isNotificationsOpen} onClose={handleNotificationClose} />
    </Container>
  );
});

TopNavbar.displayName = 'TopNavbar';

export default TopNavbar;


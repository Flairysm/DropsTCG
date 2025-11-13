import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView as RNScrollView,
  StatusBar as RNStatusBar,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
  z-index: 10;
  elevation: 10;
`;

const StyledScrollView = styled(RNScrollView)`
  flex: 1;
  z-index: 10;
  elevation: 10;
`;

const ScrollContent = styled.View`
  padding: 20px;
  padding-bottom: 40px;
`;

const ProfileHeader = styled.View`
  align-items: center;
  margin-bottom: 24px;
  padding-top: 20px;
`;

const AvatarContainer = styled.View`
  margin-bottom: 16px;
`;

const Avatar = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  border-width: 3px;
  border-color: ${(props) => props.theme.colors.accent};
`;

const AvatarPlaceholder = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${(props) => props.theme.colors.secondary};
  justify-content: center;
  align-items: center;
  border-width: 3px;
  border-color: ${(props) => props.theme.colors.accent};
`;

const Username = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4px;
`;

const Email = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.6;
`;

const BalanceCard = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
`;

const BalanceHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const BalanceLabel = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  margin-left: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BalanceAmount = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.accent};
  margin-bottom: 16px;
`;

const ReloadButton = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.colors.accent};
  border-radius: 12px;
  padding: 14px;
  align-items: center;
`;

const ReloadButtonText = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const MenuSection = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 12px;
  letter-spacing: 1px;
`;

const MenuContainer = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
`;

const MenuItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom-width: ${(props) => (props.isLast ? '0px' : '1px')};
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
`;

const MenuItemLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const MenuItemText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => (props.isDestructive ? props.theme.colors.error : props.theme.colors.text)};
  margin-left: 12px;
`;

const CenterContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primary};
`;

const ErrorText = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  opacity: 0.7;
`;

const menuItems = [
  {
    id: 'order-shipments',
    title: 'Order Shipments',
    icon: 'cube-outline',
    route: '/profile/order-shipments',
  },
  {
    id: 'raffles',
    title: 'Raffles',
    icon: 'ticket-outline',
    route: '/profile/raffles',
  },
  {
    id: 'address',
    title: 'Address',
    icon: 'location-outline',
    route: '/profile/address',
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: 'help-circle-outline',
    route: '/profile/faq',
  },
  {
    id: 'feedback',
    title: 'Feedback',
    icon: 'chatbubble-outline',
    route: '/profile/feedback',
  },
  {
    id: 'profile-setting',
    title: 'Profile Setting',
    icon: 'person-outline',
    route: '/profile/profile-setting',
  },
  {
    id: 'help',
    title: 'Help and Support',
    icon: 'help-circle-outline',
    route: '/profile/help',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: 'shield-outline',
    route: '/profile/privacy',
  },
  {
    id: 'terms',
    title: 'Terms and Conditions',
    icon: 'document-text-outline',
    route: '/profile/terms',
  },
  {
    id: 'logout',
    title: 'Log Out',
    icon: 'log-out-outline',
    route: '/profile/logout',
    isDestructive: true,
  },
];

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with actual auth context
  // const { user } = useAuth();

  const fetchUserProfile = useCallback(async () => {
    try {
      // TODO: Replace with actual Supabase/API call
      // const { data: profile, error: profileError } = await supabase
      //   .from('user_profiles')
      //   .select('username, phone_number')
      //   .eq('id', user.id)
      //   .single();

      // Mock data for now
      setUserData({
        username: 'Player',
        email: 'player@example.com',
        phone_number: undefined,
        avatar: undefined,
        tokenBalance: 0, // TODO: Fetch from tokens table when available
        totalCards: 0, // TODO: Fetch from cards table when available
        rareCards: 0, // TODO: Fetch from cards table when available
        rafflesJoined: 0, // TODO: Fetch from raffles table when available
        packsOpened: 0, // TODO: Fetch from packs table when available
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set fallback data
      setUserData({
        username: 'User',
        email: '',
        tokenBalance: 0,
        totalCards: 0,
        rareCards: 0,
        rafflesJoined: 0,
        packsOpened: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Refresh profile when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  const handleMenuPress = useCallback((item) => {
    // TODO: Implement navigation to routes
    // For now, just log the action
    console.log('Navigate to:', item.route);
    
    // Example navigation (uncomment when routes are set up):
    // if (item.id === 'logout') {
    //   // Handle logout
    // } else {
    //   navigation.navigate(item.route);
    // }
  }, [navigation]);

  if (loading) {
    return (
      <Container edges={['left', 'right']}>
        <StatusBar style="light" />
        {Platform.OS === 'android' && (
          <RNStatusBar
            barStyle="light-content"
            backgroundColor={theme.colors.primary}
            translucent={false}
          />
        )}
        <CenterContent>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </CenterContent>
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container edges={['left', 'right']}>
        <StatusBar style="light" />
        {Platform.OS === 'android' && (
          <RNStatusBar
            barStyle="light-content"
            backgroundColor={theme.colors.primary}
            translucent={false}
          />
        )}
        <CenterContent>
          <ErrorText>No user data available</ErrorText>
        </CenterContent>
      </Container>
    );
  }

  return (
    <Container edges={['left', 'right']}>
      {/* Expo StatusBar for iOS */}
      <StatusBar style="light" />
      {/* React Native StatusBar for Android */}
      {Platform.OS === 'android' && (
        <RNStatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.primary}
          translucent={false}
        />
      )}

      <StyledScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        <ScrollContent>
          {/* Profile Header */}
          <ProfileHeader>
            <AvatarContainer>
              {userData.avatar ? (
                <Avatar source={{ uri: userData.avatar }} />
              ) : (
                <AvatarPlaceholder>
                  <Ionicons name="person" size={48} color={theme.colors.accent} />
                </AvatarPlaceholder>
              )}
            </AvatarContainer>
            <Username>{userData.username}</Username>
            <Email>{userData.email}</Email>
          </ProfileHeader>

          {/* Token Balance Card */}
          <BalanceCard>
            <BalanceHeader>
              <Ionicons name="diamond" size={24} color={theme.colors.accent} />
              <BalanceLabel>Token Balance</BalanceLabel>
            </BalanceHeader>
            <BalanceAmount>
              {userData.tokenBalance.toLocaleString()} tokens
            </BalanceAmount>
            <ReloadButton>
              <ReloadButtonText>Reload</ReloadButtonText>
            </ReloadButton>
          </BalanceCard>

          {/* Menu Items */}
          <MenuSection>
            <SectionTitle>MENU</SectionTitle>
            <MenuContainer>
              {menuItems.map((item, index) => (
                <MenuItem
                  key={item.id}
                  isLast={index === menuItems.length - 1}
                  onPress={() => handleMenuPress(item)}
                  activeOpacity={0.7}
                >
                  <MenuItemLeft>
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={item.isDestructive ? theme.colors.error : theme.colors.accent}
                    />
                    <MenuItemText isDestructive={item.isDestructive}>
                      {item.title}
                    </MenuItemText>
                  </MenuItemLeft>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={item.isDestructive ? theme.colors.error : 'rgba(255, 255, 255, 0.5)'}
                  />
                </MenuItem>
              ))}
            </MenuContainer>
          </MenuSection>
        </ScrollContent>
      </StyledScrollView>
    </Container>
  );
}


import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView as RNScrollView,
  StatusBar as RNStatusBar,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../services/authentication/authentication.context';
import { supabase } from '../../../infrastructure/supabase';

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

export default function ProfileScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, logout, isAuthenticated } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useFocusEffect(
    React.useCallback(() => {
      if (!isAuthenticated) {
        const parent = navigation.getParent()?.getParent();
        if (parent) {
          parent.navigate('Account', { screen: 'Login' });
        } else {
          navigation.getParent()?.navigate('Account', { screen: 'Login' });
        }
      }
    }, [isAuthenticated, navigation])
  );

  const fetchUserProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user profile from Supabase
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is okay for new users
        console.error('Error fetching user profile:', profileError);
      }

      // Fetch additional stats if tables exist
      let totalCards = 0;
      let rareCards = 0;
      let rafflesJoined = 0;
      let packsOpened = 0;

      try {
        // Try to fetch card count
        const { count: cardCount } = await supabase
          .from('user_cards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        totalCards = cardCount || 0;

        // Try to fetch rare cards count (SSS, SS, S tiers)
        const { count: rareCount } = await supabase
          .from('user_cards')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .in('tier', ['SSS', 'SS', 'S']);

        rareCards = rareCount || 0;
      } catch (err) {
        // Tables might not exist yet
        console.log('Could not fetch card stats:', err);
      }

      try {
        // Try to fetch raffle participation count
        const { count: raffleCount } = await supabase
          .from('raffle_participants')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        rafflesJoined = raffleCount || 0;
      } catch (err) {
        console.log('Could not fetch raffle stats:', err);
      }

      try {
        // Try to fetch pack opening count
        const { count: packCount } = await supabase
          .from('pack_openings')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        packsOpened = packCount || 0;
      } catch (err) {
        console.log('Could not fetch pack stats:', err);
      }

      setUserData({
        username: profile?.username || user.username || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        phone_number: profile?.phone_number || null,
        avatar: profile?.avatar || null,
        tokenBalance: profile?.token_balance || user.tokenBalance || 0,
        totalCards,
        rareCards,
        rafflesJoined,
        packsOpened,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Set fallback data from auth context
      setUserData({
        username: user.username || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        phone_number: null,
        avatar: null,
        tokenBalance: user.tokenBalance || 0,
        totalCards: 0,
        rareCards: 0,
        rafflesJoined: 0,
        packsOpened: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Refresh profile when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [fetchUserProfile])
  );

  const handleMenuPress = useCallback(async (item) => {
    if (item.id === 'logout') {
      try {
        const result = await logout();
        if (result.success) {
          // Show success message
          Alert.alert(
            'Logged Out',
            'You have successfully logged out.',
            [{ text: 'OK' }]
          );
          // Navigation will automatically switch to login via RootNavigator
          // when isAuthenticated becomes false
          console.log('Logout successful');
        } else {
          console.error('Logout failed:', result.error);
          Alert.alert('Error', 'Failed to logout. Please try again.');
          // Still try to navigate - state should be cleared
        }
      } catch (error) {
        console.error('Logout error:', error);
        Alert.alert('Error', 'An error occurred during logout.');
        // State should still be cleared, navigation should happen
      }
    } else {
      // TODO: Implement navigation to other routes when screens are created
      console.log('Navigate to:', item.route);
    }
  }, [logout]);

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


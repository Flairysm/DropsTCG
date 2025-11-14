import React, { useState, useCallback, useMemo } from 'react';
import {
  ScrollView as RNScrollView,
  StatusBar as RNStatusBar,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled, { useTheme } from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../services/authentication/authentication.context';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${(props) => props.theme.colors.primary};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 20px;
  padding-vertical: 16px;
  background-color: ${(props) => props.theme.colors.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
`;

const BackButton = styled(TouchableOpacity)`
  padding: 4px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
`;

const HeaderRight = styled.View`
  width: 32px;
`;

const TabsContainer = styled.ScrollView`
  background-color: ${(props) => props.theme.colors.secondary};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
  max-height: 50px;
  height: 50px;
`;

const TabsContent = styled.View`
  flex-direction: row;
  padding-horizontal: 16px;
  padding-vertical: 6px;
`;

const Tab = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding-horizontal: 12px;
  padding-vertical: 6px;
  margin-right: 8px;
  border-radius: 6px;
  background-color: ${(props) => (props.active ? props.theme.colors.accent : 'transparent')};
  border-width: 1px;
  border-color: ${(props) =>
    props.active ? props.theme.colors.accent : props.theme.colors.borderLight};
`;

const TabText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.text)};
  opacity: ${(props) => (props.active ? 1 : 0.7)};
  margin-left: 4px;
`;

const Content = styled(RNScrollView)`
  flex: 1;
`;

const ContentContainer = styled.View`
  padding: 20px;
  padding-bottom: 40px;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;
`;

const AddButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.accent};
  padding-horizontal: 16px;
  padding-vertical: 10px;
  border-radius: 8px;
`;

const AddButtonText = styled.Text`
  font-size: 14px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.primary};
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const StatCard = styled.View`
  width: 48%;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  padding: 16px;
  align-items: center;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
  margin-bottom: 16px;
`;

const StatValue = styled.Text`
  font-size: 28px;
  font-weight: 800;
  color: ${(props) => props.theme.colors.accent};
  margin-top: 12px;
  margin-bottom: 4px;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.7;
  font-weight: 500;
`;

const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 8px;
  padding-horizontal: 12px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  padding-vertical: 12px;
`;

const PlaceholderText = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.6;
  text-align: center;
  margin-top: 40px;
`;

const SettingsList = styled.View`
  background-color: ${(props) => props.theme.colors.secondary};
  border-radius: 16px;
  overflow: hidden;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.borderLight};
`;

const SettingItem = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding-vertical: 16px;
  padding-horizontal: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.borderLight};
`;

const SettingText = styled.Text`
  flex: 1;
  font-size: 16px;
  color: ${(props) => props.theme.colors.text};
  margin-left: 16px;
  font-weight: 500;
`;

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { id: 'raffles', label: 'Raffles', icon: 'ticket-outline' },
  { id: 'cards', label: 'Cards', icon: 'card-outline' },
  { id: 'users', label: 'Users', icon: 'people-outline' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline' },
];

export default function AdminScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Protect admin screen - redirect non-admins
  useFocusEffect(
    React.useCallback(() => {
      if (!isAdmin()) {
        Alert.alert(
          'Access Denied',
          'You do not have permission to access this page.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    }, [isAdmin, navigation])
  );

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleTabPress = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const renderDashboard = useMemo(
    () => (
      <Section>
        <SectionTitle>Dashboard</SectionTitle>
        <StatsGrid>
          <StatCard>
            <Ionicons name="people" size={32} color={theme.colors.accent} />
            <StatValue>1,234</StatValue>
            <StatLabel>Total Users</StatLabel>
          </StatCard>
          <StatCard>
            <Ionicons name="ticket" size={32} color={theme.colors.accent} />
            <StatValue>45</StatValue>
            <StatLabel>Active Raffles</StatLabel>
          </StatCard>
          <StatCard>
            <Ionicons name="card" size={32} color={theme.colors.accent} />
            <StatValue>12,567</StatValue>
            <StatLabel>Cards in Vault</StatLabel>
          </StatCard>
          <StatCard>
            <Ionicons name="diamond" size={32} color={theme.colors.accent} />
            <StatValue>2.5M</StatValue>
            <StatLabel>Tokens Sold</StatLabel>
          </StatCard>
        </StatsGrid>
      </Section>
    ),
    [theme.colors.accent]
  );

  const renderRaffles = useMemo(
    () => (
      <Section>
        <SectionHeader>
          <SectionTitle style={{ marginBottom: 0 }}>Manage Raffles</SectionTitle>
          <AddButton activeOpacity={0.7}>
            <Ionicons name="add" size={20} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <AddButtonText>New Raffle</AddButtonText>
          </AddButton>
        </SectionHeader>
        <PlaceholderText>Raffle management interface coming soon...</PlaceholderText>
      </Section>
    ),
    [theme.colors.primary]
  );

  const renderCards = useMemo(
    () => (
      <Section>
        <SectionHeader>
          <SectionTitle style={{ marginBottom: 0 }}>Manage Cards</SectionTitle>
          <AddButton activeOpacity={0.7}>
            <Ionicons name="add" size={20} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <AddButtonText>Add Card</AddButtonText>
          </AddButton>
        </SectionHeader>
        <PlaceholderText>Card management interface coming soon...</PlaceholderText>
      </Section>
    ),
    [theme.colors.primary]
  );

  const renderUsers = useMemo(
    () => (
      <Section>
        <SectionTitle>User Management</SectionTitle>
        <SearchBar>
          <Ionicons
            name="search"
            size={20}
            color="rgba(255, 255, 255, 0.5)"
            style={{ marginRight: 8 }}
          />
          <SearchInput
            placeholder="Search users..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </SearchBar>
        <PlaceholderText>User management interface coming soon...</PlaceholderText>
      </Section>
    ),
    [searchQuery]
  );

  const renderSettings = useMemo(
    () => (
      <Section>
        <SectionTitle>Admin Settings</SectionTitle>
        <SettingsList>
          <SettingItem activeOpacity={0.7}>
            <Ionicons name="shield-outline" size={24} color={theme.colors.accent} />
            <SettingText>Permissions</SettingText>
            <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.3)" />
          </SettingItem>
          <SettingItem activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.accent} />
            <SettingText>Notification Settings</SettingText>
            <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.3)" />
          </SettingItem>
          <SettingItem activeOpacity={0.7}>
            <Ionicons name="analytics-outline" size={24} color={theme.colors.accent} />
            <SettingText>Analytics</SettingText>
            <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.3)" />
          </SettingItem>
          <SettingItem activeOpacity={0.7} style={{ borderBottomWidth: 0 }}>
            <Ionicons name="server-outline" size={24} color={theme.colors.accent} />
            <SettingText>System Status</SettingText>
            <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.3)" />
          </SettingItem>
        </SettingsList>
      </Section>
    ),
    [theme.colors.accent]
  );

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard;
      case 'raffles':
        return renderRaffles;
      case 'cards':
        return renderCards;
      case 'users':
        return renderUsers;
      case 'settings':
        return renderSettings;
      default:
        return renderDashboard;
    }
  }, [activeTab, renderDashboard, renderRaffles, renderCards, renderUsers, renderSettings]);

  return (
    <Container edges={['top', 'left', 'right']}>
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

      {/* Header */}
      <Header>
        <BackButton onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </BackButton>
        <HeaderTitle>Admin Panel</HeaderTitle>
        <HeaderRight />
      </Header>

      {/* Tabs */}
      <TabsContainer
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 6 }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={activeTab === tab.id ? theme.colors.primary : theme.colors.text}
            />
            <TabText active={activeTab === tab.id}>{tab.label}</TabText>
          </Tab>
        ))}
      </TabsContainer>

      {/* Content */}
      <Content showsVerticalScrollIndicator={false}>
        <ContentContainer>{renderContent}</ContentContainer>
      </Content>
    </Container>
  );
}


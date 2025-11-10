import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  // Sample user data - replace with actual user data from your API/state
  const userData = {
    username: 'Player123',
    email: 'player@example.com',
    avatar: null, // Can be an image URL
    tokenBalance: 1250,
    totalCards: 45,
    rareCards: 12,
    rafflesJoined: 8,
    packsOpened: 23,
  };

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

  const handleMenuPress = (item: typeof menuItems[0]) => {
    if (item.id === 'logout') {
      // Handle logout - show confirmation modal or directly logout
      // TODO: Implement logout logic
      return;
    }
    router.push(item.route as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userData.avatar ? (
              <Image source={{ uri: userData.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={48} color="#40ffdc" />
              </View>
            )}
          </View>
          <Text style={styles.username}>{userData.username}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>

        {/* Token Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Ionicons name="diamond" size={24} color="#40ffdc" />
            <Text style={styles.balanceLabel}>Token Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>
            {userData.tokenBalance.toLocaleString()} tokens
          </Text>
          <TouchableOpacity style={styles.reloadButton}>
            <Text style={styles.reloadButtonText}>Reload</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>MENU</Text>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === menuItems.length - 1 && styles.menuItemLast
                ]}
                onPress={() => handleMenuPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={item.isDestructive ? '#ff4444' : '#40ffdc'}
                  />
                  <Text
                    style={[
                      styles.menuItemText,
                      item.isDestructive && styles.menuItemTextDestructive
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={item.isDestructive ? '#ff4444' : 'rgba(255, 255, 255, 0.5)'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0019',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#40ffdc',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#12042b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#40ffdc',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.6,
  },
  balanceCard: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#40ffdc',
    marginBottom: 16,
  },
  reloadButton: {
    backgroundColor: '#40ffdc',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  reloadButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a0019',
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 1,
  },
  menuContainer: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 12,
  },
  menuItemTextDestructive: {
    color: '#ff4444',
  },
});

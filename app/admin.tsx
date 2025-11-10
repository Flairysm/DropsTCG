import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Admin() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'raffles' | 'cards' | 'users' | 'settings'>('dashboard');

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: 'grid-outline' },
    { id: 'raffles' as const, label: 'Raffles', icon: 'ticket-outline' },
    { id: 'cards' as const, label: 'Cards', icon: 'card-outline' },
    { id: 'users' as const, label: 'Users', icon: 'people-outline' },
    { id: 'settings' as const, label: 'Settings', icon: 'settings-outline' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Panel</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.tabActive
            ]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={activeTab === tab.id ? '#0a0019' : '#ffffff'}
              style={styles.tabIcon}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'dashboard' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dashboard</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="people" size={32} color="#40ffdc" />
                <Text style={styles.statValue}>1,234</Text>
                <Text style={styles.statLabel}>Total Users</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="ticket" size={32} color="#40ffdc" />
                <Text style={styles.statValue}>45</Text>
                <Text style={styles.statLabel}>Active Raffles</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="card" size={32} color="#40ffdc" />
                <Text style={styles.statValue}>12,567</Text>
                <Text style={styles.statLabel}>Cards in Vault</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="diamond" size={32} color="#40ffdc" />
                <Text style={styles.statValue}>2.5M</Text>
                <Text style={styles.statLabel}>Tokens Sold</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'raffles' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manage Raffles</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={20} color="#0a0019" style={{ marginRight: 6 }} />
                <Text style={styles.addButtonText}>New Raffle</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.placeholderText}>
              Raffle management interface coming soon...
            </Text>
          </View>
        )}

        {activeTab === 'cards' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Manage Cards</Text>
              <TouchableOpacity style={styles.addButton}>
                <Ionicons name="add" size={20} color="#0a0019" style={{ marginRight: 6 }} />
                <Text style={styles.addButtonText}>Add Card</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.placeholderText}>
              Card management interface coming soon...
            </Text>
          </View>
        )}

        {activeTab === 'users' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Management</Text>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.5)" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search users..."
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
              />
            </View>
            <Text style={styles.placeholderText}>
              User management interface coming soon...
            </Text>
          </View>
        )}

        {activeTab === 'settings' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Admin Settings</Text>
            <View style={styles.settingsList}>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="shield-outline" size={24} color="#40ffdc" />
                <Text style={styles.settingText}>Permissions</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.3)" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="notifications-outline" size={24} color="#40ffdc" />
                <Text style={styles.settingText}>Notification Settings</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.3)" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="analytics-outline" size={24} color="#40ffdc" />
                <Text style={styles.settingText}>Analytics</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.3)" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="server-outline" size={24} color="#40ffdc" />
                <Text style={styles.settingText}>System Status</Text>
                <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.3)" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0019',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#12042b',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerRight: {
    width: 32,
  },
  tabsContainer: {
    backgroundColor: '#12042b',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
    maxHeight: 50,
    height: 50,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  tabActive: {
    backgroundColor: '#40ffdc',
    borderColor: '#40ffdc',
  },
  tabIcon: {
    marginRight: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    opacity: 0.7,
  },
  tabTextActive: {
    color: '#0a0019',
    opacity: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#40ffdc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a0019',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#40ffdc',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12042b',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#ffffff',
    paddingVertical: 12,
  },
  placeholderText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 40,
  },
  settingsList: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 16,
    fontWeight: '500',
  },
});


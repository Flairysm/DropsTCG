import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Shipment {
  id: string;
  orderNumber: string;
  items: string[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  trackingNumber?: string;
}

const sampleShipments: Shipment[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    items: ['Charizard VMAX', 'Pikachu VMAX'],
    status: 'shipped',
    date: '2024-01-15',
    trackingNumber: 'TRACK123456',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    items: ['Base Set Booster Pack x3'],
    status: 'processing',
    date: '2024-01-20',
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    items: ['PSA 10 Charizard'],
    status: 'delivered',
    date: '2024-01-10',
    trackingNumber: 'TRACK789012',
  },
];

export default function OrderShipments() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'processing': return '#3B82F6';
      case 'shipped': return '#10B981';
      case 'delivered': return '#40ffdc';
      default: return '#ffffff';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'processing': return 'sync-outline';
      case 'shipped': return 'car-outline';
      case 'delivered': return 'checkmark-circle-outline';
      default: return 'cube-outline';
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Shipments</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sampleShipments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="rgba(255, 255, 255, 0.3)" />
            <Text style={styles.emptyText}>No shipments yet</Text>
            <Text style={styles.emptySubtext}>Your order shipments will appear here</Text>
          </View>
        ) : (
          sampleShipments.map((shipment) => (
            <View key={shipment.id} style={styles.shipmentCard}>
              <View style={styles.shipmentHeader}>
                <View style={styles.shipmentHeaderLeft}>
                  <Ionicons name="cube" size={24} color="#40ffdc" />
                  <View style={styles.shipmentInfo}>
                    <Text style={styles.orderNumber}>{shipment.orderNumber}</Text>
                    <Text style={styles.date}>{shipment.date}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(shipment.status)}20` }]}>
                  <Ionicons name={getStatusIcon(shipment.status) as any} size={16} color={getStatusColor(shipment.status)} />
                  <Text style={[styles.statusText, { color: getStatusColor(shipment.status) }]}>
                    {shipment.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.itemsContainer}>
                <Text style={styles.itemsLabel}>Items:</Text>
                {shipment.items.map((item, index) => (
                  <Text key={index} style={styles.itemText}>
                    • {item}
                  </Text>
                ))}
              </View>

              {shipment.trackingNumber && (
                <View style={styles.trackingContainer}>
                  <Text style={styles.trackingLabel}>Tracking Number:</Text>
                  <Text style={styles.trackingNumber}>{shipment.trackingNumber}</Text>
                </View>
              )}
            </View>
          ))
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.6,
    textAlign: 'center',
  },
  shipmentCard: {
    backgroundColor: '#12042b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(64, 255, 220, 0.2)',
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  shipmentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  shipmentInfo: {
    marginLeft: 12,
    flex: 1,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
    opacity: 0.8,
  },
  itemText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 4,
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(64, 255, 220, 0.1)',
  },
  trackingLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
    marginRight: 8,
  },
  trackingNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#40ffdc',
  },
});


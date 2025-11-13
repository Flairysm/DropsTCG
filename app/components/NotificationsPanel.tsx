import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationsPanelProps {
  visible: boolean;
  onClose: () => void;
  notifications?: Notification[];
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  visible,
  onClose,
  notifications = [],
}) => {
  // Sample notifications - replace with real data from your state/API
  const defaultNotifications: Notification[] = [
    {
      id: '1',
      title: 'Welcome to DropsTCG!',
      message: 'Start collecting cards and building your deck.',
      time: '2 hours ago',
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'New Card Available',
      message: 'A rare card has been added to the collection.',
      time: '5 hours ago',
      read: false,
      type: 'success',
    },
    {
      id: '3',
      title: 'Daily Challenge',
      message: 'Complete today\'s challenge to earn rewards.',
      time: '1 day ago',
      read: true,
      type: 'warning',
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications;
  const unreadCount = displayNotifications.filter(n => !n.read).length;

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'close-circle';
      default:
        return 'information-circle';
    }
  };

  const getNotificationColor = (type?: string) => {
    switch (type) {
      case 'success':
        return '#40ffdc';
      case 'warning':
        return '#ffa500';
      case 'error':
        return '#ff4444';
      default:
        return '#40ffdc';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer} edges={['top']}>
        <View style={styles.panel}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Notification Count */}
          {unreadCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {unreadCount} {unreadCount === 1 ? 'unread' : 'unread'}
              </Text>
            </View>
          )}

          {/* Notifications List */}
          <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
            {displayNotifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off-outline" size={64} color="#666" />
                <Text style={styles.emptyText}>No notifications</Text>
              </View>
            ) : (
              displayNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.unreadNotification,
                  ]}
                >
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={20}
                        color={getNotificationColor(notification.type)}
                        style={styles.notificationIcon}
                      />
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      {!notification.read && <View style={styles.unreadDot} />}
                    </View>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: '#12042b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  countBadge: {
    backgroundColor: 'rgba(64, 255, 220, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 12,
  },
  countText: {
    color: '#40ffdc',
    fontSize: 12,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(64, 255, 220, 0.05)',
  },
  unreadNotification: {
    backgroundColor: 'rgba(64, 255, 220, 0.05)',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationIcon: {
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#40ffdc',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#cccccc',
    marginTop: 4,
    marginLeft: 28,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    marginLeft: 28,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginTop: 16,
  },
});

export default NotificationsPanel;


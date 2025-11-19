import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notificationStyles } from '../styles/NotificationStyles';
import { useNotificationStore, useNotificationHelpers } from '../state/useNotificationStore';
import { getNotificationContext, getTimeDisplay } from '../../utils/notificationUtils';

export default function NotificationScreen({ navigation }: any) {
  const {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    clearError,
  } = useNotificationStore();

  const { getNotificationIcon, getPriorityColor, getNavigationInfo } = useNotificationHelpers();
  
  const styles = notificationStyles;

  useEffect(() => {
    // Load notifications when screen opens
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      await fetchNotifications({ page: 0, size: 50 });
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleNotificationPress = async (notification: any) => {
    try {
      // Mark as read if unread
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }

      // Get navigation info based on notification type
      const navInfo = getNavigationInfo(notification);
      
      // Navigate to appropriate screen
      if (navInfo.route) {
        navigation.navigate(navInfo.route, navInfo.params);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const renderNotification = (notification: any) => {
    const context = getNotificationContext(notification);
    const { display: timeDisplay, isRecent } = getTimeDisplay(notification);
    const icon = getNotificationIcon(notification.eventType);
    const priorityColor = getPriorityColor(notification.priority);

    return (
      <TouchableOpacity
        key={notification.id}
        style={[
          styles.notificationCard,
          !notification.isRead && styles.unreadCard
        ]}
        onPress={() => handleNotificationPress(notification)}
      >
        <View style={styles.notificationHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.notificationIcon}>{icon}</Text>
          </View>
          
          <View style={styles.notificationContent}>
            <View style={styles.titleRow}>
              <Text style={[
                styles.notificationTitle,
                !notification.isRead && styles.unreadTitle
              ]}>
                {context.primaryText}
              </Text>
              <View 
                style={[
                  styles.priorityDot,
                  { backgroundColor: priorityColor }
                ]} 
              />
            </View>
            
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {context.secondaryText}
            </Text>
            
            <View style={styles.footerRow}>
              <Text style={[
                styles.notificationDate,
                isRecent && styles.recentTime
              ]}>
                {timeDisplay}
              </Text>
              {context.actionText && (
                <Text style={styles.actionText}>{context.actionText}</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3DD5DC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Notifications ({unreadCount} unread)
        </Text>
        <TouchableOpacity 
          style={styles.markAllButton}
          onPress={handleMarkAllAsRead}
        >
          <Ionicons name="checkmark-done" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={clearError}>
            <Text style={styles.clearErrorText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading State */}
      {isLoading && notifications.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3DD5DC" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      )}

      {/* Notifications List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshNotifications}
            colors={['#3DD5DC']}
            tintColor="#3DD5DC"
          />
        }
      >
        {notifications.length > 0 ? (
          notifications.map(renderNotification)
        ) : (
          !isLoading && (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-outline" size={64} color="#CCC" />
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubtitle}>
                We'll notify you when there are updates
              </Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={refreshNotifications}
              >
                <Text style={styles.refreshButtonText}>Pull to refresh</Text>
              </TouchableOpacity>
            </View>
          )
        )}

        {/* Empty space for bottom tab */}
        <View style={{ height: Platform.OS === 'ios' ? 100 : 80 }} />
      </ScrollView>
    </View>
  );
}

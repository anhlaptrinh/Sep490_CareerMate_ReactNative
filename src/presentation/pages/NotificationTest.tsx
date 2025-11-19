import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNotificationStore, useNotificationHelpers } from '../state/useNotificationStore';
import { NotificationEventType, NotificationPriority, NotificationCategory } from '../../domain/models/Notification';
import { getNotificationContext, getTimeDisplay } from '../../utils/notificationUtils';

/**
 * Test page for notification functionality
 * Focused on candidate-specific notification events
 */
export const NotificationTestPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    notifications,
    unreadCount,
    isLoading,
    isRefreshing,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    deleteNotification,
    refreshNotifications,
    clearError,
  } = useNotificationStore();

  const { getNotificationIcon, getPriorityColor } = useNotificationHelpers();

  useEffect(() => {
    // Load initial data
    loadTestData();
  }, []);

  const loadTestData = async () => {
    try {
      console.log('🧪 Loading test notification data...');
      await fetchNotifications({ page: 0, size: 20 });
      await fetchUnreadCount();
    } catch (error) {
      console.error('❌ Failed to load test data:', error);
    }
  };

  const handleNotificationPress = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
      Alert.alert('Success', 'Notification marked as read');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark as read');
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNotification(notificationId);
              Alert.alert('Success', 'Notification deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete notification');
            }
          },
        },
      ]
    );
  };

  const createTestNotification = () => {
    // Create a mock candidate notification for testing
    const mockNotification = {
      id: Date.now(), // Use timestamp as mock ID
      eventId: `test-${Date.now()}`,
      eventType: NotificationEventType.APPLICATION_STATUS_CHANGED,
      recipientId: 'candidate-123',
      title: 'Test Candidate Notification',
      subject: 'Application Status Update',
      message: 'Your application status has been updated to "Under Review"',
      category: NotificationCategory.APPLICATION,
      metadata: {
        applicationId: 456,
        jobId: 789,
        jobTitle: 'Senior React Native Developer',
        oldStatus: 'SUBMITTED',
        newStatus: 'UNDER_REVIEW',
      },
      priority: NotificationPriority.MEDIUM,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    console.log('🧪 Mock notification created:', mockNotification);
    Alert.alert('Test Notification', 'Mock candidate notification created (check console)');
  };

  const renderNotificationCard = (notification: any) => {
    const context = getNotificationContext(notification);
    const { display: timeDisplay, isRecent } = getTimeDisplay(notification);
    const icon = getNotificationIcon(notification.eventType);
    const priorityColor = getPriorityColor(notification.priority);

    return (
      <View
        key={notification.id}
        style={[
          styles.notificationCard,
          !notification.isRead && styles.unreadCard
        ]}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => handleNotificationPress(notification.id)}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.headerRow}>
              <Text style={[
                styles.title,
                !notification.isRead && styles.unreadTitle
              ]}>
                {context.primaryText}
              </Text>
              <View 
                style={[
                  styles.priorityBadge,
                  { backgroundColor: priorityColor }
                ]} 
              />
            </View>
            
            <Text style={styles.message} numberOfLines={2}>
              {context.secondaryText}
            </Text>
            
            <View style={styles.footerRow}>
              <Text style={[
                styles.time,
                isRecent && styles.recentTime
              ]}>
                {timeDisplay}
              </Text>
              <Text style={styles.eventType}>
                {notification.eventType}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteNotification(notification.id)}
        >
          <Text style={styles.deleteText}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Notification Test ({unreadCount} unread)
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.refreshButton]}
          onPress={refreshNotifications}
          disabled={isRefreshing}
        >
          <Text style={styles.buttonText}>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.testButton]}
          onPress={createTestNotification}
        >
          <Text style={styles.buttonText}>Test Mock</Text>
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

      {/* Status Info */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          📊 Status: {notifications.length} notifications loaded
        </Text>
        <Text style={styles.statusText}>
          📱 Focus: Candidate notifications
        </Text>
      </View>

      {/* Loading State */}
      {isLoading && notifications.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3DD5DC" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      )}

      {/* Notifications List */}
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshNotifications}
            colors={['#3DD5DC']}
          />
        }
      >
        {notifications.length > 0 ? (
          notifications.map(renderNotificationCard)
        ) : (
          !isLoading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No notifications available
              </Text>
              <Text style={styles.emptySubtext}>
                Pull to refresh or check backend connection
              </Text>
            </View>
          )
        )}
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🧪 Test Mode: Backend endpoints required for full functionality
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    fontSize: 16,
    color: '#3DD5DC',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  controls: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#3DD5DC',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#FF5722',
  },
  testButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    margin: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    flex: 1,
  },
  clearErrorText: {
    color: '#C62828',
    fontSize: 14,
    fontWeight: '600',
  },
  statusContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    margin: 12,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#1565C0',
    marginBottom: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    backgroundColor: '#E8F4FD',
    borderLeftWidth: 4,
    borderLeftColor: '#3DD5DC',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  priorityBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  recentTime: {
    color: '#3DD5DC',
    fontWeight: '600',
  },
  eventType: {
    fontSize: 10,
    color: '#999',
    fontFamily: 'monospace',
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#FFF3E0',
    padding: 8,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#F57C00',
    textAlign: 'center',
  },
});
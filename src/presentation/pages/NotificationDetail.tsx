import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Notification, NotificationPriority, NotificationCategory, NotificationEventType } from '../../domain/models/Notification';
import { getNotificationContext } from '../../utils/notificationUtils';

type NotificationDetailRouteProp = RouteProp<RootStackParamList, 'NotificationDetail'>;

export default function NotificationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<NotificationDetailRouteProp>();
  const { notification } = route.params;

  const context = getNotificationContext(notification);

  // Format time for display
  const formatTimeDisplay = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Get notification icon based on event type
  const getNotificationIcon = (): string => {
    switch (notification.eventType) {
      case NotificationEventType.PROFILE_UPDATE_REQUEST:
      case NotificationEventType.PROFILE_UPDATE_APPROVED:
      case NotificationEventType.PROFILE_UPDATE_REJECTED:
      case NotificationEventType.PROFILE_VERIFICATION:
        return '👤';
      case NotificationEventType.JOB_POSTING_APPROVED:
      case NotificationEventType.JOB_POSTING_REJECTED:
        return '📋';
      case NotificationEventType.APPLICATION_RECEIVED:
      case NotificationEventType.APPLICATION_STATUS_CHANGED:
        return '📬';
      case NotificationEventType.ACCOUNT_APPROVED:
        return '🎉';
      case NotificationEventType.ACCOUNT_REJECTED:
        return '⚠️';
      case NotificationEventType.SYSTEM_NOTIFICATION:
        return '🔔';
      case NotificationEventType.TEST_ADMIN_NOTIFICATION:
      case NotificationEventType.TEST_RECRUITER_NOTIFICATION:
      case NotificationEventType.TEST_CANDIDATE_NOTIFICATION:
        return '🧪';
      default:
        return '📄';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: NotificationPriority): string => {
    switch (priority) {
      case NotificationPriority.HIGH:
        return '#FF3B30';
      case NotificationPriority.MEDIUM:
        return '#FF9500';
      case NotificationPriority.LOW:
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: NotificationCategory): any => {
    switch (category) {
      case NotificationCategory.SYSTEM:
        return 'settings';
      case NotificationCategory.PROFILE_UPDATE:
        return 'person';
      case NotificationCategory.JOB_POSTING:
        return 'briefcase';
      case NotificationCategory.APPLICATION:
        return 'documents';
      case NotificationCategory.ACCOUNT:
        return 'key';
      case NotificationCategory.ADMIN_ACTION_REQUIRED:
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  // Get priority label
  const getPriorityLabel = (priority: NotificationPriority): string => {
    switch (priority) {
      case NotificationPriority.HIGH:
        return 'High Priority';
      case NotificationPriority.MEDIUM:
        return 'Medium Priority';
      case NotificationPriority.LOW:
        return 'Low Priority';
      default:
        return 'Normal';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Priority Badge */}
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(notification.priority) }]}>
          <Ionicons name="flag" size={16} color="#FFFFFF" />
          <Text style={styles.priorityText}>{getPriorityLabel(notification.priority)}</Text>
        </View>

        {/* Category & Event Type */}
        <View style={styles.metaSection}>
          <View style={styles.metaItem}>
            <Ionicons name={getCategoryIcon(notification.category)} size={20} color="#3DD5DC" />
            <Text style={styles.metaLabel}>Category:</Text>
            <Text style={styles.metaValue}>{notification.category}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="tag" size={20} color="#3DD5DC" />
            <Text style={styles.metaLabel}>Type:</Text>
            <Text style={styles.metaValue}>{notification.eventType}</Text>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.iconContainer}>{getNotificationIcon()}</Text>
          <Text style={styles.title}>{notification.title}</Text>
        </View>

        {/* Message Section */}
        <View style={styles.messageSection}>
          <Text style={styles.sectionTitle}>Message</Text>
          <Text style={styles.message}>{notification.message}</Text>
        </View>

        {/* Metadata Section */}
        {notification.metadata && Object.keys(notification.metadata).length > 0 && (
          <View style={styles.metadataSection}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.metadataContainer}>
              {Object.entries(notification.metadata).map(([key, value]) => (
                <View key={key} style={styles.metadataItem}>
                  <Text style={styles.metadataKey}>{key}:</Text>
                  <Text style={styles.metadataValue}>
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Time Information */}
        <View style={styles.timeSection}>
          <View style={styles.timeItem}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.timeLabel}>Received:</Text>
            <Text style={styles.timeValue}>{formatTimeDisplay(notification.createdAt)}</Text>
          </View>
          {notification.readAt && (
            <View style={styles.timeItem}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#34C759" />
              <Text style={styles.timeLabel}>Read:</Text>
              <Text style={styles.timeValue}>{formatTimeDisplay(notification.readAt)}</Text>
            </View>
          )}
        </View>

        {/* Status Badge */}
        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, notification.isRead ? styles.readBadge : styles.unreadBadge]}>
            <Ionicons 
              name={notification.isRead ? "checkmark-circle" : "ellipse-outline"} 
              size={16} 
              color={notification.isRead ? "#34C759" : "#FF9500"} 
            />
            <Text style={[styles.statusText, notification.isRead ? styles.readText : styles.unreadText]}>
              {notification.isRead ? 'Read' : 'Unread'}
            </Text>
          </View>
        </View>

        {/* Event ID (for debugging/support) */}
        <View style={styles.eventIdSection}>
          <Text style={styles.eventIdLabel}>Event ID:</Text>
          <Text style={styles.eventId}>{notification.eventId}</Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  metaSection: {
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 4,
  },
  metaValue: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    lineHeight: 28,
  },
  messageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  metadataSection: {
    marginBottom: 24,
  },
  metadataContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  metadataKey: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
    minWidth: 120,
  },
  metadataValue: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  timeSection: {
    marginBottom: 24,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 4,
  },
  timeValue: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  statusSection: {
    marginBottom: 24,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  readBadge: {
    backgroundColor: '#E8F5E9',
  },
  unreadBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  readText: {
    color: '#34C759',
  },
  unreadText: {
    color: '#FF9500',
  },
  eventIdSection: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  eventIdLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  eventId: {
    fontSize: 11,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  bottomAction: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  closeButton: {
    backgroundColor: '#3DD5DC',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

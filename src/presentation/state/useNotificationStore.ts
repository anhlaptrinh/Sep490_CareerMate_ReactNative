import { create } from 'zustand';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { GetNotificationsUseCase } from '../../domain/usecases/GetNotificationsUseCase';
import { GetUnreadCountUseCase } from '../../domain/usecases/GetUnreadCountUseCase';
import { MarkNotificationAsReadUseCase } from '../../domain/usecases/MarkNotificationAsReadUseCase';
import { DeleteNotificationUseCase } from '../../domain/usecases/DeleteNotificationUseCase';
import { GetNotificationByIdUseCase } from '../../domain/usecases/GetNotificationByIdUseCase';
import { MarkAllNotificationsAsReadUseCase } from '../../domain/usecases/MarkAllNotificationsAsReadUseCase';
import { 
  Notification, 
  NotificationQueryParams, 
  NotificationEventType,
  NotificationPriority,
  NotificationCategory,
  NotificationMetadata
} from '../../domain/models/Notification';

/**
 * Notification store state interface
 */
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  currentNotification: Notification | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalElements: number;

  // Actions
  fetchNotifications: (params?: NotificationQueryParams) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  getNotificationById: (notificationId: number) => Promise<Notification | null>;
  refreshNotifications: () => Promise<void>;
  clearError: () => void;
  clearCurrentNotification: () => void;
}

/**
 * Notification store using Zustand
 * Handles notification state management with polling functionality
 */
export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  currentNotification: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,

  /**
   * Fetch notifications with optional filters and pagination
   */
  fetchNotifications: async (params?: NotificationQueryParams) => {
    const isRefresh = params?.page === 0;
    set({ 
      isLoading: !isRefresh, 
      isRefreshing: isRefresh,
      error: null 
    });
    
    try {
      const useCase = container.get<GetNotificationsUseCase>(TYPES.GetNotificationsUseCase);
      const response = await useCase.execute(params);

      console.log('✅ Notification store: Fetch notifications response:', {
        totalElements: response.totalElements,
        contentLength: response.content.length,
        currentPage: response.number
      });

      set({
        notifications: response.content,
        currentPage: response.number,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        isLoading: false,
        isRefreshing: false,
      });

      // Also fetch unread count when getting notifications
      get().fetchUnreadCount();
    } catch (error: any) {
      console.error('❌ Notification store: Fetch notifications error:', error);
      set({
        error: error.message || 'Failed to fetch notifications',
        isLoading: false,
        isRefreshing: false,
        notifications: [],
      });
    }
  },

  /**
   * Fetch unread count
   */
  fetchUnreadCount: async () => {
    try {
      const useCase = container.get<GetUnreadCountUseCase>(TYPES.GetUnreadCountUseCase);
      const count = await useCase.execute();

      console.log('✅ Notification store: Unread count:', count);
      set({ unreadCount: count });
    } catch (error: any) {
      console.error('❌ Notification store: Fetch unread count error:', error);
      // Don't set error for unread count failures as it's not critical
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId: number) => {
    try {
      const useCase = container.get<MarkNotificationAsReadUseCase>(TYPES.MarkNotificationAsReadUseCase);
      await useCase.execute(notificationId);

      console.log('✅ Notification store: Marked as read:', notificationId);

      // Update local state
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      console.error('❌ Notification store: Mark as read error:', error);
      set({ error: error.message || 'Failed to mark notification as read' });
    }
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const useCase = container.get<MarkAllNotificationsAsReadUseCase>(TYPES.MarkAllNotificationsAsReadUseCase);
      await useCase.execute();

      console.log('✅ Notification store: Marked all as read');

      // Update local state
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      console.error('❌ Notification store: Mark all as read error:', error);
      set({ error: error.message || 'Failed to mark all notifications as read' });
    }
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId: number) => {
    try {
      const useCase = container.get<DeleteNotificationUseCase>(TYPES.DeleteNotificationUseCase);
      await useCase.execute(notificationId);

      console.log('✅ Notification store: Deleted notification:', notificationId);

      // Update local state
      const deletedNotification = get().notifications.find((n) => n.id === notificationId);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notificationId),
        unreadCount: deletedNotification && !deletedNotification.isRead 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
        totalElements: Math.max(0, state.totalElements - 1),
      }));
    } catch (error: any) {
      console.error('❌ Notification store: Delete notification error:', error);
      set({ error: error.message || 'Failed to delete notification' });
    }
  },

  /**
   * Get notification by ID
   */
  getNotificationById: async (notificationId: number): Promise<Notification | null> => {
    try {
      const useCase = container.get<GetNotificationByIdUseCase>(TYPES.GetNotificationByIdUseCase);
      const notification = await useCase.execute(notificationId);

      console.log('✅ Notification store: Fetched notification by ID:', notificationId);

      set({ currentNotification: notification });
      return notification;
    } catch (error: any) {
      console.error('❌ Notification store: Get notification by ID error:', error);
      set({ 
        error: error.message || 'Failed to fetch notification',
        currentNotification: null 
      });
      return null;
    }
  },

  /**
   * Refresh notifications (pull-to-refresh)
   */
  refreshNotifications: async () => {
    await get().fetchNotifications({ page: 0, size: 20 });
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null }),

  /**
   * Clear current notification
   */
  clearCurrentNotification: () => set({ currentNotification: null }),
}));

/**
 * Hook for notification helpers and utilities
 */
export const useNotificationHelpers = () => {
  /**
   * Get notification icon based on event type
   */
  const getNotificationIcon = (eventType: NotificationEventType): string => {
    switch (eventType) {
      case NotificationEventType.PROFILE_UPDATE_REQUEST:
        return '👤';
      case NotificationEventType.PROFILE_UPDATE_APPROVED:
        return '✅';
      case NotificationEventType.PROFILE_UPDATE_REJECTED:
        return '❌';
      case NotificationEventType.JOB_POSTING_APPROVED:
        return '📋';
      case NotificationEventType.JOB_POSTING_REJECTED:
        return '🚫';
      case NotificationEventType.APPLICATION_RECEIVED:
        return '📬';
      case NotificationEventType.APPLICATION_STATUS_CHANGED:
        return '🔄';
      case NotificationEventType.ACCOUNT_APPROVED:
        return '🎉';
      case NotificationEventType.ACCOUNT_REJECTED:
        return '⚠️';
      case NotificationEventType.SYSTEM_NOTIFICATION:
        return '🔔';
      case NotificationEventType.TEST_ADMIN_NOTIFICATION:
        return '🧪';
      case NotificationEventType.TEST_RECRUITER_NOTIFICATION:
        return '🧪';
      case NotificationEventType.TEST_CANDIDATE_NOTIFICATION:
        return '🧪';
      case NotificationEventType.PROFILE_VERIFICATION:
        return '🔍';
      default:
        return '📄';
    }
  };

  /**
   * Get priority color
   */
  const getPriorityColor = (priority: NotificationPriority): string => {
    switch (priority) {
      case NotificationPriority.HIGH:
        return '#FF3B30'; // Red
      case NotificationPriority.MEDIUM:
        return '#FF9500'; // Orange
      case NotificationPriority.LOW:
        return '#34C759'; // Green
      default:
        return '#8E8E93'; // Gray
    }
  };

  /**
   * Format relative time
   */
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  /**
   * Get navigation route and params based on notification type
   * Based on backend guide navigation patterns
   */
  const getNavigationInfo = (notification: Notification) => {
    const { eventType, metadata } = notification;
    
    switch (eventType) {
      case NotificationEventType.PROFILE_UPDATE_REQUEST:
        return {
          route: 'AdminReviewRequests',
          params: { requestId: metadata.requestId },
        };
      
      case NotificationEventType.PROFILE_UPDATE_APPROVED:
      case NotificationEventType.PROFILE_UPDATE_REJECTED:
        return {
          route: 'RecruiterProfile',
          params: {},
        };
      
      case NotificationEventType.JOB_POSTING_APPROVED:
      case NotificationEventType.JOB_POSTING_REJECTED:
        return {
          route: 'JobPostingDetail',
          params: { jobId: metadata.jobId },
        };
      
      case NotificationEventType.APPLICATION_RECEIVED:
      case NotificationEventType.APPLICATION_STATUS_CHANGED:
        return {
          route: 'ApplicationDetail',
          params: { 
            applicationId: metadata.applicationId,
            jobId: metadata.jobId 
          },
        };
      
      case NotificationEventType.ACCOUNT_APPROVED:
      case NotificationEventType.ACCOUNT_REJECTED:
        return {
          route: 'Profile',
          params: {},
        };
      
      case NotificationEventType.PROFILE_VERIFICATION:
        return {
          route: 'ProfileVerification',
          params: { requestId: metadata.requestId },
        };
      
      default:
        // Show notification detail for unknown types
        return {
          route: 'NotificationDetail',
          params: { notification },
        };
    }
  };

  return {
    getNotificationIcon,
    getPriorityColor,
    formatRelativeTime,
    getNavigationInfo,
  };
};
import { Notification, NotificationQueryParams, NotificationPageResponse, UnreadCountResponse } from '../models/Notification';

/**
 * Notification repository interface
 * Defines methods for notification data access
 */
export interface NotificationRepo {
  /**
   * Get user's notifications with pagination and filters
   */
  getNotifications(params?: NotificationQueryParams): Promise<NotificationPageResponse>;

  /**
   * Get count of unread notifications
   */
  getUnreadCount(): Promise<number>;

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: number): Promise<void>;

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Promise<void>;

  /**
   * Delete notification
   */
  deleteNotification(notificationId: number): Promise<void>;

  /**
   * Get notification by ID
   */
  getNotificationById(notificationId: number): Promise<Notification>;
}
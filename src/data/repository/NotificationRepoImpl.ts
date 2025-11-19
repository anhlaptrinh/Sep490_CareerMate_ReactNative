import { injectable, inject } from 'inversify';
import { ApiClient } from '../apis/apiClient';
import { TYPES } from '../../di/types';
import { NotificationRepo } from './NotificationRepo';
import { 
  Notification, 
  NotificationQueryParams, 
  NotificationPageResponse, 
  NotificationApiResponse,
  UnreadCountResponse 
} from '../../domain/models/Notification';
import 'reflect-metadata';

/**
 * Notification repository implementation
 * Handles API calls to the notification endpoints
 */
@injectable()
export class NotificationRepoImpl implements NotificationRepo {

  constructor(
    @inject(TYPES.ApiClient) private apiClient: ApiClient
  ) {}

  /**
   * Get user's notifications with pagination and filters
   */
  async getNotifications(params?: NotificationQueryParams): Promise<NotificationPageResponse> {
    try {
      console.log('🔔 NotificationRepo: Fetching notifications with params:', params);
      
      const response = await this.apiClient.get<NotificationApiResponse<NotificationPageResponse>>('/notifications', {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 20,
          isRead: params?.isRead,
          eventType: params?.eventType,
          category: params?.category,
          priority: params?.priority,
        },
      });

      console.log('✅ NotificationRepo: Get notifications response:', {
        code: response.code,
        totalElements: response.result.totalElements,
        contentLength: response.result.content.length
      });

      return response.result;
    } catch (error: any) {
      console.error('❌ NotificationRepo: Get notifications error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }

  /**
   * Get count of unread notifications
   */
  async getUnreadCount(): Promise<number> {
    try {
      console.log('🔔 NotificationRepo: Fetching unread count');
      
      const response = await this.apiClient.get<NotificationApiResponse<number>>('/notifications/unread-count');

      console.log('✅ NotificationRepo: Unread count response:', response.result);

      return response.result;
    } catch (error: any) {
      console.error('❌ NotificationRepo: Get unread count error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch unread count');
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number): Promise<void> {
    try {
      console.log('🔔 NotificationRepo: Marking notification as read:', notificationId);
      
      const response = await this.apiClient.put<NotificationApiResponse<void>>(`/notifications/${notificationId}/read`);

      console.log('✅ NotificationRepo: Mark as read response:', response.code);
    } catch (error: any) {
      console.error('❌ NotificationRepo: Mark as read error:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      console.log('🔔 NotificationRepo: Marking all notifications as read');
      
      const response = await this.apiClient.put<NotificationApiResponse<void>>('/notifications/mark-all-read');

      console.log('✅ NotificationRepo: Mark all as read response:', response.code);
    } catch (error: any) {
      console.error('❌ NotificationRepo: Mark all as read error:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: number): Promise<void> {
    try {
      console.log('🔔 NotificationRepo: Deleting notification:', notificationId);
      
      const response = await this.apiClient.delete<NotificationApiResponse<void>>(`/notifications/${notificationId}`);

      console.log('✅ NotificationRepo: Delete notification response:', response.code);
    } catch (error: any) {
      console.error('❌ NotificationRepo: Delete notification error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete notification');
    }
  }

  /**
   * Get notification by ID
   */
  async getNotificationById(notificationId: number): Promise<Notification> {
    try {
      console.log('🔔 NotificationRepo: Fetching notification by ID:', notificationId);
      
      const response = await this.apiClient.get<NotificationApiResponse<Notification>>(`/notifications/${notificationId}`);

      console.log('✅ NotificationRepo: Get notification by ID response:', {
        code: response.code,
        notificationId: response.result.id
      });

      return response.result;
    } catch (error: any) {
      console.error('❌ NotificationRepo: Get notification by ID error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch notification');
    }
  }
}
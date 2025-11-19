import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { NotificationRepo } from '../../data/repository/NotificationRepo';
import { NotificationPageResponse, NotificationQueryParams } from '../models/Notification';
import 'reflect-metadata';

/**
 * Use case for getting user's notifications with pagination
 */
@injectable()
export class GetNotificationsUseCase {
  constructor(
    @inject(TYPES.NotificationRepo) private notificationRepo: NotificationRepo
  ) {}

  async execute(params?: NotificationQueryParams): Promise<NotificationPageResponse> {
    console.log('📄 GetNotificationsUseCase: Executing with params:', params);
    
    try {
      const result = await this.notificationRepo.getNotifications(params);
      console.log('✅ GetNotificationsUseCase: Successfully fetched notifications');
      return result;
    } catch (error: any) {
      console.error('❌ GetNotificationsUseCase: Error:', error.message);
      throw error;
    }
  }
}
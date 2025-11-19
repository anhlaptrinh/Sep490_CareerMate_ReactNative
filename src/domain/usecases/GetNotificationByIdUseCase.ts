import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { NotificationRepo } from '../../data/repository/NotificationRepo';
import { Notification } from '../models/Notification';
import 'reflect-metadata';

/**
 * Use case for getting notification by ID
 */
@injectable()
export class GetNotificationByIdUseCase {
  constructor(
    @inject(TYPES.NotificationRepo) private notificationRepo: NotificationRepo
  ) {}

  async execute(notificationId: number): Promise<Notification> {
    console.log('🔍 GetNotificationByIdUseCase: Executing for ID:', notificationId);
    
    try {
      const result = await this.notificationRepo.getNotificationById(notificationId);
      console.log('✅ GetNotificationByIdUseCase: Successfully fetched notification');
      return result;
    } catch (error: any) {
      console.error('❌ GetNotificationByIdUseCase: Error:', error.message);
      throw error;
    }
  }
}
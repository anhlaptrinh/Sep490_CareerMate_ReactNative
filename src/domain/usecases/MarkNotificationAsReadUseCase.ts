import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { NotificationRepo } from '../../data/repository/NotificationRepo';
import 'reflect-metadata';

/**
 * Use case for marking notification as read
 */
@injectable()
export class MarkNotificationAsReadUseCase {
  constructor(
    @inject(TYPES.NotificationRepo) private notificationRepo: NotificationRepo
  ) {}

  async execute(notificationId: number): Promise<void> {
    console.log('✅ MarkNotificationAsReadUseCase: Executing for notification:', notificationId);
    
    try {
      await this.notificationRepo.markAsRead(notificationId);
      console.log('✅ MarkNotificationAsReadUseCase: Successfully marked as read');
    } catch (error: any) {
      console.error('❌ MarkNotificationAsReadUseCase: Error:', error.message);
      throw error;
    }
  }
}
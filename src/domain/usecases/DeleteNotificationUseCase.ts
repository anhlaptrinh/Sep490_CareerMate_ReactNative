import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { NotificationRepo } from '../../data/repository/NotificationRepo';
import 'reflect-metadata';

/**
 * Use case for deleting notification
 */
@injectable()
export class DeleteNotificationUseCase {
  constructor(
    @inject(TYPES.NotificationRepo) private notificationRepo: NotificationRepo
  ) {}

  async execute(notificationId: number): Promise<void> {
    console.log('🗑️ DeleteNotificationUseCase: Executing for notification:', notificationId);
    
    try {
      await this.notificationRepo.deleteNotification(notificationId);
      console.log('✅ DeleteNotificationUseCase: Successfully deleted notification');
    } catch (error: any) {
      console.error('❌ DeleteNotificationUseCase: Error:', error.message);
      throw error;
    }
  }
}
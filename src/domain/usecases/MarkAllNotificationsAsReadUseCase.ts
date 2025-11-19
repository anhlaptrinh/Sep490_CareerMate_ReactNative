import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { NotificationRepo } from '../../data/repository/NotificationRepo';
import 'reflect-metadata';

/**
 * Use case for marking all notifications as read
 */
@injectable()
export class MarkAllNotificationsAsReadUseCase {
  constructor(
    @inject(TYPES.NotificationRepo) private notificationRepo: NotificationRepo
  ) {}

  async execute(): Promise<void> {
    console.log('✅ MarkAllNotificationsAsReadUseCase: Executing');
    
    try {
      await this.notificationRepo.markAllAsRead();
      console.log('✅ MarkAllNotificationsAsReadUseCase: Successfully marked all as read');
    } catch (error: any) {
      console.error('❌ MarkAllNotificationsAsReadUseCase: Error:', error.message);
      throw error;
    }
  }
}
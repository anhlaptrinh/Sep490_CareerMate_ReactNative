import { injectable, inject } from 'inversify';
import { TYPES } from '../../di/types';
import { NotificationRepo } from '../../data/repository/NotificationRepo';
import 'reflect-metadata';

/**
 * Use case for getting unread notification count
 */
@injectable()
export class GetUnreadCountUseCase {
  constructor(
    @inject(TYPES.NotificationRepo) private notificationRepo: NotificationRepo
  ) {}

  async execute(): Promise<number> {
    console.log('🔢 GetUnreadCountUseCase: Executing');
    
    try {
      const result = await this.notificationRepo.getUnreadCount();
      console.log('✅ GetUnreadCountUseCase: Successfully fetched unread count:', result);
      return result;
    } catch (error: any) {
      console.error('❌ GetUnreadCountUseCase: Error:', error.message);
      throw error;
    }
  }
}
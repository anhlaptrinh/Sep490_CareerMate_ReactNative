import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import {api} from '../data/apis/apiClient';
import * as NavigationService from './NavigationService';

// Define AuthorizationStatus locally for type safety
type AuthorizationStatus =
  | -1 // NOT_DETERMINED
  | 0 // DENIED
  | 1 // AUTHORIZED
  | 2; // PROVISIONAL

// Notification channel configuration
const NOTIFICATION_CHANNEL_ID = 'careermate_default_channel';
const NOTIFICATION_CHANNEL_NAME = 'CareerMate Notifications';
const NOTIFICATION_CHANNEL_DESCRIPTION = 'Notifications for jobs, applications, and updates';

class PushNotificationService {
  private unsubscribeOnMessage?: () => void;
  private unsubscribeOnTokenRefresh?: () => void;
  private channelCreated = false;

  /**
   * Create Android notification channel (required for Android 8.0+)
   */
  private async createNotificationChannel(): Promise<void> {
    if (this.channelCreated || Platform.OS !== 'android') {
      return;
    }

    try {
      await notifee.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: NOTIFICATION_CHANNEL_NAME,
        description: NOTIFICATION_CHANNEL_DESCRIPTION,
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
        badge: true,
      });

      this.channelCreated = true;
      console.log('✅ Notification channel created');
    } catch (error) {
      console.error('❌ Failed to create notification channel:', error);
    }
  }

  /**
   * Initialize push notifications
   * Call this AFTER user logs in
   */
  async initialize(): Promise<void> {
    try {
      console.log('🔔 Initializing push notifications...');

      // Create notification channel first (Android only)
      await this.createNotificationChannel();

      // Request permission
      const authStatus = await this.requestPermission();
      if (authStatus === 1 || authStatus === 2) {
        // AUTHORIZED or PROVISIONAL
        console.log('✅ Permission granted');

        // Get FCM token
        await this.getToken();

        // Setup notification listeners
        this.setupListeners();

        // Handle notification that opened app from quit state
        await this.handleInitialNotification();

        // Setup Notifee foreground service (for notification tap handling)
        this.setupNotifeeListeners();

        console.log('✅ Push notifications initialized successfully');
      } else {
        console.warn('⚠️ Permission denied for push notifications');
      }
    } catch (error) {
      console.error('❌ Failed to initialize push notifications:', error);
      // Don't crash app - fail gracefully
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<number> {
    try {
      const authStatus = await messaging().requestPermission();
      console.log('Permission status:', authStatus);
      return authStatus;
    } catch (error) {
      console.error('Permission request failed:', error);
      return 0; // DENIED
    }
  }

  /**
   * Get FCM token and register with backend
   */
  async getToken(): Promise<string | null> {
    try {
      // Check if device supports FCM
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
      }

      const token = await messaging().getToken();

      if (token) {
        console.log('📱 FCM Token:', token);
        await this.registerTokenWithBackend(token);
        return token;
      } else {
        console.warn('No FCM token available');
        return null;
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  /**
   * Register device token with backend
   */
  private async registerTokenWithBackend(fcmToken: string): Promise<void> {
    try {
      const deviceInfo = {
        token: fcmToken, // ✅ Backend expects 'token', not 'deviceToken'
        deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
        deviceName: await DeviceInfo.getDeviceName(),
        appVersion: DeviceInfo.getVersion(),
        osVersion: DeviceInfo.getSystemVersion(),
      };

      console.log('📤 Registering device token:', deviceInfo);

      const response = await api.post<any>(
        '/device-tokens/register', // ✅ Remove /api prefix - baseURL already includes it
        deviceInfo
      );

      console.log('✅ Device token registered successfully:', response);
    } catch (error: any) {
      console.error('❌ Failed to register device token:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        console.error('Response headers:', error.response.headers);
      }
    }
  }

  /**
   * Unregister device token from backend
   */
  async unregister(): Promise<void> {
    try {
      console.log('🗑️ Unregistering push notifications...');

      const token = await messaging().getToken();

      if (token) {
        // Unregister from backend
        await api.delete('/device-tokens/unregister', { // ✅ Remove /api prefix
          data: {token: token}, // ✅ Use 'token' not 'deviceToken'
        } as any);

        // Delete FCM token
        await messaging().deleteToken();

        console.log('✅ Push notifications unregistered successfully');
      }
    } catch (error) {
      console.error('❌ Failed to unregister push notifications:', error);
    } finally {
      // Cleanup listeners
      this.cleanup();
    }
  }

  /**
   * Setup notification listeners
   */
  private setupListeners(): void {
    // Listen for foreground notifications
    this.unsubscribeOnMessage = messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log('🔔 Foreground notification received:', remoteMessage);
        this.handleForegroundNotification(remoteMessage);
      }
    );

    // Listen for notification tap (when app is in background)
    messaging().onNotificationOpenedApp(
      (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log(
          '🔔 Notification opened app from background:',
          remoteMessage
        );
        this.handleNotificationTap(remoteMessage);
      }
    );

    // Listen for token refresh
    this.unsubscribeOnTokenRefresh = messaging().onTokenRefresh(
      async (token: string) => {
        console.log('🔄 FCM Token refreshed:', token);
        await this.registerTokenWithBackend(token);
      }
    );
  }

  /**
   * Handle notification that opened app from quit state
   */
  private async handleInitialNotification(): Promise<void> {
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage) {
      console.log(
        '🔔 Notification opened app from quit state:',
        remoteMessage
      );
      // Delay navigation to ensure app is fully loaded
      setTimeout(() => {
        this.handleNotificationTap(remoteMessage);
      }, 1000);
    }
  }

  /**
   * Display local notification using Notifee (for background and data-only notifications)
   */
  private async displayLocalNotification(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ): Promise<void> {
    try {
      const {notification, data, messageId} = remoteMessage;

      // Create notification channel if not created yet
      await this.createNotificationChannel();

      // Safely extract title and body
      const title = notification?.title || (typeof data?.title === 'string' ? data.title : 'CareerMate Notification');
      const body = notification?.body || (typeof data?.message === 'string' ? data.message : 'You have a new notification');

      await notifee.displayNotification({
        id: messageId,
        title,
        body,
        android: {
          channelId: NOTIFICATION_CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          smallIcon: 'ic_notification', // Add custom icon in android/app/src/main/res/drawable
          sound: 'default',
          vibrationPattern: [300, 500],
          showTimestamp: true,
        },
        data: data || {},
      });

      console.log('✅ Local notification displayed');
    } catch (error) {
      console.error('❌ Failed to display local notification:', error);
    }
  }

  /**
   * Handle notification data and navigate to appropriate screen
   */
  private handleNotificationData(data: Record<string, any>): void {
    if (!data || !data.eventType) {
      console.warn('⚠️ Invalid notification data - no eventType');
      return;
    }

    const eventType = data.eventType as string;
    const notificationId = data.notificationId as string;

    console.log(`🧭 Navigating for event: ${eventType}`);

    // Navigate based on event type (same logic as handleNotificationTap)
    switch (eventType) {
      case 'APPLICATION_STATUS_CHANGED':
        NavigationService.navigate('NotificationDetail', {
          notificationId,
        });
        break;

      case 'JOB_POSTING_APPROVED':
      case 'JOB_POSTING_REJECTED':
        NavigationService.navigate('Job');
        break;

      case 'NEW_BLOG_POST':
        const blogId = data.blogId;
        if (blogId) {
          NavigationService.navigate('BlogDetail', {blogId});
        } else {
          NavigationService.navigate('Blog');
        }
        break;

      case 'COMPANY_VERIFIED':
        NavigationService.navigate('Company');
        break;

      case 'SYSTEM_ANNOUNCEMENT':
      case 'NEW_JOB_MATCH':
      case 'INTERVIEW_SCHEDULED':
      default:
        // Navigate to notifications list
        NavigationService.navigate('Notification');
        break;
    }
  }

  /**
   * Setup Notifee event listeners for notification interaction
   */
  private setupNotifeeListeners(): void {
    // Foreground notification tap
    notifee.onForegroundEvent(({type, detail}) => {
      console.log('🔔 Notifee foreground event:', type);

      if (type === EventType.PRESS && detail.notification) {
        const data = detail.notification.data as Record<string, any>;
        if (data) {
          this.handleNotificationData(data);
        }
      }
    });

    // Background notification tap
    notifee.onBackgroundEvent(async ({type, detail}) => {
      console.log('🔔 Notifee background event:', type);

      if (type === EventType.PRESS && detail.notification) {
        const data = detail.notification.data as Record<string, any>;
        if (data) {
          this.handleNotificationData(data);
        }
      }
    });
  }

  /**
   * Handle foreground notification (display using Notifee for consistency)
   */
  private async handleForegroundNotification(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ): Promise<void> {
    const {notification, data} = remoteMessage;

    // For foreground, display notification using Notifee
    // This ensures consistent behavior and allows tap handling
    await this.displayLocalNotification(remoteMessage);

    // Optionally show alert for immediate attention (can be removed if not needed)
    if (notification && data?.eventType) {
      // Only show alert if it's an important notification with eventType
      Alert.alert(
        notification.title || 'Notification',
        notification.body || '',
        [
          {
            text: 'Dismiss',
            style: 'cancel',
          },
          {
            text: 'View',
            onPress: () => this.handleNotificationTap(remoteMessage),
          },
        ]
      );
    }
  }

  /**
   * Handle notification tap - navigate to appropriate screen
   */
  private handleNotificationTap(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ): void {
    const {data} = remoteMessage;

    if (!data || !data.eventType) {
      console.warn('⚠️ Invalid notification data - no eventType');
      return;
    }

    const eventType = data.eventType as string;
    const notificationId = data.notificationId as string;

    console.log(`🧭 Navigating for event: ${eventType}`);

    // Navigate based on event type
    switch (eventType) {
      case 'APPLICATION_STATUS_CHANGED':
        NavigationService.navigate('NotificationDetail', {
          notificationId,
        });
        break;

      case 'JOB_POSTING_APPROVED':
      case 'JOB_POSTING_REJECTED':
        NavigationService.navigate('Job');
        break;

      case 'NEW_BLOG_POST':
        const blogId = data.blogId;
        if (blogId) {
          NavigationService.navigate('BlogDetail', {blogId});
        } else {
          NavigationService.navigate('Blog');
        }
        break;

      case 'COMPANY_VERIFIED':
        NavigationService.navigate('Company');
        break;

      case 'SYSTEM_ANNOUNCEMENT':
      case 'NEW_JOB_MATCH':
      case 'INTERVIEW_SCHEDULED':
      default:
        // Navigate to notifications list
        NavigationService.navigate('Notification');
        break;
    }
  }

  /**
   * Cleanup listeners
   */
  private cleanup(): void {
    if (this.unsubscribeOnMessage) {
      this.unsubscribeOnMessage();
      this.unsubscribeOnMessage = undefined;
    }
    if (this.unsubscribeOnTokenRefresh) {
      this.unsubscribeOnTokenRefresh();
      this.unsubscribeOnTokenRefresh = undefined;
    }
  }

  /**
   * Check if notifications are enabled
   */
  async checkPermission(): Promise<boolean> {
    const authStatus = await messaging().hasPermission();
    return authStatus === 1 || authStatus === 2; // AUTHORIZED or PROVISIONAL
  }

  /**
   * Open device settings to enable notifications
   */
  async openSettings(): Promise<void> {
    const {Linking} = await import('react-native');
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Failed to open settings:', error);
    }
  }
}

// Export singleton instance
export default new PushNotificationService();

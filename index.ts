import { registerRootComponent } from 'expo';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';

import App from './App';
import "reflect-metadata";

// Notification channel configuration (must match PushNotificationService)
const NOTIFICATION_CHANNEL_ID = 'careermate_default_channel';
const NOTIFICATION_CHANNEL_NAME = 'CareerMate Notifications';

// ✅ Register background message handler at app start (MUST be at top level)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('🔔 Background notification received:', remoteMessage);
  
  // Display notification in system tray using Notifee
  try {
    // Create channel if needed
    await notifee.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: NOTIFICATION_CHANNEL_NAME,
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });

    const {notification, data, messageId} = remoteMessage;

    // Safely extract title and body
    const title = notification?.title || (typeof data?.title === 'string' ? data.title : 'CareerMate Notification');
    const body = notification?.body || (typeof data?.message === 'string' ? data.message : 'You have a new notification');

    // Display notification
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
        sound: 'default',
        vibrationPattern: [300, 500],
        showTimestamp: true,
      },
      data: data || {},
    });

    console.log('✅ Background notification displayed');
  } catch (error) {
    console.error('❌ Failed to display background notification:', error);
  }
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

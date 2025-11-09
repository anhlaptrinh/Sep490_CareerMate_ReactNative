import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notificationStyles } from '../styles/NotificationStyles';

interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Jobs Today - Click Now',
    content: 'CareerMate has many new IT job opportunities for you. Explore now!',
    date: '08-11-2025 16:00:00',
    isRead: false,
  },
  {
    id: '2',
    title: 'Welcome Le Quang Anh. Thanks for signing up on CareerMate. CareerMate will help you:',
    content: '- Create a professional Developer CV >>\n- Find suitable IT jobs >>\n- Discover IT company environments in Vietnam >>',
    date: '07-11-2025 22:53:42',
    isRead: true,
  },
];

export default function NotificationScreen({ navigation }: any) {
  const styles = notificationStyles;
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3DD5DC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Ionicons name="checkmark-done" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {mockNotifications.map((notification) => (
          <TouchableOpacity 
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.isRead && styles.unreadCard
            ]}
          >
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationContent}>{notification.content}</Text>
            <Text style={styles.notificationDate}>{notification.date}</Text>
          </TouchableOpacity>
        ))}

        {/* Empty space for bottom tab */}
        <View style={{ height: Platform.OS === 'ios' ? 100 : 80 }} />
      </ScrollView>
    </View>
  );
}

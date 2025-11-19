import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigation from './AuthNavigation';
import InAppNavigation from './InAppNavigation';
import NotificationScreen from '../pages/Notification';
import NotificationDetailScreen from '../pages/NotificationDetail';
import { NotificationTestPage } from '../pages/NotificationTest';
import BlogDetailScreen from '../pages/BlogDetail';

const RootStack = createNativeStackNavigator();

/**
 * AppNavigation - Root Stack Navigator
 * Quản lý navigation giữa Auth flow và Main app flow
 * 
 * Structure:
 * - Auth: Stack Navigator (Welcome, Login, SignUp)
 * - MainApp: Bottom Tabs Navigator (Jobs, Companies, Blog, Tools, Profile)
 * - Notification: Modal screen
 */
export default function AppNavigation() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {/* Auth Flow - Stack Navigator */}
      <RootStack.Screen
        name="Auth"
        component={AuthNavigation}
        options={{
          animation: 'fade',
        }}
      />

      {/* Main App Flow - Bottom Tabs Navigator */}
      <RootStack.Screen
        name="MainApp"
        component={InAppNavigation}
        options={{
          animation: 'fade',
        }}
      />

      {/* Modal Screens */}
      <RootStack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />

      {/* Notification Test Screen */}
      <RootStack.Screen
        name="NotificationTest"
        component={NotificationTestPage}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
          headerShown: true,
          title: 'Notification Test',
        }}
      />

      {/* Notification Detail Screen */}
      <RootStack.Screen
        name="NotificationDetail"
        component={NotificationDetailScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />

      {/* Blog Detail Screen */}
      <RootStack.Screen
        name="BlogDetail"
        component={BlogDetailScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </RootStack.Navigator>
  );
}

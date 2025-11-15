import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigation from './AuthNavigation';
import InAppNavigation from './InAppNavigation';
import NotificationScreen from '../pages/Notification';

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
    </RootStack.Navigator>
  );
}

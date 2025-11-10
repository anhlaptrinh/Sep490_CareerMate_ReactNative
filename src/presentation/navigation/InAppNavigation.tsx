import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import JobScreen from '../pages/Job';
import CompanyScreen from '../pages/Company';
import BlogScreen from '../pages/Blog';
import ToolsScreen from '../pages/Tools';
import ProfileScreen from '../pages/Profile';

const Tab = createBottomTabNavigator();

/**
 * InAppNavigation - Bottom Tabs Navigator cho màn hình chính
 * Bao gồm: Jobs, Companies, Blog, Tools, Profile
 */
export default function InAppNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'JobTab':
              iconName = focused ? 'briefcase' : 'briefcase-outline';
              break;
            case 'CompanyTab':
              iconName = focused ? 'business' : 'business-outline';
              break;
            case 'BlogTab':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            case 'ToolsTab':
              iconName = focused ? 'options' : 'options-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00B8C5',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 85 : 60,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
      })}
    >
      <Tab.Screen 
        name="JobTab" 
        component={JobScreen}
        options={{ tabBarLabel: 'Jobs' }}
      />
      <Tab.Screen 
        name="CompanyTab" 
        component={CompanyScreen}
        options={{ tabBarLabel: 'Companies' }}
      />
      <Tab.Screen 
        name="BlogTab" 
        component={BlogScreen}
        options={{ tabBarLabel: 'Blog' }}
      />
      <Tab.Screen 
        name="ToolsTab" 
        component={ToolsScreen}
        options={{ tabBarLabel: 'Tools' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Account' }}
      />
    </Tab.Navigator>
  );
}

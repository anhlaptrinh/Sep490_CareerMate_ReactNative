import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './src/presentation/pages/Login';
import SignUpScreen from './src/presentation/pages/SignUp';
import WelcomeScreen from './src/presentation/pages/Welcome';
import JobScreen from './src/presentation/pages/Job';
import CompanyScreen from './src/presentation/pages/Company';
import BlogScreen from './src/presentation/pages/Blog';
import ToolsScreen from './src/presentation/pages/Tools';
import ProfileScreen from './src/presentation/pages/Profile';
import NotificationScreen from './src/presentation/pages/Notification';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator for authenticated users
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'JobTab') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'CompanyTab') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'BlogTab') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'ToolsTab') {
            iconName = focused ? 'options' : 'options-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
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

export default function App() {
  return ( 
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth Stack */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        
        {/* Main App with Tabs */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        
        {/* Notification Screen - Keep bottom tabs visible */}
        <Stack.Screen 
          name="Notification" 
          component={NotificationScreen}
          options={{
            presentation: 'card',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}                                                                                         
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../pages/Welcome';
import LoginScreen from '../pages/Login';
import SignUpScreen from '../pages/SignUp';

const AuthStack = createNativeStackNavigator();

/**
 * AuthNavigation - Stack Navigator cho các màn hình xác thực
 * Bao gồm: Welcome, Login, SignUp
 */
export default function AuthNavigation() {
  return (
    <AuthStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <AuthStack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{
          animation: 'fade',
        }}
      />
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen}
      />
      <AuthStack.Screen 
        name="SignUp" 
        component={SignUpScreen}
      />
    </AuthStack.Navigator>
  );
}

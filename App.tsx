import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/presentation/navigation/AppNavigation';

// Clear stored tokens for testing purposes
import * as SecureStore from "expo-secure-store";

SecureStore.deleteItemAsync("auth_access_token");

SecureStore.deleteItemAsync("auth_token_expiry");


export default function App() {
  return (
    <NavigationContainer>
      <AppNavigation />
    </NavigationContainer>
  );
}                                                                                         
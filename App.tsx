import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/presentation/navigation/AppNavigation';
import { navigationRef } from './src/services/NavigationService';
import * as SecureStore from "expo-secure-store";

SecureStore.deleteItemAsync("auth_access_token");
SecureStore.deleteItemAsync("auth_token_expiry");

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppNavigation />
    </NavigationContainer>
  );
}                                                                                         
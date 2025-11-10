/**
 * Navigation Type Definitions
 * Define all navigation params and screen names
 */

import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack Navigation Params
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
};

// InApp Tab Navigation Params
export type InAppTabParamList = {
  JobTab: undefined;
  CompanyTab: undefined;
  BlogTab: undefined;
  ToolsTab: undefined;
  ProfileTab: undefined;
};

// Root Stack Navigation Params
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainApp: NavigatorScreenParams<InAppTabParamList>;
  Notification: undefined;
};

// Navigation Prop Types for each navigator
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

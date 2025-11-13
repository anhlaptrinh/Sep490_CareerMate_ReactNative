import { Alert } from 'react-native';
import { useAuthStore } from '../state/useAuthStore';
import { useNavigation } from '@react-navigation/native';

/**
 * Hook to require authentication before performing an action
 * Returns a function that wraps the action with auth check
 * 
 * Usage:
 * const withAuth = useRequireAuth();
 * 
 * const handleSaveJob = withAuth(async () => {
 *   // This code only runs if user is authenticated
 *   await saveJobApi();
 * });
 */
export const useRequireAuth = () => {
  const navigation = useNavigation<any>();
  const { isAuthenticated } = useAuthStore();

  return <T extends (...args: any[]) => any>(
    action: T,
    message?: string
  ): ((...args: Parameters<T>) => void) => {
    return (...args: Parameters<T>) => {
      if (!isAuthenticated) {
        Alert.alert(
          'Login Required',
          message || 'You need to login to perform this action',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Login',
              onPress: () => navigation.navigate('Auth', { screen: 'Login' }),
            },
          ]
        );
        return;
      }

      // User is authenticated, execute the action
      return action(...args);
    };
  };
};

/**
 * Simple function to check auth and navigate if needed
 * Returns true if authenticated, false otherwise
 * 
 * Usage:
 * if (!checkAuthOrNavigate(navigation)) {
 *   return; // User not authenticated, already showing login prompt
 * }
 * // Continue with protected action
 */
export const checkAuthOrNavigate = (
  navigation: any,
  message?: string
): boolean => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (!isAuthenticated) {
    Alert.alert(
      'Login Required',
      message || 'You need to login to perform this action',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Login',
          onPress: () => navigation.navigate('Auth', { screen: 'Login' }),
        },
      ]
    );
    return false;
  }

  return true;
};

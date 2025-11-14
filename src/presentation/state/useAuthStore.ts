import { create } from 'zustand';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { LoginUseCase } from '../../domain/usecases/LoginUseCase';
import { LogoutUseCase } from '../../domain/usecases/LogoutUseCase';
import { SecureStorage, UserInfo } from '../../utils/SecureStorage';

/**
 * User Interface
 */
interface User {
  fullname: string | null;
  email: string | null;
  userId: string | null;
  avatar?: string | null;
}

/**
 * Authentication State Interface
 */
interface AuthState {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  requireAuth: () => boolean; // Check if user is authenticated, return true if yes
}

/**
 * Zustand Auth Store
 * Manages authentication state globally
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  isLoading: false,
  error: null,
  user: null,

  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const loginUseCase = container.get<LoginUseCase>(TYPES.LoginUseCase);
      const response = await loginUseCase.execute(email, password);

      if (response.result.authenticated) {
        // Get user info from decoded token
        const userInfo = await SecureStorage.getUserInfoFromToken();
        
        set({
          isAuthenticated: true,
          isLoading: false,
          user: userInfo ? {
            fullname: userInfo.fullname,
            email: userInfo.email,
            userId: userInfo.userId,
            avatar: null, // Default avatar - can be customized later
          } : null,
        });
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed';
      set({
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
        user: null,
      });
      console.error('❌ Login error:', errorMessage);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    set({ isLoading: true });
    
    try {
      const logoutUseCase = container.get<LogoutUseCase>(TYPES.LogoutUseCase);
      await logoutUseCase.execute();
      
      set({
        isAuthenticated: false,
        isLoading: false,
        error: null,
        user: null,
      });
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      // Still clear local state even if logout API fails
      set({
        isAuthenticated: false,
        isLoading: false,
        error: null,
        user: null,
      });
    }
  },

  /**
   * Check authentication status on app start
   */
  checkAuth: async () => {
    set({ isLoading: true });
    
    try {
      const hasValidToken = await SecureStorage.hasValidToken();
      
      if (hasValidToken) {
        // Get user info from token
        const userInfo = await SecureStorage.getUserInfoFromToken();
        
        set({
          isAuthenticated: true,
          isLoading: false,
          user: userInfo ? {
            fullname: userInfo.fullname,
            email: userInfo.email,
            userId: userInfo.userId,
            avatar: null,
          } : null,
        });
      } else {
        set({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      }
    } catch (error) {
      console.error('❌ Check auth error:', error);
      set({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  },

  /**
   * Clear error message
   */
  clearError: () => set({ error: null }),

  /**
   * Require authentication - used before protected actions
   * Returns true if authenticated, false if need to login
   */
  requireAuth: () => {
    return get().isAuthenticated;
  },
}));

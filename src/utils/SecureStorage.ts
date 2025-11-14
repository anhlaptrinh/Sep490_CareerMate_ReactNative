import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';

/**
 * JWT Payload Interface
 */
interface JwtPayload {
  sub?: string;
  fullname?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

/**
 * User Info from Token
 */
export interface UserInfo {
  fullname: string | null;
  email: string | null;
  userId: string | null;
}

/**
 * Secure Storage for sensitive data (tokens)
 * Uses expo-secure-store for encrypted storage
 */
export class SecureStorage {
  private static readonly ACCESS_TOKEN_KEY = 'auth_access_token';
  private static readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';

  /**
   * Save access token securely
   */
  static async saveAccessToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error('❌ Failed to save access token:', error);
      throw error;
    }
  }

  /**
   * Get access token
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('❌ Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Save token expiry timestamp (milliseconds)
   */
  static async saveTokenExpiry(expiresIn: number): Promise<void> {
    try {
      const expiryTime = Date.now() + expiresIn * 1000;
      await SecureStore.setItemAsync(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    } catch (error) {
      console.error('❌ Failed to save token expiry:', error);
    }
  }

  /**
   * Get token expiry timestamp
   */
  static async getTokenExpiry(): Promise<number | null> {
    try {
      const expiry = await SecureStore.getItemAsync(this.TOKEN_EXPIRY_KEY);
      return expiry ? parseInt(expiry, 10) : null;
    } catch (error) {
      console.error('❌ Failed to get token expiry:', error);
      return null;
    }
  }

  /**
   * Check if token is expired (with 30s buffer)
   */
  static async isTokenExpired(): Promise<boolean> {
    const expiry = await this.getTokenExpiry();
    if (!expiry) return true;
    
    // Refresh 30 seconds before actual expiry
    return Date.now() >= (expiry - 30000);
  }

  /**
   * Clear all auth data
   */
  static async clearAll(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(this.TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('❌ Failed to clear auth data:', error);
    }
  }

  /**
   * Check if user has valid token
   */
  static async hasValidToken(): Promise<boolean> {
    const token = await this.getAccessToken();
    if (!token) return false;
    
    return !(await this.isTokenExpired());
  }

  /**
   * Decode JWT token and extract user info
   */
  static async getUserInfoFromToken(): Promise<UserInfo | null> {
    try {
      const token = await this.getAccessToken();
      if (!token) return null;

      const decoded = jwtDecode<JwtPayload>(token);
      
      return {
        fullname: decoded.fullname || null,
        email: decoded.email || decoded.sub || null,
        userId: decoded.sub || null,
      };
    } catch (error) {
      console.error('❌ Failed to decode token:', error);
      return null;
    }
  }
}

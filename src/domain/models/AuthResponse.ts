/**
 * Auth Response from backend API
 * Based on actual API response structure
 */
export interface AuthResponse {
  code: number;
  result: {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
    authenticated: boolean;
  };
}

/**
 * Simplified token data for app usage
 */


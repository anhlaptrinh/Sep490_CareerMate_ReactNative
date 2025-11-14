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

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string; // ISO date string
}
/**
 * Simplified token data for app usage
 */



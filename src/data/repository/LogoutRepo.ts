/**
 * Logout Repository Interface
 */
export interface LogoutRepo {
  logout(): Promise<void>;
}

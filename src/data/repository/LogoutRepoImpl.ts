import { injectable, inject } from "inversify";
import { ApiClient } from "../apis/ApiClient";
import { TYPES } from "../../di/types";
import { LogoutRepo } from "./LogoutRepo";
import { SecureStorage } from "../../utils/SecureStorage";
import "reflect-metadata";

@injectable()
class LogoutRepoImpl implements LogoutRepo {
  private apiClient: ApiClient;

  constructor(@inject(TYPES.ApiClient) apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async logout(): Promise<void> {
    try {
      // Call logout API to clear server-side session
      await this.apiClient.post("/api/auth/logout");
    } catch (error) {
      console.warn("⚠️ Logout API failed, but will clear local data anyway");
    } finally {
      // Always clear local storage
      await SecureStorage.clearAll();
    }
  }
}

export { LogoutRepoImpl };

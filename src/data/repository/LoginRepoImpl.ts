
import { AuthResponse } from "../../domain/models/Authentication";
import { ApiClient } from "../apis/apiClient";
import { TYPES } from "../../di/types";
import { LoginRepo } from "./LoginRepo";
import { injectable, inject } from "inversify";
import { SecureStorage } from "../../utils/SecureStorage";
import "reflect-metadata";

@injectable()
class LoginRepoImpl implements LoginRepo {  
    private apiClient: ApiClient;
    
    constructor(@inject(TYPES.ApiClient) apiClient: ApiClient) {
        this.apiClient = apiClient;
    }   
    
    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const body = { email, password };
            const response = await this.apiClient.post<AuthResponse>("/auth/token", body);
            
            // ✅ Save access token and expiry to secure storage
            const { accessToken, expiresIn } = response.result;
            await SecureStorage.saveAccessToken(accessToken);
            await SecureStorage.saveTokenExpiry(expiresIn);
            
            return response;
            
        } catch (error: any) {
            console.error("❌ Login failed:", error);
            console.error("Error details:", {
                message: error?.message,
                code: error?.code,
                response: error?.response?.data
            });
            throw error;
        }
    }   
}

export { LoginRepoImpl };
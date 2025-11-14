import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { injectable } from "inversify";
import { SecureStorage } from "../../utils/SecureStorage";

@injectable()
export class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    const API_URL = Constants.expoConfig?.extra?.API_URL || "http://localhost:8080";

    this.instance = axios.create({
      baseURL: API_URL,
      headers: { "Content-Type": "application/json" },
      timeout: 30000, // Increased to 30s
      withCredentials: false, // Disable for mobile app
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // ✅ REQUEST INTERCEPTOR - Attach access token
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await SecureStorage.getAccessToken();

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ RESPONSE INTERCEPTOR - Handle 401 and refresh token
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Queue the request while refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(async () => {
                const token = await SecureStorage.getAccessToken();
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.instance(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // ✅ Refresh token using HttpOnly cookie
            const { data } = await this.instance.post("/api/auth/refresh");
            const newAccessToken = data.result.accessToken;
            const expiresIn = data.result.expiresIn;

            // Save new token
            await SecureStorage.saveAccessToken(newAccessToken);
            await SecureStorage.saveTokenExpiry(expiresIn);

            // Retry all queued requests
            this.failedQueue.forEach((prom) => prom.resolve());
            this.failedQueue = [];

            // Retry original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return this.instance(originalRequest);

          } catch (refreshError) {
            // Refresh failed - clear auth and reject all queued requests
            console.error("⚠️ Token refresh failed - logging out");
            await SecureStorage.clearAll();
            this.failedQueue.forEach((prom) => prom.reject(refreshError));
            this.failedQueue = [];

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error.response?.data ?? error.message);
      }
    );
  }

  // GET
  async get<T>(url: string, params?: any): Promise<T> {
    const { data } = await this.instance.get<T>(url, { params });
    return data;
  }

  // POST
  async post<T>(url: string, body?: any): Promise<T> {
    const { data } = await this.instance.post<T>(url, body);
    return data;
  }

  // PUT
  async put<T>(url: string, body?: any): Promise<T> {
    const { data } = await this.instance.put<T>(url, body);
    return data;
  }

  // DELETE
  async delete<T>(url: string): Promise<T> {
    const { data } = await this.instance.delete<T>(url);
    return data;
  }

  // Get raw axios instance if needed
  getRawInstance(): AxiosInstance {
    return this.instance;
  }
}

// ✅ export 1 instance dùng chung toàn app
export const api = new ApiClient();

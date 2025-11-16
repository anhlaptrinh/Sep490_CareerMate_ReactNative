import axios, { AxiosInstance } from "axios";
import Constants from "expo-constants";
import { injectable } from "inversify";
import { SecureStorage } from "../../utils/SecureStorage";

@injectable()
export class PythonApiClient {
  private instance: AxiosInstance;

  constructor() {
    const PYTHON_API_URL = Constants.expoConfig?.extra?.PYTHON_API_URL || "http://localhost:8081/api";

    this.instance = axios.create({
      baseURL: PYTHON_API_URL,
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
      withCredentials: false,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // REQUEST INTERCEPTOR - Attach access token
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await SecureStorage.getAccessToken();

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR - Handle errors
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          console.error("⚠️ Python API: Unauthorized");
          // You might want to trigger logout here
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

// Export instance
export const pythonApi = new PythonApiClient();

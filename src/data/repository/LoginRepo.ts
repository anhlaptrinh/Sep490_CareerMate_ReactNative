import { AuthResponse } from "../../domain/models/AuthResponse";


export interface LoginRepo {
  login(email: string, password: string): Promise<AuthResponse>;
}
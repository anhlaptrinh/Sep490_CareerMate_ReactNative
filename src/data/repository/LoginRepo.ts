import { AuthResponse } from "../../domain/models/Authentication";


export interface LoginRepo {
  login(email: string, password: string): Promise<AuthResponse>;
}
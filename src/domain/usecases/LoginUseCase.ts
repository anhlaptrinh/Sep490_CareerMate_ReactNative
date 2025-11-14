import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { AuthResponse } from "../models/Authentication";
import { LoginRepo } from "../../data/repository/LoginRepo";

@injectable()
export class LoginUseCase {
  constructor(@inject(TYPES.LoginRepo) private loginRepo: LoginRepo) {}

  async execute(email: string, password: string): Promise<AuthResponse> {
    const result = await this.loginRepo.login(email, password);
    // Bạn có thể thêm logic validate, lưu token, v.v.
    return result;
  }
}

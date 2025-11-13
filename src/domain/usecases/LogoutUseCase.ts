import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { LogoutRepo } from "../../data/repository/LogoutRepo";

@injectable()
export class LogoutUseCase {
  constructor(@inject(TYPES.LogoutRepo) private logoutRepo: LogoutRepo) {}

  async execute(): Promise<void> {
    await this.logoutRepo.logout();
  }
}

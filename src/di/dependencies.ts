import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { ApiClient } from "../data/apis/apiClient";
import { LoginRepoImpl } from "../data/repository/LoginRepoImpl";
import { LoginRepo } from "../data/repository/LoginRepo";
import { LogoutRepo } from "../data/repository/LogoutRepo";
import { LogoutRepoImpl } from "../data/repository/LogoutRepoImpl";
import { LoginUseCase } from "../domain/usecases/LoginUseCase";
import { LogoutUseCase } from "../domain/usecases/LogoutUseCase";
import { CandidateRepo } from "../data/repository/candidate/CandidateRepo";
import { CandidateRepoImpl } from "../data/repository/candidate/CandidateRepoImpl";
import { JobRepo, JobRepoImpl } from "../data/repository/job";

const container = new Container();

// API
container.bind<ApiClient>(TYPES.ApiClient).to(ApiClient).inSingletonScope();

// Repository
container.bind<LoginRepo>(TYPES.LoginRepo).to(LoginRepoImpl).inSingletonScope();
container.bind<LogoutRepo>(TYPES.LogoutRepo).to(LogoutRepoImpl).inSingletonScope();
container.bind<CandidateRepo>(TYPES.CandidateRepo).to(CandidateRepoImpl).inSingletonScope();
container.bind<JobRepo>(TYPES.JobRepo).to(JobRepoImpl).inSingletonScope();

// UseCase
container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase).inTransientScope();
container.bind<LogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase).inTransientScope();

export { container };

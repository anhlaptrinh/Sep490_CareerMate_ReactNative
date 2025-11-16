import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./types";
import { ApiClient } from "../data/apis/apiClient";
import { PythonApiClient } from "../data/apis/pythonApiClient";
import { LoginRepoImpl } from "../data/repository/LoginRepoImpl";
import { LoginRepo } from "../data/repository/LoginRepo";
import { LogoutRepo } from "../data/repository/LogoutRepo";
import { LogoutRepoImpl } from "../data/repository/LogoutRepoImpl";
import { LoginUseCase } from "../domain/usecases/LoginUseCase";
import { LogoutUseCase } from "../domain/usecases/LogoutUseCase";
import { CandidateRepo } from "../data/repository/candidate/CandidateRepo";
import { CandidateRepoImpl } from "../data/repository/candidate/CandidateRepoImpl";
import { SignUpRepo } from "../data/repository/SignUpRepo";
import { SignUpRepoImpl } from "../data/repository/SignUpRepoImpl";
import { SignUpUseCase } from "../domain/usecases/SignUpUseCase";
import { JobRepo, JobRepoImpl } from "../data/repository/job";
import { CompanyRepo, CompanyRepoImpl } from "../data/repository/company";
import { JdSkillRepo, JdSkillRepoImpl } from "../data/repository/jdskill";
import { AIRepo } from "../data/repository/ai/AIRepo";
import { AIRepoImpl } from "../data/repository/ai/AIRepoImpl";
import { GetJobRecommendationsUseCase } from "../domain/usecases/GetJobRecommendationsUseCase";

const container = new Container();

// API
container.bind<ApiClient>(TYPES.ApiClient).to(ApiClient).inSingletonScope();
container.bind<PythonApiClient>(TYPES.PythonApiClient).to(PythonApiClient).inSingletonScope();

// Repository
container.bind<LoginRepo>(TYPES.LoginRepo).to(LoginRepoImpl).inSingletonScope();
container.bind<LogoutRepo>(TYPES.LogoutRepo).to(LogoutRepoImpl).inSingletonScope();
container.bind<CandidateRepo>(TYPES.CandidateRepo).to(CandidateRepoImpl).inSingletonScope();
container.bind<SignUpRepo>(TYPES.SignUpRepo).to(SignUpRepoImpl).inSingletonScope();
container.bind<JobRepo>(TYPES.JobRepo).to(JobRepoImpl).inSingletonScope();
container.bind<CompanyRepo>(TYPES.CompanyRepo).to(CompanyRepoImpl).inSingletonScope();
container.bind<JdSkillRepo>(TYPES.JdSkillRepo).to(JdSkillRepoImpl).inSingletonScope();
container.bind<AIRepo>(TYPES.AIRepo).to(AIRepoImpl).inSingletonScope();

// UseCase
container.bind<LoginUseCase>(TYPES.LoginUseCase).to(LoginUseCase).inTransientScope();
container.bind<SignUpUseCase>(TYPES.SignUpUseCase).to(SignUpUseCase).inTransientScope();
container.bind<LogoutUseCase>(TYPES.LogoutUseCase).to(LogoutUseCase).inTransientScope();
container.bind<GetJobRecommendationsUseCase>(TYPES.GetJobRecommendationsUseCase).to(GetJobRecommendationsUseCase).inTransientScope();

export { container };

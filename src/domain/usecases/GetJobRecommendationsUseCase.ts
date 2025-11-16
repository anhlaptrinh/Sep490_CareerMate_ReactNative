import { injectable, inject } from "inversify";
import { AIRepo } from "../../data/repository/ai/AIRepo";
import { TYPES } from "../../di/types";
import { JobRecommendationRequest, JobRecommendationResponse } from "../models/AIModels";

@injectable()
export class GetJobRecommendationsUseCase {
  constructor(@inject(TYPES.AIRepo) private aiRepo: AIRepo) {}

  async execute(request: JobRecommendationRequest): Promise<JobRecommendationResponse> {
    return await this.aiRepo.getJobRecommendations(request);
  }
}

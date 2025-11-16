import { JobRecommendationRequest, JobRecommendationResponse } from "../../../domain/models/AIModels";

export interface AIRepo {
  getJobRecommendations(request: JobRecommendationRequest): Promise<JobRecommendationResponse>;
}

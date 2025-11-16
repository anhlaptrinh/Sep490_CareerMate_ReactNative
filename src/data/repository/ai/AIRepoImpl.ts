import { injectable, inject } from "inversify";
import { PythonApiClient } from "../../apis/pythonApiClient";
import { TYPES } from "../../../di/types";
import { AIRepo } from "./AIRepo";
import { JobRecommendationRequest, JobRecommendationResponse } from "../../../domain/models/AIModels"
import "reflect-metadata";

@injectable()
export class AIRepoImpl implements AIRepo {
  private pythonApi: PythonApiClient;

  constructor(@inject(TYPES.PythonApiClient) pythonApi: PythonApiClient) {
    this.pythonApi = pythonApi;
  }

  async getJobRecommendations(request: JobRecommendationRequest): Promise<JobRecommendationResponse> {
    try {
      const response = await this.pythonApi.post<JobRecommendationResponse>(
        "/v1/jobs/job-postings/",
        request
      );
      return response;
    } catch (error: any) {
      console.error("Error getting job recommendations:", error);
      throw error;
    }
  }
}

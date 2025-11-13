
//implement candidate repo
import { CandidateRequest, CandidateResponse } from "../../../domain/models/Candidate";
import { ApiClient } from "../../apis/ApiClient";
import { TYPES } from "../../../di/types";
import { CandidateRepo } from "./CandidateRepo";
import { injectable, inject } from "inversify";
import "reflect-metadata";

@injectable()
class CandidateRepoImpl implements CandidateRepo {
    private apiClient: ApiClient;

    constructor(@inject(TYPES.ApiClient) apiClient: ApiClient) {
        this.apiClient = apiClient;
    }
    async createCandidate(candidate: CandidateRequest): Promise<void> {
        await this.apiClient.post("/candidates", candidate);
    }

    async getMyProfile(): Promise<CandidateResponse> {
        try {
            const response = await this.apiClient.get<CandidateResponse>("/candidates/profiles/current");
            return response;
        } catch (error) {
            console.error("Error fetching candidate profile:", error);
            throw error;
        }
    }

    async updateCandidate(id: string, candidate: CandidateRequest): Promise<void> {
        await this.apiClient.put(`/candidates/${id}`, candidate);
    }

    async deleteCandidate(id: string): Promise<void> {
        await this.apiClient.delete(`/candidates/${id}`);
    }
}

export { CandidateRepoImpl };
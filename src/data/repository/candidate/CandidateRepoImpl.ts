
//implement candidate repo
import { CandidateRequest, CandidateResponse, JobApplicationsResponse, JobApplicationStatus } from "../../../domain/models/Candidate";
import { ApiClient } from "../../apis/apiClient";
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
    
    async getMyJobs(candidateId: number, status?: JobApplicationStatus, page: number = 0, size: number = 10): Promise<JobApplicationsResponse> {
        try {
            let url = `/job-apply/candidate/${candidateId}?page=${page}&size=${size}`;
            if (status) {
                url += `&status=${status}`;
            }
            const response = await this.apiClient.get<JobApplicationsResponse>(url);
            console.log("Job applications response:", response);
            return response;
        } catch (error) {
            console.error("Error fetching job applications:", error);
            throw error;
        }
    }
    async createCandidate(candidate: CandidateRequest): Promise<void> {
        await this.apiClient.post("/candidates", candidate);
    }

    async getMyProfile(): Promise<CandidateResponse> {
        try {
            const response = await this.apiClient.get<CandidateResponse>("/candidates/profiles/current");
            console.log("Profile response:", response);
            return response;
        } catch (error) {
            console.error("Error fetching candidate profile:", error);
            throw error;
        }
    }

    async updateCandidate(candidate: CandidateRequest): Promise<void> {
        await this.apiClient.put(`/candidates/profiles`, candidate);
    }

    async deleteCandidate(id: string): Promise<void> {
        await this.apiClient.delete(`/candidates/${id}`);
    }
}

export { CandidateRepoImpl };
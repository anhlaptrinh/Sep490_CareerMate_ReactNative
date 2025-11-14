import { CandidateRequest, CandidateResponse, JobApplicationsResponse, JobApplicationStatus } from "../../../domain/models/Candidate";


export interface CandidateRepo {
    createCandidate(candidate: CandidateRequest): Promise<void>;
    getMyProfile(): Promise<CandidateResponse>;
    updateCandidate(candidate: CandidateRequest): Promise<void>;
    getMyJobs(candidateId: number, status?: JobApplicationStatus, page?: number, size?: number): Promise<JobApplicationsResponse>;
    deleteCandidate(id: string): Promise<void>;
}
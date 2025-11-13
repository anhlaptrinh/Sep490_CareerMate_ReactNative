import { CandidateRequest, CandidateResponse } from "../../../domain/models/Candidate";


export interface CandidateRepo {
    createCandidate(candidate: CandidateRequest): Promise<void>;
    getMyProfile(): Promise<CandidateResponse | null>;
    updateCandidate(id: string, candidate: CandidateRequest): Promise<void>;
    deleteCandidate(id: string): Promise<void>;
}
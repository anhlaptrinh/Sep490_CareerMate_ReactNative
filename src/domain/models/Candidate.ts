
export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface CandidateRequest {
    dob: string; // ISO date string, ví dụ "2000-01-01"
    title: string;
    fullName: string;
    phone: string;
    address: string;
    image?: string; // optional field
    gender: Gender;
    link?: string;  
}

export interface CandidateData {
  candidateId: number;
  dob: string;
  title: string;
  fullName: string;
  phone: string;
  address: string;
  image?: string | null;
  gender: string; // Backend returns string, not enum
  link?: string | null;
}

export interface CandidateResponse {
  code: number;
  result: CandidateData;
}

export type JobApplicationStatus = "SUBMITTED" | "REVIEWING" | "APPROVED" | "REJECTED" | "BANNED";

export interface JobApplicationData {
  id: number;
  jobPostingId: number;
  jobTitle: string;
  jobDescription: string;
  expirationDate: string;
  candidateId: number;
  cvFilePath: string;
  fullName: string;
  phoneNumber: string;
  preferredWorkLocation: string;
  coverLetter: string;
  status: JobApplicationStatus;
  createAt: string;
}

export interface JobApplicationsResponse {
  code: number;
  message: string;
  result: JobApplicationData[] | {
    content: JobApplicationData[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

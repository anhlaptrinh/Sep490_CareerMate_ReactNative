// Job Repository Interface - Data Layer contract
import { JobsApiResponse, JobPosting } from "../../../domain/models/JobModel";

export interface JobRepo {
  getJobs(page?: number, size?: number, sortBy?: string, sortDir?: string): Promise<JobsApiResponse>;
  getJobById(jobId: number): Promise<JobPosting>;
}

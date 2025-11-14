/**
 * Get Jobs UseCase - Domain Layer
 * Chứa business logic xử lý dữ liệu jobs
 */

import { JobPosting, MappedJob } from '../models/JobModel';

/**
 * Map API response jobs thành format phù hợp với UI
 * @param jobs - Array các job từ API
 * @returns Array các job đã format
 */
export const mapJobsForUI = (jobs: JobPosting[]): MappedJob[] => {
  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.recruiterInfo.companyName,
    description: job.description,
    about: job.recruiterInfo.about,
    logoUrl: job.recruiterInfo.logoUrl,
    website: job.recruiterInfo.website,
    salary: job.salaryRange,
    location: job.address,
    workModel: job.workModel,
    // Format skills với star nếu mustToHave = true
    tags: job.skills.map((s) => `${s.mustToHave ? '⭐ ' : ''}${s.name}`),
    postedTime: job.postTime,
    expirationDate: job.expirationDate,
    yearsOfExperience: job.yearsOfExperience,
  }));
};

/**
 * Filter jobs theo page size
 * @param jobs - Array các job
 * @param pageSize - Số lượng job trên một trang
 * @returns Array các job đã filter
 */
export const getPaginatedJobs = (jobs: JobPosting[], pageSize: number): JobPosting[] => {
  return jobs.slice(0, pageSize);
};

/**
 * Group jobs by company name
 * @param jobs - Array các job
 * @returns Object chứa các job theo company
 */
export const groupJobsByCompany = (
  jobs: MappedJob[]
): Record<
  string,
  {
    id: number;
    name: string;
    about: string;
    jobCount: number;
    tags: string[];
    logoUrl: string;
    website: string;
  }
> => {
  return jobs.reduce(
    (acc, job) => {
      if (!acc[job.company]) {
        acc[job.company] = {
          id: job.id,
          name: job.company,
          about: job.about.length > 100 ? job.about.slice(0, 100) + '...' : job.about,
          jobCount: 1,
          tags: job.tags,
          logoUrl: job.logoUrl,
          website: job.website,
        };
      } else {
        acc[job.company].jobCount += 1;
      }
      return acc;
    },
    {} as Record<
      string,
      {
        id: number;
        name: string;
        about: string;
        jobCount: number;
        tags: string[];
        logoUrl: string;
        website: string;
      }
    >
  );
};

/**
 * Job Models - Domain Layer
 * Định nghĩa các kiểu dữ liệu/entity độc lập với framework
 */

// ✅ Skill Model
export interface Skill {
  id: number;
  name: string;
  mustToHave: boolean;
}

// ✅ Recruiter/Company Info Model
export interface RecruiterInfo {
  recruiterId: number;
  companyName: string;
  website: string;
  logoUrl: string;
  about: string;
}

// ✅ Job Posting Model
export interface JobPosting {
  id: number;
  title: string;
  description: string;
  address: string;
  expirationDate: string;
  postTime: string;
  skills: Skill[];
  yearsOfExperience: number;
  workModel: string;
  salaryRange: string;
  recruiterInfo: RecruiterInfo;
}

// ✅ API Response Model
export interface JobsApiResponse {
  result: {
    content: JobPosting[];
    totalElements?: number;
    totalPages?: number;
    currentPage?: number;
  };
}

// ✅ Mapped Job Model for UI (simplified)
export interface MappedJob {
  id: number;
  title: string;
  company: string;
  description: string;
  about: string;
  logoUrl: string;
  website: string;
  salary: string;
  location: string;
  workModel: string;
  tags: string[];
  postedTime: string;
  expirationDate: string;
  yearsOfExperience: number;
}

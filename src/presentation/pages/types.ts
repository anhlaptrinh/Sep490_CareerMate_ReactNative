
export type Skill = {
  id: number;
  name: string;
  mustToHave: boolean;
};

export type Job = {
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
  reason?: string;
  jobPackage?: string;
  recruiterInfo: {
    recruiterId: number;
    companyName: string;
    website: string;
    logoUrl: string;
    about: string;
  };
};

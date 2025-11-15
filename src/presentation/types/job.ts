export interface JobsTabProps {
  companyJobs: any[];
  selectedJobId: number | null;
  isLoadingJobs: boolean;
  error: string | null;
  hasMoreJobs: boolean;
  onJobPress: (jobId: number) => void;
  onPressIn: (jobId: number) => void;
  onPressOut: () => void;
  onViewMore: () => void;
}
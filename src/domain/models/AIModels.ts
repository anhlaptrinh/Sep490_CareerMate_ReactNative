// AI Job Recommendation Models

export interface JobRecommendationRequest {
  candidate_id: number;
  skills: string[];
  title: string;
  description: string;
  top_n: number;
}

export interface SourceWeight {
  content: number;
  cf: number;
}

export interface JobRecommendationItem {
  job_id: number;
  title: string;
  skills: string[] | string;  // Can be array or comma-separated string
  description: string;
  semantic_similarity: number;
  skill_overlap: number;
  title_boost: number;
  similarity: number;
  final_score: number;
  source_weight: SourceWeight;
}

export interface JobRecommendationResponse {
  ok: boolean;
  results: {
    content_based: JobRecommendationItem[];
  };
}

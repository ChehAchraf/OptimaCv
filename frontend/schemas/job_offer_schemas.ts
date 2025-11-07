export interface JobOffer {
  title: string;
  company: string;
  description: string;
  requirements: string;
  skills: string[];
  location?: string;
  jobType?: string; // full-time, part-time, contract, etc.
}

export interface OptimizationRequest {
  jobOffer: JobOffer;
  originalText: string;
  type: 'experience' | 'project';
}

export interface OptimizationResponse {
  optimizedText: string;
  improvements: string[];
  matchScore: number;
}
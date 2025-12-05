/**
 * Enterprise HR Types
 * Types for the enterprise CV management and analysis module
 */

export interface EnterpriseCV {
    id: string;
    user_id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    candidate_name: string | null;
    candidate_email: string | null;
    status: 'pending' | 'analyzed' | 'archived';
    tags: string[];
    metadata: Record<string, unknown>;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}

export interface EnterpriseAnalysis {
    id: string;
    user_id: string;
    job_description: string;
    job_title: string | null;
    cv_ids: string[];
    results: EnterpriseAnalysisResult[];
    total_cvs: number;
    analyzed_count: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface EnterpriseAnalysisResult {
    id: string;
    analysis_id: string;
    cv_id: string;
    match_score: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    detailed_analysis: {
        hard_skills?: Array<{ skill: string; match: string; comment: string }>;
        soft_skills?: Array<{ skill: string; match: string; comment: string }>;
        experience?: Array<{ requirement: string; match: string; comment: string }>;
    };
    rank: number;
    created_at: string;
    // Joined data
    cv?: EnterpriseCV;
}

export interface CreateEnterpriseCVPayload {
    file_name: string;
    file_path: string;
    file_size: number;
    mime_type?: string;
    candidate_name?: string;
    candidate_email?: string;
    tags?: string[];
}

export interface CreateEnterpriseAnalysisPayload {
    job_description: string;
    job_title?: string;
    cv_ids: string[];
}

export interface EnterpriseCVFilters {
    status?: 'pending' | 'analyzed' | 'archived';
    search?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
}

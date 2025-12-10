import { User } from "@supabase/supabase-js";
import { LucideIcon } from "lucide-react";

export interface AnalysisResult {
    filename: string;
    filename_pdf?: string;
    filename_image?: string;
    analysis?: Analysis;
    recruiter_analysis?: RecruiterAnalysis; // Added
    analysis_vs_jd?: Analysis; // Backward compatibility
    cv_coach_analysis?: CVCoachAnalysis;
    visual_analysis?: any;
};

export interface CVCoachAnalysis {
    overall_score: number;
    score_breakdown: {
        impact: number;
        brevity: number;
        style: number;
        structure: number;
    };
    summary_feedback: string;
    key_strengths: string[];
    critical_improvements: {
        section: string;
        issue: string;
        fix: string;
    }[];
    ats_keywords_missing: string[];
    job_title_detected: string | null;
}


export interface Analysis {
    contact_info: ContactInfo;
    summary: string;
    match_score: number;
    strengths: string[];
    weaknesses: string[];
    detailed_analysis: DetailedAnalysis;
}

export interface RecruiterAnalysis {
    contact_info?: {
        name: string;
        email: string;
        phone: string;
        location?: string;
    };
    match_percentage: number;
    hiring_recommendation: "Strong Hire" | "Interview" | "Backup" | "Reject";
    executive_summary: string;
    fit_analysis: {
        technical_skills_match: number;
        experience_relevance: number;
        cultural_culture_fit: number;
        education_requirements: "Met" | "Not Met" | "Exceeded";
    };
    key_strengths: string[];
    gaps_and_red_flags: {
        severity: "High" | "Medium" | "Low";
        issue: string;
        detail: string;
    }[];
    missing_critical_skills: string[];
    suggested_interview_questions: {
        focus_area: string;
        question: string;
    }[];
}


export interface DetailedAnalysis {
    hard_skills: SkillAnalysis[];
    soft_skills: SkillAnalysis[];
    experience: ExperienceAnalysis[];
}

export interface SkillAnalysis {
    skill: string;
    requirement: string | null;
    match: string;
    comment: string;
}

export interface ExperienceAnalysis {
    skill: string | null;
    requirement: string;
    match: string;
    comment: string;
}

export interface ContactInfo {
    name: string;
    email: string
}

export interface CVBuildResponse {
    analysis: {
        profile_focus: string;
        key_selling_points: string[];
    };
    generated_cv: any;
}

export interface CVPayload {
    cv_pdf: File;
    job_description: string;
    cv_image?: File;
}

export interface CompanyRankPayload {
    jobDescription: string;
    files: FileList | File[];
}

export interface CVBuildPayload {
    full_name: string;
    email: string;
    phone: string;
    raw_description: string;
    certificates: string[];
    education: any[];
    experience: any[];
}

export interface FormData {
    fullName: string;
    email: string;
    phone: string;
    rawDescription: string;
    certificates: string[];
    tempCert: string;
}

export interface NavItem {
    name: string;
    href: string;
}

export interface FeatureCard {
    icon: LucideIcon;
    title: string;
    description: string;
    stat?: string;
    color?: string;
}

export interface StatCard {
    value: string;
    label: string;
    icon: LucideIcon;
    description?: string;
    progress?: number;
}

export interface IFeatures {
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface StepItem {
    number: number;
    title: string;
    description: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    delay?: number;
}

export interface CompanyRankResponse {
    ranked_results: AnalysisResult[];
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    signOut: () => Promise<void>;
}

export interface GoogleAuthButtonProps {
    mode: 'login' | 'register';
    text: string;
}

export interface EmailAuthFormProps {
    mode: 'login' | 'register';
}

export interface InterviewAnalysis {
    id: string;
    user_id: string;
    audio_file_path?: string;
    video_analysis?: any;
    question_context: string;
    feedback: string;
    score: number;
    next_question_suggestion?: string;
    is_deleted: boolean;
    created_at: string;
    updated_at?: string;
}

export interface CreateInterviewAnalysisPayload {
    audio_file_path?: string;
    video_analysis?: any;
    question_context: string;
    feedback: string;
    score: number;
    next_question_suggestion?: string;
}


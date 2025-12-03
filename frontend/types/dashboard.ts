import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export interface AnalysisResult {
    job_title: string;
    company_name?: string;
    analysis_vs_jd: {
        weaknesses: string[];
        match_score: number;
        summary: string;
        strengths: string[];
        improvements: string[];
    };
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
}

export interface CVAnalysis {
    id: string;
    created_at: string;

    result?: AnalysisResult | string;
    cv_name?: string;

    job_title: string;
    company_name?: string;
    overall_score: number;
    status: 'completed' | 'pending' | 'failed';
    top_strengths: string[];
    top_improvements: string[];
}



export interface UserStats {
    totalAnalyses: number;
    remainingAnalyses: number;
    averageScore: number;
    lastAnalysisDate: string | null;
}

export interface DashboardLayoutProps {
    children: ReactNode;
}



export interface RecentAnalysisCardProps {
    analysis: CVAnalysis;
    locale: string;
}


export interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color: 'blue' | 'green' | 'purple' | 'orange';
    loading?: boolean;
}

export const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
};
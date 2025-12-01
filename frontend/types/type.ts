import { User } from "@supabase/supabase-js";
import { LucideIcon } from "lucide-react";
export interface AnalysisResult {
    filename: string;
    analysis: Analysis
};
export interface Analysis {
    contact_info: ContactInfo;
    summary: string;
    match_score: number;
    strengths: string[];
    weaknesses: string[];
    detailed_analysis: DetailedAnalysis;
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
export interface Plan {
    name: string;
    price: string;
    features: string[];
    popular?: boolean;
    note?: string;
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
export interface UserPlan {
    id: string;
    user_id: string;
    status: string;
    start_date: string;
    end_date: string;
    plan: UserPlanResponse;
}
export interface UserPlanResponse {
    name: string;
    display_name: string;
}
/**
 * Central export for all type definitions
 * Import from '@/types' instead of individual files
 */

// CV and Analysis types from type.ts
export type {
    AnalysisResult,
    Analysis,
    DetailedAnalysis,
    SkillAnalysis,
    ExperienceAnalysis,
    ContactInfo,
    CVBuildResponse,
    CVPayload,
    CompanyRankPayload,
    CVBuildPayload,
    FormData,
    NavItem,
    FeatureCard,
    StatCard,
    IFeatures,
    StepItem,
    CompanyRankResponse,
    AuthContextType,
    GoogleAuthButtonProps,
    EmailAuthFormProps,
    InterviewAnalysis as InterviewAnalysisFromType,
} from "./type";

// Interview types - use these instead of type.ts versions
export type {
    AudioVisualizerProps,
    InterviewQuestion,
    InterviewAnalysisResult,
    InterviewAnalysis,
    CreateInterviewAnalysisPayload,
    AnalyzeInterviewPayload,
    AnalyzeInterviewResponse,
} from "./interview";

// Plan and subscription types
export type {
    PlanFromDB,
    Plan,
    PaymentPlan,
    UserPlan,
    SupportedLocale,
    PlanCardProps,
} from "./plan";


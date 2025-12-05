/**
 * Interview-related type definitions
 */

export interface AudioVisualizerProps {
    stream: MediaStream | null;
    width?: number;
    height?: number;
    barColor?: string;
}

export interface InterviewQuestion {
    id: number;
    question: string;
    context: string;
    topic: string;
}

export interface InterviewAnalysisResult {
    feedback: string;
    score: number;
    next_question_suggestion: string;
}

export interface InterviewAnalysis {
    id: string;
    user_id: string;
    audio_file_path?: string;
    video_analysis?: unknown;
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
    video_analysis?: unknown;
    question_context: string;
    feedback: string;
    score: number;
    next_question_suggestion?: string;
}

export interface AnalyzeInterviewPayload {
    audioBlob: Blob;
    videoAnalysis: unknown[];
    questionContext: string;
}

export interface AnalyzeInterviewResponse {
    analysisResult: InterviewAnalysisResult;
    savedSuccessfully: boolean;
}

"use client";

import path from "@/app/axios/path";
import {
    InterviewAnalysisResult,
    AnalyzeInterviewPayload,
    AnalyzeInterviewResponse,
    CreateInterviewAnalysisPayload
} from "@/types/interview";
import { saveInterviewAnalysis } from "./interviewActions";

/**
 * Analyzes an interview answer by sending audio and video analysis data to the backend.
 * After receiving the analysis, it automatically saves the result to the database.
 *
 * @param payload - The interview data including audio blob, video analysis, and question context
 * @returns The analysis result and save status
 */
export async function analyzeInterviewAnswer(
    payload: AnalyzeInterviewPayload
): Promise<AnalyzeInterviewResponse> {
    const { audioBlob, videoAnalysis, questionContext } = payload;

    // Create FormData with the audio file and analysis data
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "answer.webm");
    formData.append("video_analysis", JSON.stringify(videoAnalysis));
    formData.append("question_context", questionContext);

    // Send to the analysis API using the axios instance
    const response = await path.post<InterviewAnalysisResult>(
        "/interview/analyze-answer",
        formData
    );

    const analysisResult = response.data;

    // Save to database
    let savedSuccessfully = false;
    try {
        await saveInterviewAnalysis({
            video_analysis: videoAnalysis,
            question_context: questionContext,
            feedback: analysisResult.feedback,
            score: analysisResult.score,
            next_question_suggestion: analysisResult.next_question_suggestion,
        } as CreateInterviewAnalysisPayload);
        savedSuccessfully = true;
    } catch (saveError) {
        console.error("Error saving interview analysis:", saveError);
        // Don't throw - the analysis was still successful
    }

    return {
        analysisResult,
        savedSuccessfully,
    };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { checkUserAccess } from "@/lib/auth-check";
import { CreateInterviewAnalysisPayload } from "@/types/type";

export async function saveInterviewAnalysis(payload: CreateInterviewAnalysisPayload) {
    try {
        // Check authentication and ban status
        const user = await checkUserAccess();

        const supabase = await createClient();

        // Insert the interview analysis
        const { data, error } = await supabase
            .from("interview_analyses")
            .insert({
                user_id: user.id,
                audio_file_path: payload.audio_file_path,
                video_analysis: payload.video_analysis,
                question_context: payload.question_context,
                feedback: payload.feedback,
                score: payload.score,
                next_question_suggestion: payload.next_question_suggestion,
                is_deleted: false
            })
            .select()
            .single();

        if (error) {
            console.error("Error saving interview analysis:", error);
            throw new Error("Failed to save interview analysis");
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Error in saveInterviewAnalysis:", error);
        throw new Error(error.message || "Failed to save interview analysis");
    }
}

export async function getInterviewHistory(limit: number = 10) {
    try {
        // Check authentication and ban status
        const user = await checkUserAccess();

        const supabase = await createClient();

        // Get user's interview history
        const { data, error } = await supabase
            .from("interview_analyses")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_deleted", false)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) {
            console.error("Error fetching interview history:", error);
            throw new Error("Failed to fetch interview history");
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Error in getInterviewHistory:", error);
        throw new Error(error.message || "Failed to fetch interview history");
    }
}

export async function softDeleteInterviewAnalysis(analysisId: string) {
    try {
        // Check authentication and ban status
        const user = await checkUserAccess();

        const supabase = await createClient();

        // Soft delete the analysis (only if it belongs to the user)
        const { data, error } = await supabase
            .from("interview_analyses")
            .update({ is_deleted: true })
            .eq("id", analysisId)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) {
            console.error("Error deleting interview analysis:", error);
            throw new Error("Failed to delete interview analysis");
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Error in softDeleteInterviewAnalysis:", error);
        throw new Error(error.message || "Failed to delete interview analysis");
    }
}

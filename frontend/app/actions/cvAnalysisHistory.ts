"use server";

import { createClient } from "@/utils/supabase/server";

export interface CVAnalysisHistory {
    id: string;
    cv_name: string;
    result: any;
    created_at: string;
}

/**
 * Get CV analysis history for the current user
 * @param limit - Maximum number of records to return (default: 10)
 * @param offset - Number of records to skip (default: 0)
 */
export async function getCVAnalysisHistory(
    limit: number = 10,
    offset: number = 0
): Promise<CVAnalysisHistory[]> {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return [];
    }

    const { data, error } = await supabase
        .from("ai_cv_results")
        .select("id, cv_name, result, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error("Error fetching CV analysis history:", error);
        return [];
    }

    return data || [];
}

/**
 * Delete a specific CV analysis from history
 * @param analysisId - ID of the analysis to delete
 */
export async function deleteCVAnalysis(analysisId: string): Promise<boolean> {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return false;
    }

    const { error } = await supabase
        .from("ai_cv_results")
        .delete()
        .eq("id", analysisId)
        .eq("user_id", user.id); // Ensure user can only delete their own records

    if (error) {
        console.error("Error deleting CV analysis from ai_cv_results:", error);
        return false;
    }

    return true;
}

/**
 * Get a single CV analysis by ID
 * @param analysisId - ID of the analysis to retrieve
 */
export async function getCVAnalysisById(
    analysisId: string
): Promise<CVAnalysisHistory | null> {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return null;
    }

    const { data, error } = await supabase
        .from("ai_cv_results")
        .select("id, cv_name, result, created_at")
        .eq("id", analysisId)
        .eq("user_id", user.id)
        .single();

    if (error) {
        console.error("Error fetching CV analysis:", error);
        return null;
    }

    return data;
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { logger } from '@/lib/logger';

export interface CVAnalysisHistory {
    id: string;
    cv_name: string;
    result: any;
    created_at: string;
}

/**
 * Get CV analysis history for the current user
 * Now with caching for improved performance
 * @param limit - Maximum number of records to return (default: 10)
 * @param offset - Number of records to skip (default: 0)
 */
export const getCVAnalysisHistory = cache(
    async (
        limit: number = 10,
        offset: number = 0
    ): Promise<CVAnalysisHistory[]> => {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return [];
        }

        return unstable_cache(
            async () => {
                const { data, error } = await supabase
                    .from("ai_cv_results")
                    .select("id, cv_name, result, created_at")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .range(offset, offset + limit - 1);

                if (error) {
                    logger.error("Error fetching CV analysis history", error, { userId: user.id, limit, offset });
                    return [];
                }

                return data || [];
            },
            [`cv-history-${user.id}-${limit}-${offset}`],
            {
                revalidate: 60,
                tags: [`user-${user.id}`, 'cv-history']
            }
        )();
    }
);

/**
 * Delete a specific CV analysis from history
 * Invalidates cache after successful deletion
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
        .eq("user_id", user.id)

    if (error) {
        logger.error("Error deleting CV analysis from ai_cv_results", error, { analysisId, userId: user.id });
        return false;
    }

    const nextCache = await import('next/cache');
    nextCache.revalidateTag(`user-${user.id}`, {});
    nextCache.revalidateTag('cv-history', {});

    return true;
}

/**
 * Get a single CV analysis by ID
 * Cached for 5 minutes per analysis
 * @param analysisId - ID of the analysis to retrieve
 */
export const getCVAnalysisById = cache(
    async (analysisId: string): Promise<CVAnalysisHistory | null> => {
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return null;
        }

        return unstable_cache(
            async () => {
                const { data, error } = await supabase
                    .from("ai_cv_results")
                    .select("id, cv_name, result, created_at")
                    .eq("id", analysisId)
                    .eq("user_id", user.id)
                    .single();

                if (error) {
                    logger.error("Error fetching CV analysis", error, { analysisId, userId: user.id });
                    return null;
                }

                return data;
            },
            [`cv-analysis-${analysisId}`],
            {
                revalidate: 300,
                tags: [`cv-${analysisId}`, `user-${user.id}`]
            }
        )();
    }
);

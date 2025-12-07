"use server";

import { CVPayload } from "@/types/type";
import { createClient } from "@/lib/supabase/server";
import { logger, logServerAction } from "@/lib/logger";
import { revalidateTag } from "next/cache";
import { checkUserAccess } from "@/lib/auth-check";
import path from "@/app/axios/path";
import { handleApiError } from "@/lib/api/handle-api-error";

import { validateOrThrow, cvPayloadSchema } from "@/lib/validations";
import { validateAndUpdateUsage, FREE_TRIAL_LIMIT } from "@/lib/usage-limits";

/**
 * Analyze a CV against a job description
 * Handles usage tracking for both paid plans and free trials
 */
export async function analyzeCv(payload: CVPayload) {
    const supabase = await createClient();
    const user = await checkUserAccess();

    // Validate payload
    validateOrThrow(cvPayloadSchema, payload);

    logServerAction('analyzeCv', user.id, { fileName: payload.cv_pdf.name });

    // Check and update usage limits
    await validateAndUpdateUsage(supabase, user.id);

    // Perform analysis
    const analysisResult = await performAnalysis(payload);

    // Save results (non-blocking)
    await saveAnalysisResult(supabase, user.id, payload.cv_pdf.name, analysisResult);

    return analysisResult;
}

/**
 * Performs the CV analysis using the API
 */
async function performAnalysis(payload: CVPayload) {
    try {
        const formData = new FormData();
        formData.append('cv_pdf', payload.cv_pdf);
        formData.append('job_description', payload.job_description);

        if (payload.cv_image) {
            formData.append('cv_image', payload.cv_image);
        }

        const { data } = await path.post('/analysis/analyze-full-cv/', formData);
        return data;
    } catch (error) {
        logger.error("Analysis API failed", error as Error);
        handleApiError(error);
    }
}

/**
 * Saves the analysis result to the database
 */
async function saveAnalysisResult(
    supabase: any,
    userId: string,
    fileName: string,
    result: any
) {
    try {
        const { error } = await supabase
            .from("ai_cv_results")
            .insert({
                user_id: userId,
                cv_name: fileName,
                result,
                created_at: new Date().toISOString()
            });

        if (error) {
            logger.error("Failed to save CV analysis", error, { userId, fileName });
            return;
        }

        // Invalidate cache
        // Invalidate cache
        revalidateTag(`user-${userId}`, {});
        revalidateTag('cv-history', {});

        logger.info("CV analysis saved successfully", { userId, fileName });
    } catch (err) {
        logger.error("Exception while saving CV analysis", err as Error, { userId });
    }
}

/**
 * Get the current user's usage statistics
 */
export async function getUserUsage() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return null;
    }

    // Check for active plan
    const { data: userPlan } = await supabase
        .from("user_plans")
        .select(`cv_analyses_used, plan:plans!inner(max_cv_analyses)`)
        .eq("user_id", user.id)
        .eq("status", "active")
        .gt("end_date", new Date().toISOString())
        .single();

    if (userPlan?.plan) {
        return {
            usage: userPlan.cv_analyses_used,
            limit: (userPlan.plan as any).max_cv_analyses ?? null,
            isPlan: true
        };
    }

    // Fall back to free usage
    const { data: userUsage } = await supabase
        .from("user_usage")
        .select("lifetime_analyses_used")
        .eq("user_id", user.id)
        .single();

    return {
        usage: userUsage?.lifetime_analyses_used || 0,
        limit: FREE_TRIAL_LIMIT,
        isPlan: false
    };
}

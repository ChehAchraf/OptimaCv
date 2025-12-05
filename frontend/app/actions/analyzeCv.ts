"use server";

import { CVPayload } from "@/types/type";
import { createClient } from "@/lib/supabase/server";
import { logger, logServerAction } from "@/lib/logger";
import { revalidateTag } from "next/cache";
import { checkUserAccess } from "@/lib/auth-check";
import path from "@/app/axios/path";
import { handleApiError } from "@/lib/api/handle-api-error";

// Constants
const FREE_TRIAL_LIMIT = 5;

const ERROR_MESSAGES = {
    USAGE_UPDATE_FAILED: "Failed to update usage count",
    PLAN_LIMIT_REACHED: (limit: number) =>
        `You've reached your monthly limit of ${limit} CV analyses. Please upgrade your plan or wait for the next billing cycle.`,
    FREE_LIMIT_REACHED:
        `You've used all ${FREE_TRIAL_LIMIT} free trial analyses. Please subscribe to a plan to continue using CV analysis features.`,
} as const;

/**
 * Analyze a CV against a job description
 * Handles usage tracking for both paid plans and free trials
 */
export async function analyzeCv(payload: CVPayload) {
    const supabase = await createClient();
    const user = await checkUserAccess();

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
 * Validates user's usage limits and increments usage count
 */
async function validateAndUpdateUsage(supabase: any, userId: string) {
    const { data: userPlan } = await supabase
        .from("user_plans")
        .select(`*, plan:plans(*)`)
        .eq("user_id", userId)
        .eq("status", "active")
        .gt("end_date", new Date().toISOString())
        .single();

    if (userPlan) {
        await validatePlanUsage(supabase, userId, userPlan);
    } else {
        await validateFreeUsage(supabase, userId);
    }
}

/**
 * Validates and increments usage for paid plan users
 */
async function validatePlanUsage(supabase: any, userId: string, userPlan: any) {
    const { data: canProceed, error } = await supabase
        .rpc("increment_plan_usage", { p_user_id: userId });

    if (error) {
        logger.error("Error incrementing plan usage", error, { userId });
        throw new Error(ERROR_MESSAGES.USAGE_UPDATE_FAILED);
    }

    if (!canProceed) {
        throw new Error(ERROR_MESSAGES.PLAN_LIMIT_REACHED(userPlan.plan.max_cv_analyses));
    }
}

/**
 * Validates and increments usage for free trial users
 */
async function validateFreeUsage(supabase: any, userId: string) {
    const { data: canProceed, error } = await supabase
        .rpc("increment_free_usage", { user_uuid: userId });

    if (error) {
        logger.error("Error incrementing free usage", error, { userId });
        throw new Error(ERROR_MESSAGES.USAGE_UPDATE_FAILED);
    }

    if (!canProceed) {
        throw new Error(ERROR_MESSAGES.FREE_LIMIT_REACHED);
    }
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

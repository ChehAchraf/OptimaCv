"use server";

import { CVPayload } from "@/types/type";
import { createClient } from "@/lib/supabase/server";
import { logger, logServerAction } from "@/lib/logger";
import { revalidateTag } from "next/cache";
import { checkUserAccess } from "@/lib/auth-check";

export async function analyzeCv(payload: CVPayload) {
    const supabase = await createClient();

    // Check authentication and ban status
    const user = await checkUserAccess();

    logServerAction('analyzeCv', user.id, { fileName: payload.cv_pdf.name });

    const { data: userPlan } = await supabase
        .from("user_plans")
        .select(`
           *,
            plan:plans(*)
        `)
        .eq("user_id", user.id)
        .eq("status", "active")
        .gt("end_date", new Date().toISOString())
        .single();

    let canProceed = false;

    if (userPlan) {
        const { data: incrementResult, error: incrementError } = await supabase
            .rpc("increment_plan_usage", { p_user_id: user.id });

        if (incrementError) {
            logger.error("Error incrementing plan usage", incrementError, { userId: user.id });
            throw new Error("Failed to update usage count");
        }

        canProceed = incrementResult as boolean;

        if (!canProceed) {
            throw new Error(
                `You've reached your monthly limit of ${userPlan.plan.max_cv_analyses} CV analyses. Please upgrade your plan or wait for the next billing cycle.`
            );
        }
    } else {
        const { data: incrementResult, error: incrementError } = await supabase
            .rpc("increment_free_usage", { user_uuid: user.id });

        if (incrementError) {
            logger.error("Error incrementing free usage", incrementError, { userId: user.id });
            throw new Error("Failed to update usage count");
        }

        canProceed = incrementResult as boolean;

        if (!canProceed) {
            throw new Error(
                "You've used all 5 free trial analyses. Please subscribe to a plan to continue using CV analysis features."
            );
        }
    }

    const formData = new FormData();
    formData.append('cv_pdf', payload.cv_pdf);
    formData.append('job_description', payload.job_description);
    if (payload.cv_image) {
        formData.append('cv_image', payload.cv_image);
    }

    const baseURL = process.env.INTERNAL_API_BASE_URL || process.env.NEXT_PUBLIC_APP_BASE_URL;

    if (!baseURL) {
        throw new Error("API Base URL is not configured");
    }

    const response = await fetch(`${baseURL}/analysis/analyze-full-cv/`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        logger.error("Analysis API failed", new Error(errorText), { status: response.status });
        throw new Error(`Analysis failed: ${response.statusText}`);
    }

    const data = await response.json();

    try {
        const { error: saveError } = await supabase
            .from("ai_cv_results")
            .insert({
                user_id: user.id,
                cv_name: payload.cv_pdf.name,
                result: data,
                created_at: new Date().toISOString()
            });

        if (saveError) {
            logger.error("Failed to save CV analysis to ai_cv_results", saveError, { userId: user.id, fileName: payload.cv_pdf.name });
        } else {
            const nextCache = await import('next/cache');
            nextCache.revalidateTag(`user-${user.id}`, {});
            nextCache.revalidateTag('cv-history', {});

            logger.info("CV analysis saved successfully", { userId: user.id, fileName: payload.cv_pdf.name });
        }
    } catch (saveErr) {
        logger.error("Exception while saving CV analysis", saveErr as Error, { userId: user.id });
    }

    return data;
}

export async function getUserUsage() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return null;
    }

    const { data: userPlan } = await supabase
        .from("user_plans")
        .select(`
            cv_analyses_used,
            plan:plans!inner(max_cv_analyses)
        `)
        .eq("user_id", user.id)
        .eq("status", "active")
        .gt("end_date", new Date().toISOString())
        .single();

    if (userPlan && userPlan.plan) {
        return {
            usage: userPlan.cv_analyses_used,
            limit: (userPlan.plan as any).max_cv_analyses ?? null,
            isPlan: true
        };
    }


    const { data: userUsage } = await supabase
        .from("user_usage")
        .select("lifetime_analyses_used")
        .eq("user_id", user.id)
        .single();

    return {
        usage: userUsage?.lifetime_analyses_used || 0,
        limit: 5,
        isPlan: false
    };
}

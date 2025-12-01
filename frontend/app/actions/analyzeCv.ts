"use server";

import path from "@/app/axios/path";
import { CVPayload } from "@/types/type";
import { createClient } from "@/utils/supabase/server";


export async function analyzeCv(payload: CVPayload) {
    console.log(payload, "payload");

    // Check user authentication and limits
    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("You must be logged in to analyze CVs");
    }

    // Check for active plan
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
        // User has an active plan - check plan limits
        const { data: incrementResult, error: incrementError } = await supabase
            .rpc("increment_plan_usage", { p_user_id: user.id });

        if (incrementError) {
            console.error("Error incrementing plan usage:", incrementError);
            throw new Error("Failed to update usage count");
        }

        canProceed = incrementResult as boolean;

        if (!canProceed) {
            throw new Error(
                `You've reached your monthly limit of ${userPlan.plan.max_cv_analyses} CV analyses. Please upgrade your plan or wait for the next billing cycle.`
            );
        }
    } else {
        // No active plan - check free trial usage
        const { data: incrementResult, error: incrementError } = await supabase
            .rpc("increment_free_usage", { user_uuid: user.id });

        if (incrementError) {
            console.error("Error incrementing free usage:", incrementError);
            throw new Error("Failed to update usage count");
        }

        canProceed = incrementResult as boolean;

        if (!canProceed) {
            throw new Error(
                "You've used all 5 free trial analyses. Please subscribe to a plan to continue using CV analysis features."
            );
        }
    }

    // Proceed with analysis
    const res = await path.post("/analysis/analyze-full-cv/", payload);
    console.log(res.data, "res.data");

    return res.data;
}

export async function getUserUsage() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return null;
    }

    // Check for active plan
    const { data: userPlan } = await supabase
        .from("user_plans")
        .select(`
            cv_analyses_used,
            plan:plans(max_cv_analyses)
        `)
        .eq("user_id", user.id)
        .eq("status", "active")
        .gt("end_date", new Date().toISOString())
        .single();

    if (userPlan) {
        // userPlan.plan is an array or object depending on query, but .single() on user_plans makes userPlan an object.
        // The join plan:plans(*) usually returns an object if it's a foreign key relation and we use single() or if it's a many-to-one.
        // Assuming one plan per user_plan.
        const plan = userPlan.plan as any;
        return {
            usage: userPlan.cv_analyses_used,
            limit: plan?.max_cv_analyses ?? null, // null means unlimited
            isPlan: true
        };
    }

    // Check free usage
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

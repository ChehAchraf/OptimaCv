import { logger } from "@/lib/logger";

const FREE_TRIAL_LIMIT = 5;

const ERROR_MESSAGES = {
    USAGE_UPDATE_FAILED: "Failed to update usage count",
    PLAN_LIMIT_REACHED: (limit: number) =>
        `You've reached your monthly limit of ${limit} CV analyses. Please upgrade your plan or wait for the next billing cycle.`,
    FREE_LIMIT_REACHED:
        `You've used all ${FREE_TRIAL_LIMIT} free trial analyses. Please subscribe to a plan to continue using CV analysis features.`,
} as const;

/**
 * Validates user's usage limits and increments usage count
 */
export async function validateAndUpdateUsage(supabase: any, userId: string) {
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
 * Check if the user has remaining usage without incrementing
 */
export async function checkUsageAvailability(supabase: any, userId: string): Promise<boolean> {
    const { data: userPlan } = await supabase
        .from("user_plans")
        .select(`cv_analyses_used, plan:plans(*)`)
        .eq("user_id", userId)
        .eq("status", "active")
        .gt("end_date", new Date().toISOString())
        .single();

    if (userPlan) {
        return userPlan.cv_analyses_used < userPlan.plan.max_cv_analyses;
    } else {
        const { data: userUsage } = await supabase
            .from("user_usage")
            .select("lifetime_analyses_used")
            .eq("user_id", userId)
            .single();

        return (userUsage?.lifetime_analyses_used || 0) < FREE_TRIAL_LIMIT;
    }
}

export { FREE_TRIAL_LIMIT, ERROR_MESSAGES };

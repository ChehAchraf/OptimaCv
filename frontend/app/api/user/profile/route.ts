import { createRouteHandlerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { supabase } = await createRouteHandlerClient(req);

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get user's active plan
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

        // Get user's free trial usage
        const { data: freeUsage } = await supabase
            .from("user_usage")
            .select("*")
            .eq("user_id", user.id)
            .single();

        // Calculate usage stats
        let usageStats = {
            hasActivePlan: !!userPlan,
            planName: userPlan?.plan?.display_name || "Free Trial",
            planPrice: userPlan?.plan?.price || 0,
            analysesUsed: 0,
            analysesLimit: 5 as number | null, // Free trial default, null = unlimited for paid plans
            analysesRemaining: 5 as number | null,
            isFreeUser: !userPlan,
            planEndDate: userPlan?.end_date || null,
            planStartDate: userPlan?.start_date || null,
        };

        if (userPlan) {
            // User has active plan
            usageStats.analysesUsed = userPlan.cv_analyses_used || 0;
            usageStats.analysesLimit = userPlan.plan.max_cv_analyses || null; // null = unlimited
            usageStats.analysesRemaining = userPlan.plan.max_cv_analyses
                ? userPlan.plan.max_cv_analyses - (userPlan.cv_analyses_used || 0)
                : null; // null = unlimited
        } else if (freeUsage) {
            // Free trial user
            usageStats.analysesUsed = freeUsage.lifetime_analyses_used || 0;
            usageStats.analysesRemaining = Math.max(0, 5 - (freeUsage.lifetime_analyses_used || 0));
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                createdAt: user.created_at,
                metadata: user.user_metadata,
            },
            plan: userPlan || null,
            usage: usageStats,
            freeUsage: freeUsage || null,
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

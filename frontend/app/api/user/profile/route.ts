import { createRouteHandlerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { supabase } = await createRouteHandlerClient(req);

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

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

        const { data: freeUsage } = await supabase
            .from("user_usage")
            .select("*")
            .eq("user_id", user.id)
            .single();

        let usageStats = {
            hasActivePlan: !!userPlan,
            planName: userPlan?.plan?.display_name || "Free Trial",
            planPrice: userPlan?.plan?.price || 0,
            analysesUsed: 0,
            analysesLimit: 5 as number | null,
            analysesRemaining: 5 as number | null,
            isFreeUser: !userPlan,
            planEndDate: userPlan?.end_date || null,
            planStartDate: userPlan?.start_date || null,
        };

        if (userPlan) {
            usageStats.analysesUsed = userPlan.cv_analyses_used || 0;
            usageStats.analysesLimit = userPlan.plan.max_cv_analyses || null;
            usageStats.analysesRemaining = userPlan.plan.max_cv_analyses
                ? userPlan.plan.max_cv_analyses - (userPlan.cv_analyses_used || 0)
                : null;
        } else if (freeUsage) {
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

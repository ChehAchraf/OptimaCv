import { createRouteHandlerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { supabase } = await createRouteHandlerClient(req);
        const { plan_id } = await req.json();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { data: plan, error: planError } = await supabase
            .from("plans")
            .select("*")
            .eq("id", plan_id)
            .single();

        if (planError || !plan) {
            return NextResponse.json(
                { success: false, error: "Invalid plan selected" },
                { status: 400 }
            );
        }

        const { data: existingPlan } = await supabase
            .from("user_plans")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active")
            .gt("end_date", new Date().toISOString())
            .single();

        if (existingPlan) {
 
            return NextResponse.json(
                { success: false, error: "User already has an active plan" },
                { status: 409 }
            );
        }

        
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration_days);

        const { error: insertError } = await supabase.from("user_plans").insert({
            user_id: user.id,
            plan_id: plan.id,
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            auto_renew: false,
            cv_builds_used: 0,
            cv_analyses_used: 0
        });

        if (insertError) {
            console.error("Error creating subscription:", insertError);
            return NextResponse.json(
                { success: false, error: "Failed to create subscription" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Subscription error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

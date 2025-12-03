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

        const { data: userPlan, error } = await supabase
            .from("user_plans")
            .select(`
        *,
        plan:plans(*)
      `)
            .eq("user_id", user.id)
            .eq("status", "active")
            .gt("end_date", new Date().toISOString())
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error("Error fetching user plan:", error);
            return NextResponse.json(
                { success: false, error: "Failed to fetch plan" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            plan: userPlan || null
        });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

import { createRouteHandlerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { supabase } = await createRouteHandlerClient(req);

        // Check if user is admin
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify admin role (assuming role is stored in user_metadata)
        // You might want to adjust this check based on your specific auth setup
        const isAdmin = user.user_metadata?.role === 'admin';

        if (!isAdmin) {
            return NextResponse.json(
                { success: false, error: "Forbidden" },
                { status: 403 }
            );
        }

        // Get all user plans with user details (if possible) and plan details
        // Note: Getting user email requires joining with auth.users which isn't directly possible via client
        // So we'll just get the IDs and plans for now. 
        // In a real app, you might use a service role client to fetch user emails or have a public profiles table.
        const { data: userPlans, error } = await supabase
            .from("user_plans")
            .select(`
        *,
        plan:plans(*)
      `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching user plans:", error);
            return NextResponse.json(
                { success: false, error: "Failed to fetch user plans" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            userPlans
        });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}

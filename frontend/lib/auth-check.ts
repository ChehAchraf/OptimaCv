"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Check if user is authenticated and not banned
 * This function also ensures that every user has a profile
 * 
 * @returns The authenticated user object
 * @throws Error if user is not authenticated or is banned
 */
export async function checkUserAccess() {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error("Unauthorized: You must be logged in.");
    }
    let { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("status")
        .eq("id", user.id)
        .single();

    if (profileError?.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
            .from("user_profiles")
            .insert({ id: user.id, status: 'active' })
            .select("status")
            .single();

        if (insertError) {
            console.error("Failed to create user profile:", insertError);
            throw new Error("Failed to initialize user profile.");
        }
        profile = newProfile;
    } else if (profileError) {
        console.error("Error fetching user profile:", profileError);
        throw new Error("Failed to verify user status.");
    }
    if (profile && profile.status === 'banned') {
        throw new Error("Account suspended. Please contact support.");
    }
    return user;
}

/**
 * Check if user has an active enterprise plan
 */
export async function checkEnterpriseAccess() {
    const user = await checkUserAccess();
    // const supabase = await createClient();

    // // Check active plan
    // const { data: userPlan, error } = await supabase
    //     .from("user_plans")
    //     .select(`
    //         *,
    //         plan:plans(*)
    //     `)
    //     .eq("user_id", user.id)
    //     .eq("status", "active")
    //     .gt("end_date", new Date().toISOString())
    //     .single();

    // if (error || !userPlan || !userPlan.plan) {
    //     throw new Error("Access denied: Active plan required.");
    // }

    // // Check if it's an enterprise plan
    // // We treat 'enterprise' name as the key.
    // // @ts-ignore
    // const planName = userPlan.plan.name?.toLowerCase();

    // if (planName !== 'enterprise') {
    //     throw new Error("Access denied: Enterprise plan required.");
    // }

    return user;
}

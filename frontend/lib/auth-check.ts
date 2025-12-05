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

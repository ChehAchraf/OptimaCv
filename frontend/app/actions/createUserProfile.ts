"use server";

import { createClient } from "@/lib/supabase/server";

export async function createUserProfile() {
    try {
        const supabase = await createClient();

        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, error: "User not authenticated" };
        }

        // 2. Check if profile exists
        const { data: profile, error: fetchError } = await supabase
            .from("user_profiles")
            .select("id")
            .eq("id", user.id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error("Error fetching profile:", fetchError);
            return { success: false, error: fetchError.message };
        }

        // 3. If profile doesn't exist, create it
        if (!profile) {
            const { error: insertError } = await supabase
                .from("user_profiles")
                .insert({
                    id: user.id,
                    status: 'active',
                    created_at: new Date().toISOString(),
                    // last_os can be updated separately or here if passed
                });

            if (insertError) {
                console.error("Error creating profile:", insertError);
                return { success: false, error: insertError.message };
            }

            return { success: true, created: true };
        }

        return { success: true, created: false };

    } catch (error) {
        console.error("Unexpected error in createUserProfile:", error);
        return { success: false, error: "Internal Server Error" };
    }
}

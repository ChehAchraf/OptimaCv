"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateUserOS(osName: string) {
    try {
        const supabase = await createClient();

        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            // If not authenticated, we can't update the profile.
            // Silently fail or return error depending on requirement.
            // For analytics, silent fail is usually preferred to not disrupt UX.
            return { success: false, error: "User not authenticated" };
        }

        // 2. Update User Profile
        const { error: updateError } = await supabase
            .from("user_profiles")
            .update({ last_os: osName })
            .eq("id", user.id);

        if (updateError) {
            console.error("Error updating user OS:", updateError);
            return { success: false, error: updateError.message };
        }

        return { success: true };

    } catch (error) {
        console.error("Unexpected error in updateUserOS:", error);
        return { success: false, error: "Internal Server Error" };
    }
}

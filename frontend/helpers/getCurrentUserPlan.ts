import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserPlan(supabase: SupabaseClient, userId: string) {
    const { data, error } = await supabase
        .from("user_plans")
        .select(`
      *,
      plan:plans(*)
    `)
        .eq("user_id", userId)
        .eq("status", "active")
        .gt("end_date", new Date().toISOString())
        .single();

    if (error) {
        return null;
    }

    return data;
}


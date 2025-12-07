"use server";

import { createClient } from "@/lib/supabase/server";
import { CVData } from "@/types/cv";

export async function updateCV(id: string, data: Partial<CVData>) {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("Unauthorized");
    }

    // Remove id from data to avoid updating the primary key if it's passed
    const { id: _, ...updateData } = data;

    // Update the CV in the database
    // Using 'cvs' as the table name based on common conventions. 
    // If the table name is different (e.g., 'user_cvs', 'cv_profiles'), this needs to be updated.
    const { error } = await supabase
        .from('cvs')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error("Error updating CV:", error);
        throw new Error("Failed to update CV");
    }

    return { success: true };
}

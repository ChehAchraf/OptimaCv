"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const ticketSchema = z.object({
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
    priority: z.enum(["low", "medium", "high"]),
});

export async function submitTicket(prevState: any, formData: FormData) {
    try {
        const supabase = await createClient();

        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        console.log("SubmitTicket: Auth User:", user?.id);
        if (authError) console.error("SubmitTicket: Auth Error:", authError);

        if (authError || !user) {
            return { success: false, message: "You must be logged in to submit a ticket." };
        }

        // 2. Validate Input
        const rawData = {
            subject: formData.get("subject"),
            message: formData.get("message"),
            priority: formData.get("priority"),
        };
        console.log("SubmitTicket: Raw Data:", rawData);

        const validatedData = ticketSchema.safeParse(rawData);

        if (!validatedData.success) {
            console.error("SubmitTicket: Validation Error:", validatedData.error);
            return {
                success: false,
                message: validatedData.error.errors[0].message
            };
        }

        // 3. Insert into Database
        const payload = {
            user_id: user.id,
            subject: validatedData.data.subject,
            message: validatedData.data.message,
            priority: validatedData.data.priority,
            status: 'open'
        };
        console.log("SubmitTicket: Inserting payload:", payload);

        const { error: insertError, data: insertedData } = await supabase
            .from("support_tickets")
            .insert([payload])
            .select();

        if (insertError) {
            console.error("SubmitTicket: Insert Error:", insertError);
            return { success: false, message: "Failed to create ticket. Please try again." };
        }

        console.log("SubmitTicket: Success. Inserted Data:", insertedData);

        return { success: true, message: "Ticket submitted successfully!" };

    } catch (error) {
        console.error("Unexpected error in submitTicket:", error);
        return { success: false, message: "Internal Server Error" };
    }
}

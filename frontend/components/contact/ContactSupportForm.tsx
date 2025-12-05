"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { submitTicket } from "@/app/actions/submitTicket";

export default function ContactSupportForm() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        try {
            // @ts-ignore - server action type mismatch with useFormState (using direct call for simplicity here)
            const result = await submitTicket(null, formData);

            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message,
                    variant: "default",
                });
                (e.target as HTMLFormElement).reset();
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Support</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Having issues? Submit a ticket and we'll help you out.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                        id="subject"
                        name="subject"
                        placeholder="Brief summary of the issue"
                        required
                        minLength={5}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select name="priority" defaultValue="medium">
                        <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="low">Low - General Question</SelectItem>
                            <SelectItem value="medium">Medium - Minor Issue</SelectItem>
                            <SelectItem value="high">High - Critical Bug</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder="Describe your issue in detail..."
                        required
                        minLength={10}
                        className="min-h-[120px]"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Ticket
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
}

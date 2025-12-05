"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AccessDenied() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 text-center px-4">
            <div className="relative">
                <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 blur-xl rounded-full animate-pulse" />
                <div className="relative w-24 h-24 bg-white dark:bg-gray-800 shadow-xl rounded-full flex items-center justify-center border-4 border-red-50 dark:border-red-900/10">
                    <Lock className="w-10 h-10 text-red-500" />
                </div>
            </div>

            <div className="space-y-3 max-w-lg">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    Enterprise Access Required
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    This advanced HR dashboard is exclusive to our Enterprise plan members.
                    Unlock powerful features like bulk CV analysis, candidate ranking, and AI insights.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => router.push('/')}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button
                    size="lg"
                    onClick={() => router.push('/#plans')}
                    className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all"
                >
                    Upgrade Now
                </Button>
            </div>
        </div>
    );
}

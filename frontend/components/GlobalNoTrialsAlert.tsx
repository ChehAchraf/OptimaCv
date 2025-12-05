'use client';

import { useEffect, useState } from 'react';
import { getUserUsage } from '@/app/actions/analyzeCv';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HiXCircle } from 'react-icons/hi';
import { useAuth } from '@/components/providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function GlobalNoTrialsAlert() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [usage, setUsage] = useState<{ usage: number; limit: number; isPlan: boolean } | null>(null);
    const [isLoadingUsage, setIsLoadingUsage] = useState(true);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            const fetchUsage = async () => {
                try {
                    const usageData = await getUserUsage();
                    setUsage(usageData);
                } catch (error) {
                    console.error('Failed to fetch usage:', error);
                } finally {
                    setIsLoadingUsage(false);
                }
            };
            fetchUsage();
        } else if (!authLoading && !isAuthenticated) {
            setIsLoadingUsage(false);
        }
    }, [isAuthenticated, authLoading]);

    const hasNoFreeTrials = usage && !usage.isPlan && usage.usage >= usage.limit;

    if (authLoading || isLoadingUsage || !hasNoFreeTrials) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="fixed top-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]"
            >
                <Alert
                    variant="destructive"
                    className="border-2 border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-950 shadow-2xl"
                >
                    <HiXCircle className="h-4 w-4" />
                    <AlertTitle className="font-bold text-sm">No Free Trials</AlertTitle>
                    <AlertDescription className="mt-1 text-xs">
                        <p className="mb-1.5">
                            You've used all {usage.limit} free analyses.
                        </p>
                        <a
                            href="/pricing"
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 underline"
                        >
                            View Plans →
                        </a>
                    </AlertDescription>
                </Alert>
            </motion.div>
        </AnimatePresence>
    );
}

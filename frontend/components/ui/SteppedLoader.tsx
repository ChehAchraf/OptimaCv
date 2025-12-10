import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface SteppedLoaderProps {
    steps: string[];
    currentStep?: number;
    className?: string;
    onComplete?: () => void;
}

export function SteppedLoader({ steps, currentStep, className, onComplete }: SteppedLoaderProps) {
    // If currentStep is not provided, we can simulate progress
    const [internalStep, setInternalStep] = useState(0);

    useEffect(() => {
        if (typeof currentStep === 'number') {
            setInternalStep(currentStep);
            return;
        }

        // Simulate progress if no currentStep provided
        if (internalStep < steps.length - 1) {
            const timer = setTimeout(() => {
                setInternalStep(prev => prev + 1);
            }, 3000); // 3 seconds per step
            return () => clearTimeout(timer);
        } else if (onComplete) {
            onComplete();
        }
    }, [internalStep, steps.length, currentStep, onComplete]);

    const activeStep = typeof currentStep === 'number' ? currentStep : internalStep;

    return (
        <div className={cn("w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700", className)}>
            <div className="space-y-6">
                {steps.map((step, index) => {
                    const isCompleted = index < activeStep;
                    const isCurrent = index === activeStep;
                    const isPending = index > activeStep;

                    return (
                        <div key={index} className="flex items-center gap-4 group">
                            <div className="flex-shrink-0 relative">
                                {isCompleted ? (
                                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                ) : isCurrent ? (
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 animate-pulse">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                        <Circle className="w-5 h-5" />
                                    </div>
                                )}

                                {/* Connector Line */}
                                {index !== steps.length - 1 && (
                                    <div className={cn(
                                        "absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-6",
                                        isCompleted ? "bg-green-200 dark:bg-green-900" : "bg-gray-200 dark:bg-gray-700"
                                    )} />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-medium transition-colors",
                                    isCompleted ? "text-gray-900 dark:text-gray-100" :
                                        isCurrent ? "text-blue-600 dark:text-blue-400" : "text-gray-500"
                                )}>
                                    {step}
                                </p>
                                {isCurrent && (
                                    <p className="text-xs text-gray-500 mt-0.5 animate-pulse">
                                        Processing...
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

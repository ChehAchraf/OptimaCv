'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Application Error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-6">
                        <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Something went wrong!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        We encountered an unexpected error. Please try again.
                    </p>
                    {process.env.NODE_ENV === 'development' && error.message && (
                        <details className="mt-4 text-left">
                            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                Error details
                            </summary>
                            <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs overflow-auto">
                                {error.message}
                            </pre>
                        </details>
                    )}
                </div>

                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                    >
                        Try again
                    </Button>
                    <Button
                        onClick={() => window.location.href = '/'}
                        variant="outline"
                    >
                        Go home
                    </Button>
                </div>
            </div>
        </div>
    );
}

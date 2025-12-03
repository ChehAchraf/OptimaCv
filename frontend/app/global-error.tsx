'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-red-100 p-6">
                                <AlertCircle className="h-12 w-12 text-red-600" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Application Error
                            </h2>
                            <p className="text-gray-600">
                                A critical error occurred. Please refresh the page or contact support if the problem persists.
                            </p>
                        </div>

                        <Button onClick={reset}>
                            Refresh Page
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    );
}

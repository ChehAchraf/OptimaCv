'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HiCheckCircle, HiXCircle, HiRefresh } from 'react-icons/hi';


export function AuthStatusDemo() {
    const { user, isAuthenticated, isLoading, signOut } = useAuth();

    if (isLoading) {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HiRefresh className="h-5 w-5 animate-spin" />
                        Checking Authentication...
                    </CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            <HiCheckCircle className="h-5 w-5 text-green-500" />
                            Authenticated
                        </>
                    ) : (
                        <>
                            <HiXCircle className="h-5 w-5 text-red-500" />
                            Not Authenticated
                        </>
                    )}
                </CardTitle>
                <CardDescription>
                    Current authentication status
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="font-medium">Status:</span>
                        <span className={isAuthenticated ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {isAuthenticated ? 'Logged In' : 'Logged Out'}
                        </span>
                    </div>

                    {isAuthenticated && user && (
                        <>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="font-medium">Email:</span>
                                <span className="text-sm">{user.email}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="font-medium">User ID:</span>
                                <span className="text-sm font-mono">{user.id.slice(0, 8)}...</span>
                            </div>
                        </>
                    )}
                </div>

                {isAuthenticated ? (
                    <Button
                        onClick={signOut}
                        variant="destructive"
                        className="w-full"
                    >
                        Sign Out
                    </Button>
                ) : (
                    <div className="space-y-2">
                        <Button
                            onClick={() => window.location.href = '/en/auth/login'}
                            className="w-full"
                        >
                            Go to Login
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/en/auth/register'}
                            variant="outline"
                            className="w-full"
                        >
                            Go to Register
                        </Button>
                    </div>
                )}

                <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Developer Info:</h4>
                    <pre className="p-3 bg-gray-950 text-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify({
                            isAuthenticated,
                            isLoading,
                            userEmail: user?.email || null,
                            userId: user?.id || null
                        }, null, 2)}
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}

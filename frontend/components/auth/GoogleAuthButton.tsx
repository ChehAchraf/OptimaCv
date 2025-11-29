'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import { GoogleAuthButtonProps } from '@/types/type';
import { useParams } from 'next/navigation';



export function GoogleAuthButton({ mode, text }: GoogleAuthButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const params = useParams();
    const locale = (params.locale as string) || 'en';

    const handleGoogleAuth = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/${locale}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                console.error('OAuth error:', error);
                setError('Failed to sign in with Google. Please try again.');
                throw error;
            }
        } catch (error: any) {
            console.error('Error during Google authentication:', error);
            setError(error?.message || 'Authentication failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <Button
                type="button"
                variant="outline"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
            >
                {isLoading ? (
                    <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <FcGoogle className="h-5 w-5" />
                        <span>{text}</span>
                    </div>
                )}
            </Button>
            {error && (
                <p className="text-sm text-red-500 dark:text-red-400 text-center">
                    {error}
                </p>
            )}
        </div>
    );
}

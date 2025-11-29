'use client';

import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { EmailAuthForm } from '@/components/auth/EmailAuthForm';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { HiLogin } from 'react-icons/hi';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect } from 'react';

export default function LoginPage() {
    const t = useTranslations('AuthPage.login');
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push(`/${locale}`);
        }
    }, [isAuthenticated, isLoading, router, locale]);

    if (isLoading || isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        {isAuthenticated ? 'Redirecting to home...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center px-4 py-12 relative">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md">
                <div className="text-center space-y-4 mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <HiLogin className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {t('title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 space-y-6">
                    <EmailAuthForm mode="login" />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
                                {t('or')}
                            </span>
                        </div>
                    </div>

                    <GoogleAuthButton
                        mode="login"
                        text={t('googleButton')}
                    />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
                                {t('noAccount')}
                            </span>
                        </div>
                    </div>

                    <Link
                        href={`/${locale}/auth/register`}
                        className="block w-full text-center py-3 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        {t('registerLink')}
                    </Link>
                </div>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
                    © 2026 OptimaCv. All rights reserved.
                </p>
            </div>
        </div>
    );
}

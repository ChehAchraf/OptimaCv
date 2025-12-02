'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useTranslations } from 'next-intl';
import { Settings as SettingsIcon, Bell, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const t = useTranslations('Dashboard.settings');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(`/${locale}/auth/login`);
        }
    }, [isAuthenticated, isLoading, router, locale]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{t('subtitle')}</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <Globe className="h-5 w-5 text-gray-900 dark:text-white" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('language.title')}
                        </h2>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {t('language.description')}
                    </p>
                    <div className="flex gap-3">
                        {[
                            { code: 'fr', label: 'Français' },
                            { code: 'en', label: 'English' },
                            { code: 'ar', label: 'العربية' },
                        ].map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => router.push(`/${lang.code}/dashboard/settings`)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${locale === lang.code
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <Bell className="h-5 w-5 text-gray-900 dark:text-white" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('notifications.title')}
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {t('notifications.email')}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('notifications.emailDescription')}
                                </p>
                            </div>
                            <Button variant="outline" disabled>
                                {t('comingSoon')}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                        <Lock className="h-5 w-5 text-gray-900 dark:text-white" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('security.title')}
                        </h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {t('security.changePassword')}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('security.changePasswordDescription')}
                                </p>
                            </div>
                            <Button variant="outline" disabled>
                                {t('comingSoon')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

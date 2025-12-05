'use client';

import { ReactNode, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
    LayoutDashboard,
    FileText,
    History,
    User,
    Settings,
    Menu,
    X,
    LogOut,
    Moon,
    Sun,
    Mic,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';
import { DashboardLayoutProps } from '@/types/dashboard';



export function DashboardLayout({ children }: DashboardLayoutProps) {
    const params = useParams();
    const pathname = usePathname();
    const locale = params.locale as string;
    const t = useTranslations('Dashboard');
    const { theme, setTheme } = useTheme();
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        {
            name: t('nav.dashboard'),
            href: `/${locale}/dashboard`,
            icon: LayoutDashboard,
        },
        {
            name: t('nav.cvAnalysis'),
            href: `/${locale}/CV_analyze`,
            icon: FileText,
        },
        {
            name: t('nav.interview'),
            href: `/${locale}/interview`,
            icon: Mic,
        },
        {
            name: t('nav.interviewHistory'),
            href: `/${locale}/dashboard/interview-history`,
            icon: History,
        },
        {
            name: t('nav.history'),
            href: `/${locale}/dashboard/history`,
            icon: FileText,
        },
        {
            name: t('nav.profile'),
            href: `/${locale}/dashboard/profile`,
            icon: User,
        },
        {
            name: t('nav.settings'),
            href: `/${locale}/dashboard/settings`,
            icon: Settings,
        },
    ];

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = `/${locale}/auth/login`;
    };

    const isActive = (href: string) => pathname === href;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
                        <Link href={`/${locale}`} className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                                <span className="text-white dark:text-gray-900 font-bold text-sm">OC</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                optimaCV
                            </span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">
                                    {user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
                                        user?.email?.[0]?.toUpperCase() ||
                                        'U'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 mr-3" />
                            ) : (
                                <Moon className="h-5 w-5 mr-3" />
                            )}
                            {theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            {t('nav.signOut')}
                        </button>
                    </div>
                </div>
            </aside>

            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
                    <div className="flex items-center justify-between h-16 px-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <div className="flex items-center space-x-4 ml-auto">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date().toLocaleDateString(locale, {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                </header>

                <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            </div>
        </div>
    );
}

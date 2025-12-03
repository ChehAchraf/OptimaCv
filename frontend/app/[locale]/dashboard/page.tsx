'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentAnalysisCard } from '@/components/dashboard/RecentAnalysisCard';
import { useTranslations } from 'next-intl';
import { FileText, TrendingUp, Award, CalendarDays } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CVAnalysis, UserStats } from '@/types/dashboard';
import { Link } from '@/i18n/routing';




export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const t = useTranslations('Dashboard');
    const [stats, setStats] = useState<UserStats>({
        totalAnalyses: 0,
        remainingAnalyses: 0,
        averageScore: 0,
        lastAnalysisDate: null,
    });
    const [recentAnalyses, setRecentAnalyses] = useState<CVAnalysis[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(`/${locale}/auth/login`);
        }
    }, [isAuthenticated, isLoading, router, locale]);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchDashboardData();
        }
    }, [isAuthenticated, user]);

    const fetchDashboardData = async () => {
        try {
            setLoadingData(true);
            const supabase = createClient();

            // Fetch user usage
            const { data: usage } = await supabase
                .from('user_usage')
                .select('*')
                .eq('user_id', user!.id)
                .single();

            // Fetch recent CV analyses
            const { data: analyses } = await supabase
                .from('ai_cv_results')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false })
                .limit(6);

            const totalAnalyses = usage?.lifetime_analyses_used || 0;

            const limit = 5;
            const remaining = Math.max(0, limit - totalAnalyses);

            const parsedAnalyses = (analyses || []).map((a: any) => {
                const result = typeof a.result === 'string' ? JSON.parse(a.result) : a.result || {};

                return {
                    id: a.id,
                    created_at: a.created_at,
                    job_title: result.job_title || a.cv_name || 'Untitled CV',
                    company_name: result.company_name,
                    overall_score: result.analysis_vs_jd?.match_score || 0,
                    status: 'completed' as const,
                    top_strengths: result.strengths?.slice(0, 3) || [],
                    top_improvements: result.improvements?.slice(0, 3) || [],
                };
            });

            setStats({
                totalAnalyses,
                remainingAnalyses: remaining,
                averageScore: parsedAnalyses.length
                    ? Math.round(
                        parsedAnalyses.reduce((acc: number, curr: any) => acc + (curr.overall_score || 0), 0) /
                        parsedAnalyses.length
                    )
                    : 0,
                lastAnalysisDate: parsedAnalyses[0]?.created_at || null,
            });

            setRecentAnalyses(parsedAnalyses as CVAnalysis[]);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoadingData(false);
        }
    };

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
            <div className="p-6 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {t('welcome')}, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{t('subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title={t('stats.totalAnalyses')}
                        value={stats.totalAnalyses.toString()}
                        icon={FileText}
                        loading={loadingData}
                    />
                    <StatsCard
                        title={t('stats.remainingAnalyses')}
                        value={stats.remainingAnalyses.toString()}
                        icon={CalendarDays}
                        loading={loadingData}
                    />
                    <StatsCard
                        title={t('stats.averageScore')}
                        value={`${stats.averageScore}%`}
                        icon={Award}
                        loading={loadingData}
                    />
                    <StatsCard
                        title={t('stats.lastAnalysis')}
                        value={
                            stats.lastAnalysisDate
                                ? new Date(stats.lastAnalysisDate).toLocaleDateString(locale)
                                : t('stats.noAnalysis')
                        }
                        icon={TrendingUp}
                        loading={loadingData}
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-6">

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {t('recentAnalyses.title')}
                        </h2>
                        <Link
                            href="/dashboard/history"
                            className="text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 font-medium underline decoration-gray-300 underline-offset-4"
                        >
                            {t('recentAnalyses.viewAll')}
                        </Link>
                    </div>

                    {loadingData ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
                                >
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : recentAnalyses.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {recentAnalyses.map((analysis) => (
                                <RecentAnalysisCard key={analysis.id} analysis={analysis} locale={locale} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                {t('recentAnalyses.empty.title')}
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {t('recentAnalyses.empty.description')}
                            </p>
                            <a
                                href={`/${locale}/CV_analyze`}
                                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                            >
                                {t('recentAnalyses.empty.action')}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

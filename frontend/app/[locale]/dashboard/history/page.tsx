'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { RecentAnalysisCard } from '@/components/dashboard/RecentAnalysisCard';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { FileText, Filter } from 'lucide-react';

import { CVAnalysis } from '@/types/dashboard';

export const dynamic = 'force-dynamic';

export default function HistoryPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const t = useTranslations('Dashboard.history');
    const [analyses, setAnalyses] = useState<CVAnalysis[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [filter, setFilter] = useState<'all' | 'excellent' | 'good' | 'needs-improvement'>('all');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(`/${locale}/auth/login`);
        }
    }, [isAuthenticated, isLoading, router, locale]);

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchAnalyses();
        }
    }, [isAuthenticated, user]);

    const fetchAnalyses = async () => {
        try {
            setLoadingData(true);
            const supabase = createClient();

            const { data } = await supabase
                .from('ai_cv_results')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false });

            setAnalyses(
                (data || []).map((a: any) => {
                    const result = typeof a.result === 'string' ? JSON.parse(a.result) : a.result || {};
                    return {
                        id: a.id,
                        created_at: a.created_at,
                        job_title: result.job_title || a.cv_name || 'Untitled CV',
                        company_name: result.company_name,
                        result: result,
                        overall_score: result.overall_score || 0,
                        status: 'completed' as const,
                        top_strengths: result.strengths?.slice(0, 3) || [],
                        top_improvements: result.improvements?.slice(0, 3) || [],
                    };
                })
            );
        } catch (error) {
            console.error('Error fetching analyses:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const filteredAnalyses = analyses.filter((analysis) => {
        if (filter === 'all') return true;
        if (filter === 'excellent') return analysis.overall_score >= 80;
        if (filter === 'good') return analysis.overall_score >= 65 && analysis.overall_score < 80;
        if (filter === 'needs-improvement') return analysis.overall_score < 65;
        return true;
    });

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
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t('title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {t('subtitle', { count: analyses.length })}
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    {[
                        { key: 'all', label: t('filters.all') },
                        { key: 'excellent', label: t('filters.excellent') },
                        { key: 'good', label: t('filters.good') },
                        { key: 'needs-improvement', label: t('filters.needsImprovement') },
                    ].map((filterOption) => (
                        <button
                            key={filterOption.key}
                            onClick={() => setFilter(filterOption.key as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === filterOption.key
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            {filterOption.label}
                        </button>
                    ))}
                </div>

                {loadingData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
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
                ) : filteredAnalyses.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredAnalyses.map((analysis) => (
                            <RecentAnalysisCard key={analysis.id} analysis={analysis} locale={locale} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <FileText className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                            {t('empty.title')}
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('empty.description')}</p>
                        <a
                            href={`/${locale}/CV_analyze`}
                            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                        >
                            {t('empty.action')}
                        </a>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

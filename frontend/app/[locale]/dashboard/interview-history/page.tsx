'use client';

import { useEffect, useState, useTransition } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useTranslations } from 'next-intl';
import { Mic, Filter, Trash2, Calendar, MessageSquare, Star, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { getInterviewHistory, softDeleteInterviewAnalysis } from '@/app/actions/interviewActions';
import { InterviewAnalysis } from '@/types/type';

export const dynamic = 'force-dynamic';

function getScoreConfig(score: number) {
    if (score >= 8) {
        return {
            color: 'emerald',
            label: 'Excellent',
            bgClass: 'bg-emerald-500/10 border-emerald-500/20',
            textClass: 'text-emerald-600 dark:text-emerald-400',
            icon: CheckCircle
        };
    }
    if (score >= 5) {
        return {
            color: 'amber',
            label: 'Good',
            bgClass: 'bg-amber-500/10 border-amber-500/20',
            textClass: 'text-amber-600 dark:text-amber-400',
            icon: Star
        };
    }
    return {
        color: 'rose',
        label: 'Needs Work',
        bgClass: 'bg-rose-500/10 border-rose-500/20',
        textClass: 'text-rose-600 dark:text-rose-400',
        icon: AlertTriangle
    };
}

export default function InterviewHistoryPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const t = useTranslations('Dashboard.interviewHistory');
    const [analyses, setAnalyses] = useState<InterviewAnalysis[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [filter, setFilter] = useState<'all' | 'excellent' | 'good' | 'needs-improvement'>('all');
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);

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
            const result = await getInterviewHistory(50);
            if (result.success && result.data) {
                setAnalyses(result.data as InterviewAnalysis[]);
            }
        } catch (error) {
            console.error('Error fetching interview history:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('deleteConfirm'))) return;

        setDeletingId(id);
        startTransition(async () => {
            try {
                await softDeleteInterviewAnalysis(id);
                setAnalyses(prev => prev.filter(a => a.id !== id));
            } catch (error) {
                console.error('Error deleting interview analysis:', error);
                alert(t('deleteError'));
            } finally {
                setDeletingId(null);
            }
        });
    };

    const filteredAnalyses = analyses.filter((analysis) => {
        if (filter === 'all') return true;
        if (filter === 'excellent') return analysis.score >= 8;
        if (filter === 'good') return analysis.score >= 5 && analysis.score < 8;
        if (filter === 'needs-improvement') return analysis.score < 5;
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

                {/* Content */}
                {loadingData ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
                            >
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
                                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredAnalyses.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredAnalyses.map((analysis) => {
                            const config = getScoreConfig(analysis.score);
                            const Icon = config.icon;
                            const isDeleting = deletingId === analysis.id;

                            return (
                                <div
                                    key={analysis.id}
                                    className={`relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${isDeleting ? 'opacity-50' : ''}`}
                                >
                                    {/* Score Badge */}
                                    <div className={`absolute top-0 right-0 m-4 px-3 py-1 rounded-full border ${config.bgClass}`}>
                                        <div className="flex items-center gap-1.5">
                                            <Icon className={`h-4 w-4 ${config.textClass}`} />
                                            <span className={`text-sm font-semibold ${config.textClass}`}>
                                                {analysis.score}/10
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Question Context */}
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1 min-w-0 pr-16">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                                    {analysis.question_context}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Feedback */}
                                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-4">
                                            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                {t('feedback')}
                                            </h4>
                                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                                                {analysis.feedback}
                                            </p>
                                        </div>

                                        {/* Suggestion */}
                                        {analysis.next_question_suggestion && (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4 border border-blue-100 dark:border-blue-800">
                                                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                                    💡 {t('suggestion')}: {analysis.next_question_suggestion}
                                                </p>
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-xs">
                                                    {new Date(analysis.created_at).toLocaleDateString(locale, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(analysis.id)}
                                                disabled={isDeleting || isPending}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                title={t('delete')}
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                        <Mic className="mx-auto h-16 w-16 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                            {t('empty.title')}
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {t('empty.description')}
                        </p>
                        <a
                            href={`/${locale}/interview`}
                            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-colors"
                        >
                            {t('empty.action')}
                        </a>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

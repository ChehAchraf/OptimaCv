'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { createClient } from '@/utils/supabase/client';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Calendar, Building, Briefcase, CheckCircle, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { AnalysisResult, CVAnalysis } from '@/types/dashboard';


export default function AnalysisDetailPage() {
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;
    const id = params.id as string;
    const t = useTranslations('Dashboard');
    const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('ai_cv_results')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                if (data) {
                    const parsedResult = typeof data.result === 'string'
                        ? JSON.parse(data.result)
                        : data.result;

                    setAnalysis({
                        ...data,
                        result: parsedResult
                    });
                }
            } catch (error) {
                console.error('Error fetching analysis:', error);
                router.push(`/${locale}/dashboard/history`);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchAnalysis();
        }
    }, [id, locale, router]);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!analysis) {
        return (
            <DashboardLayout>
                <div className="p-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis not found</h2>
                    <Link
                        href={`/${locale}/dashboard/history`}
                        className="mt-4 inline-flex items-center text-blue-600 hover:underline"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to History
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const result = analysis.result as AnalysisResult;
    const score = result.analysis_vs_jd?.match_score || 0;

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Link
                            href={`/${locale}/dashboard`}
                            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {result.job_title || analysis.cv_name || 'Untitled Analysis'}
                        </h1>
                        <div className="flex items-center gap-4 mt-2 text-gray-600 dark:text-gray-400">
                            {result.company_name && (
                                <div className="flex items-center gap-1">
                                    <Building className="h-4 w-4" />
                                    <span>{result.company_name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(analysis.created_at).toLocaleDateString(locale)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Match Score</p>
                            <p className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</p>
                        </div>
                        <div className="h-16 w-16 rounded-full border-4 border-gray-100 dark:border-gray-700 flex items-center justify-center relative">
                            <Award className={`h-8 w-8 ${getScoreColor(score)}`} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Key Strengths</h2>
                        </div>
                        <ul className="space-y-3">
                            {(result.strengths || result.analysis_vs_jd?.strengths || []).map((strength, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                    <span>{strength}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="h-5 w-5 text-yellow-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Areas for Improvement</h2>
                        </div>
                        <ul className="space-y-3">
                            {(result.improvements || result.analysis_vs_jd?.improvements || []).map((improvement, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
                                    <span>{improvement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {result.analysis_vs_jd?.summary && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analysis Summary</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {result.analysis_vs_jd.summary}
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

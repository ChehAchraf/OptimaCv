'use client';

import Link from 'next/link';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { RecentAnalysisCardProps } from '@/types/dashboard';


const getStatusBadge = (score: number) => {
    if (score >= 80) {
        return {
            text: 'EXCELLENT',
            className: 'bg-gray-900 text-white dark:bg-white dark:text-gray-900',
        };
    } else if (score >= 65) {
        return {
            text: 'GOOD',
            className: 'bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-900',
        };
    } else if (score >= 50) {
        return {
            text: 'AVERAGE',
            className: 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
        };
    } else {
        return {
            text: 'POOR',
            className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700',
        };
    }
};

export function RecentAnalysisCard({ analysis, locale }: RecentAnalysisCardProps) {
    const statusBadge = getStatusBadge(analysis.overall_score);
    const formattedDate = new Date(analysis.created_at).toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <Link href={`/${locale}/dashboard/history/${analysis.id}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 h-full cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:underline transition-all">
                            {analysis.job_title}
                        </h3>
                        {analysis.company_name && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {analysis.company_name}
                            </p>
                        )}
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.className}`}
                    >
                        {statusBadge.text}
                    </span>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{formattedDate}</p>

                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Match Score
                        </span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {analysis.overall_score}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="h-2.5 rounded-full bg-gray-900 dark:bg-white transition-all duration-500"
                            style={{ width: `${analysis.overall_score}%` }}
                        ></div>
                    </div>
                </div>

                <div className="space-y-3">
                    {analysis.top_strengths.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-4 w-4 text-gray-900 dark:text-white" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Strengths
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.top_strengths.slice(0, 3).map((strength, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md border border-gray-200 dark:border-gray-600"
                                    >
                                        {strength}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {analysis.top_improvements.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Improvements
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.top_improvements.slice(0, 3).map((improvement, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md border border-gray-200 dark:border-gray-700"
                                    >
                                        {improvement}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

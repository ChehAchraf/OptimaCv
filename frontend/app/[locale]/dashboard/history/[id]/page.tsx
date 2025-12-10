'use client';

import { PageLoader } from '@/components/loading';
import { motion } from 'framer-motion';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Link } from '@/i18n/routing';
import {
    ArrowLeft,
    Calendar,
    Building,
    Briefcase,
    CheckCircle2,
    TrendingUp,
    Award,
    Share2,
    Download,
    AlertCircle,
    Target,
    Layout,
    Type
} from 'lucide-react';

import { AnalysisResult } from '@/types/dashboard';
import { useExportPdf } from '@/hooks/use-export-pdf';
import { useAnalysis } from '@/hooks/use-analysis';
import { Loader2 } from 'lucide-react';

const SCORE_STYLES = {
    excellent: {
        label: 'Excellent Match',
        color: 'emerald',
        threshold: 70
    },
    good: {
        label: 'Good Potential',
        color: 'amber',
        threshold: 60
    },
    weak: {
        label: 'Needs Improvement',
        color: 'rose',
        threshold: 80
    }
} as const;

const getScoreConfig = (score: number) => {
    if (score >= SCORE_STYLES.excellent.threshold) return SCORE_STYLES.excellent;
    if (score >= SCORE_STYLES.good.threshold) return SCORE_STYLES.good;
    return SCORE_STYLES.weak;
};

const colorVariants = {
    emerald: {
        text: 'text-emerald-500',
        bg: 'bg-emerald-50',
        bgDark: 'dark:bg-emerald-900/20',
        textMain: 'text-emerald-600',
        textDark: 'dark:text-emerald-400',
        border: 'border-emerald-200',
        borderDark: 'dark:border-emerald-800',
        bgLight: 'bg-emerald-100',
        bgDarkLight: 'dark:bg-emerald-900/30',
    },
    amber: {
        text: 'text-amber-500',
        bg: 'bg-amber-50',
        bgDark: 'dark:bg-amber-900/20',
        textMain: 'text-amber-600',
        textDark: 'dark:text-amber-400',
        border: 'border-amber-200',
        borderDark: 'dark:border-amber-800',
        bgLight: 'bg-amber-100',
        bgDarkLight: 'dark:bg-amber-900/30',
    },
    rose: {
        text: 'text-rose-500',
        bg: 'bg-rose-50',
        bgDark: 'dark:bg-rose-900/20',
        textMain: 'text-rose-600',
        textDark: 'dark:text-rose-400',
        border: 'border-rose-200',
        borderDark: 'dark:border-rose-800',
        bgLight: 'bg-rose-100',
        bgDarkLight: 'dark:bg-rose-900/30',
    },
    gray: {
        text: 'text-gray-500',
        bg: 'bg-gray-50',
        bgDark: 'dark:bg-gray-900/20',
        textMain: 'text-gray-600',
        textDark: 'dark:text-gray-400',
        border: 'border-gray-200',
        borderDark: 'dark:border-gray-800',
        bgLight: 'bg-gray-100',
        bgDarkLight: 'dark:bg-gray-900/30',
    },
    blue: {
        text: 'text-blue-500',
        bg: 'bg-blue-50',
        bgDark: 'dark:bg-blue-900/20',
        textMain: 'text-blue-600',
        textDark: 'dark:text-blue-400',
        border: 'border-blue-200',
        borderDark: 'dark:border-blue-800',
        bgLight: 'bg-blue-100',
        bgDarkLight: 'dark:bg-blue-900/30',
    },
    purple: {
        text: 'text-purple-500',
        bg: 'bg-purple-50',
        bgDark: 'dark:bg-purple-900/20',
        textMain: 'text-purple-600',
        textDark: 'dark:text-purple-400',
        border: 'border-purple-200',
        borderDark: 'dark:border-purple-800',
        bgLight: 'bg-purple-100',
        bgDarkLight: 'dark:bg-purple-900/30',
    },
} as const;

function ScoreCircle({ score, color }: { score: number; color: keyof typeof colorVariants }) {
    const styles = colorVariants[color];
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50 h-full">
            <div className="relative h-40 w-40 flex items-center justify-center">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                        strokeWidth="8"
                        stroke="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        strokeLinecap="round"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * score) / 100}
                        r="42"
                        cx="50"
                        cy="50"
                        className={clsx(styles.text, 'transition-all duration-1000')}
                    />
                </svg>

                <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">
                        {score}
                    </span>
                    <span className="text-sm text-gray-500 uppercase tracking-wider mt-1">
                        Score
                    </span>
                </div>
            </div>
        </div>
    );
}

function SectionCard({
    icon,
    title,
    children,
    color,
    className
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    color: keyof typeof colorVariants;
    className?: string;
}) {
    const styles = colorVariants[color];

    return (
        <div className={clsx("bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm", className)}>
            <div className="flex items-center gap-3 mb-6">
                <div
                    className={clsx(
                        'p-3 rounded-xl',
                        styles.bg,
                        styles.bgDark,
                        styles.textMain,
                        styles.textDark
                    )}
                >
                    {icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h2>
            </div>
            {children}
        </div>
    );
}

function BulletList({ items, color }: { items: string[]; color: keyof typeof colorVariants }) {
    const styles = colorVariants[color];

    return (
        <div className="grid gap-4">
            {items.map((item, i) => (
                <div
                    key={i}
                    className={clsx(
                        'flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border transition-colors',
                        'border-gray-100 dark:border-gray-700',
                        `hover:${styles.border}`,
                        `hover:${styles.borderDark}`
                    )}
                >
                    <div
                        className={clsx(
                            'mt-1 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0',
                            styles.bgLight,
                            styles.bgDarkLight,
                            styles.textMain,
                            styles.textDark
                        )}
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                        {item}
                    </span>
                </div>
            ))}
        </div>
    );
}

function ImprovementList({ items }: { items: any[] }) {
    const styles = colorVariants.rose;

    return (
        <div className="grid gap-4">
            {items.map((item, i) => (
                <div
                    key={i}
                    className={clsx(
                        'flex items-start gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border transition-colors',
                        'border-gray-100 dark:border-gray-700',
                        `hover:${styles.border}`,
                        `hover:${styles.borderDark}`
                    )}
                >
                    <div
                        className={clsx(
                            'mt-1 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0',
                            styles.bgLight,
                            styles.bgDarkLight,
                            styles.textMain,
                            styles.textDark
                        )}
                    >
                        <AlertCircle className="h-4 w-4" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 rounded">
                                {item.section}
                            </span>
                            <p className="text-gray-900 dark:text-white font-semibold">
                                {item.issue}
                            </p>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                            <span className="font-medium text-rose-600 dark:text-rose-400 mr-1">Fix:</span>
                            {item.fix}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ScoreBreakdownGrid({ breakdown }: { breakdown: Record<string, number> }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {Object.entries(breakdown).map(([key, value]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-700">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{key.replace(/_/g, ' ')}</div>
                    <div className={clsx(
                        "text-2xl font-black",
                        value >= 70 ? "text-emerald-500" : value >= 50 ? "text-amber-500" : "text-rose-500"
                    )}>
                        {value}%
                    </div>
                </div>
            ))}
        </div>
    );
}

export const dynamic = 'force-dynamic';

export default function AnalysisDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
    const { locale, id } = use(params);
    const router = useRouter();
    const t = useTranslations('Dashboard');

    const { data: analysis, isLoading, error } = useAnalysis(id);

    useEffect(() => {
        if (error) {
            router.push('/dashboard/history');
        }
    }, [error, router]);


    const { mutate: exportPdf, isPending: isExporting, variables: exportVariables, statusLabel } = useExportPdf();

    const handleExport = (actionType: 'export' | 'share') => {
        if (!analysis) return;

        const result = analysis.result as AnalysisResult;

        const score =
            result.cv_coach_analysis?.overall_score ||
            result.analysis_vs_jd?.match_score ||
            result.match_score ||
            result.overall_score ||
            0;

        const config = getScoreConfig(score);

        exportPdf({
            result,
            score,
            config,
            date: new Date().toLocaleDateString(locale, { dateStyle: 'long' }),
            filename: result.job_title || "analysis",
            actionType
        });
    };

    if (isLoading)
        return (
            <DashboardLayout>
                <PageLoader />
            </DashboardLayout>
        );

    if (!analysis)
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <Briefcase className="h-14 w-14 text-gray-400 mb-4" />
                    <h2 className="text-3xl font-bold">Analysis not found</h2>
                    <Link
                        href="/dashboard/history"
                        className="mt-4 inline-flex items-center px-6 py-3 rounded-full bg-gray-900 text-white"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to History
                    </Link>
                </div>
            </DashboardLayout>
        );

    const result = analysis.result as AnalysisResult;

    // Robust Score Extraction
    const score =
        result.cv_coach_analysis?.overall_score ||
        result.analysis_vs_jd?.match_score ||
        result.match_score ||
        result.overall_score ||
        0;

    const config = getScoreConfig(score);

    // Data Extraction
    const strengths = result.cv_coach_analysis?.key_strengths || result.analysis_vs_jd?.strengths || result.strengths || [];

    // For improvements, prefer detailed objects if available, otherwise string list
    const hasDetailedImprovements = result.cv_coach_analysis?.critical_improvements && result.cv_coach_analysis.critical_improvements.length > 0;
    const improvements = result.cv_coach_analysis?.critical_improvements ||
        result.cv_coach_analysis?.areas_for_improvement ||
        result.analysis_vs_jd?.improvements ||
        result.improvements ||
        [];

    // Fallback weaknesses (string only)
    const weaknesses = result.weaknesses || result.analysis_vs_jd?.weaknesses || [];

    const summary = result.cv_coach_analysis?.summary_feedback ||
        result.cv_coach_analysis?.summary ||
        result.analysis_vs_jd?.summary ||
        (typeof result.summary === 'string' ? result.summary : null);

    const scoreBreakdown = result.cv_coach_analysis?.score_breakdown;
    const atsKeywords = result.cv_coach_analysis?.ats_keywords_missing;
    const visualStats = result.visual_analysis; // Assuming this might exist on result based on previous code

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto p-6 space-y-8"
            >
                <nav className="text-sm text-gray-500 flex items-center">
                    <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <Link href="/dashboard/history" className="hover:text-gray-900">History</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {result.job_title || 'Analysis Details'}
                    </span>
                </nav>

                {/* HEADER CARD */}
                <div className="relative bg-white dark:bg-gray-800 border rounded-3xl p-10 shadow-sm">
                    <div className={clsx('absolute top-0 left-0 h-2 w-full rounded-t-3xl', config.color === 'emerald' && 'bg-emerald-500', config.color === 'amber' && 'bg-amber-500', config.color === 'rose' && 'bg-rose-500')} />

                    <div className="flex flex-col lg:flex-row justify-between gap-8 h-full">
                        <div className="flex-1 space-y-6 flex flex-col justify-center">
                            <div>
                                <span
                                    className={clsx(
                                        'px-3 py-1 rounded-full text-xs font-bold uppercase',
                                        config.color === 'emerald' && 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
                                        config.color === 'amber' && 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
                                        config.color === 'rose' && 'bg-rose-50 dark:bg-rose-900/20 text-rose-600'
                                    )}
                                >
                                    {config.label}
                                </span>

                                <div className="mt-2 flex items-center gap-2 text-gray-400">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(analysis.created_at).toLocaleDateString(locale, {
                                        dateStyle: 'long'
                                    })}
                                </div>

                                <h1 className="text-4xl font-extrabold mt-3 text-gray-900 dark:text-white">
                                    {result.job_title || analysis.cv_name}
                                </h1>

                                {result.company_name && (
                                    <div className="flex items-center gap-2 mt-2 text-xl text-gray-600">
                                        <Building className="h-5 w-5" />
                                        {result.company_name}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={() => handleExport('export')}
                                    disabled={isExporting}
                                    className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:opacity-90 transition-all shadow-lg shadow-gray-200 dark:shadow-none disabled:opacity-70 disabled:cursor-not-allowed justify-center"
                                >
                                    {isExporting && exportVariables?.actionType === 'export' ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            {statusLabel}
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-5 w-5 mr-2" />
                                            Export Report
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => handleExport('share')}
                                    disabled={isExporting}
                                    className="inline-flex items-center px-6 py-3 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed justify-center"
                                >
                                    {isExporting && exportVariables?.actionType === 'share' ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            {statusLabel}
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="h-5 w-5 mr-2" />
                                            Share
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            <ScoreCircle score={score} color={config.color} />
                        </div>
                    </div>

                    {/* Score Breakdown if available */}
                    {scoreBreakdown && (
                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                            <ScoreBreakdownGrid breakdown={scoreBreakdown} />
                        </div>
                    )}
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">

                        {summary && (
                            <SectionCard
                                icon={<Briefcase />}
                                title="Executive Summary"
                                color="blue"
                            >
                                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                    {summary}
                                </p>
                            </SectionCard>
                        )}

                        <SectionCard
                            icon={<CheckCircle2 />}
                            title="Key Strengths"
                            color="emerald"
                        >
                            <BulletList
                                color="emerald"
                                items={strengths}
                            />
                        </SectionCard>

                        {/* Critical Improvements (Detailed) or Ordinary Improvements (Simple) */}
                        <SectionCard
                            icon={<TrendingUp />}
                            title={hasDetailedImprovements ? "Critical Improvements" : "Areas for Improvement"}
                            color="rose"
                        >
                            {hasDetailedImprovements ? (
                                <ImprovementList items={improvements as any[]} />
                            ) : (
                                <BulletList
                                    color="rose"
                                    items={improvements as string[]}
                                />
                            )}
                        </SectionCard>

                        {/* Weaknesses (Legacy) */}
                        {(!hasDetailedImprovements && weaknesses.length > 0) && (
                            <SectionCard
                                icon={<AlertCircle />}
                                title="Weaknesses"
                                color="amber"
                            >
                                <BulletList
                                    color="amber"
                                    items={weaknesses}
                                />
                            </SectionCard>
                        )}

                        {/* ATS Keywords */}
                        {atsKeywords && atsKeywords.length > 0 && (
                            <SectionCard
                                icon={<Target />}
                                title="Missing ATS Keywords"
                                color="amber"
                            >
                                <div className="flex flex-wrap gap-2">
                                    {atsKeywords.map((keyword, i) => (
                                        <span key={i} className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium border border-amber-100 dark:border-amber-800">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-4 text-sm text-gray-500">
                                    Adding these keywords can help your CV pass automated Applicant Tracking Systems (ATS).
                                </p>
                            </SectionCard>
                        )}

                        {/* Visual Analysis */}
                        {visualStats && (
                            <SectionCard
                                icon={<Layout />}
                                title="Visual Presentation"
                                color="purple"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-2xl border border-purple-100 dark:border-purple-800">
                                        <div className="text-sm text-purple-600 dark:text-purple-300 font-semibold mb-1">Layout Score</div>
                                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-200">{visualStats.layout_score}/10</div>
                                        <div className="mt-2 text-sm text-purple-800 dark:text-purple-100">{visualStats.overall_professionalism}</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                <Layout className="h-4 w-4 text-gray-500" />
                                                Layout Notes
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{visualStats.layout_notes}</p>
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                <Type className="h-4 w-4 text-gray-500" />
                                                Font Choice
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{visualStats.font_choice_notes}</p>
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>
                        )}

                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-6">
                        <SectionCard icon={<Download />} title="Menu" color="gray" className="lg:sticky lg:top-6">
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleExport('export')}
                                    disabled={isExporting}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
                                >
                                    Download PDF
                                    {isExporting && exportVariables?.actionType === 'export' ? (
                                        <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                                    ) : (
                                        <Download className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleExport('share')}
                                    disabled={isExporting}
                                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white disabled:opacity-50"
                                >
                                    Share Analysis
                                    {isExporting && exportVariables?.actionType === 'share' ? (
                                        <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                                    ) : (
                                        <Share2 className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                    )}
                                </button>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
                                <div>
                                    <span className="text-xs font-semibold uppercase text-gray-500">
                                        Analysis ID
                                    </span>
                                    <div className="font-mono text-xs opacity-70 mt-1 truncate" title={analysis.id}>
                                        {analysis.id}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Completed</span>
                                    </div>
                                </div>
                            </div>
                        </SectionCard>
                    </div>
                </div>
            </motion.div>
        </DashboardLayout>
    );
}

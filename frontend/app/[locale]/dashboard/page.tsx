'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentAnalysisCard } from '@/components/dashboard/RecentAnalysisCard';
import { useTranslations } from 'next-intl';
import { FileText, TrendingUp, Award, CalendarDays, Mic, ChevronRight, Sparkles, LayoutTemplate, BarChart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CVAnalysis, UserStats } from '@/types/dashboard';
import { InterviewAnalysis } from '@/types/type';
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
    const [recentInterviews, setRecentInterviews] = useState<InterviewAnalysis[]>([]);
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

            // Fetch recent interview analyses
            const { data: interviews } = await supabase
                .from('interview_analyses')
                .select('*')
                .eq('user_id', user!.id)
                .eq('is_deleted', false)
                .order('created_at', { ascending: false })
                .limit(3);

            const totalAnalyses = usage?.lifetime_analyses_used || 0;

            const limit = 5;
            const remaining = Math.max(0, limit - totalAnalyses);

            const parsedAnalyses = (analyses || []).map((a: any) => {
                const result = typeof a.result === 'string' ? JSON.parse(a.result) : a.result || {};

                // Robust score extraction logic
                let score = 0;
                if (result.analysis_vs_jd?.match_score !== undefined) {
                    score = result.analysis_vs_jd.match_score;
                } else if (result.cv_coach_analysis?.overall_score !== undefined) {
                    score = result.cv_coach_analysis.overall_score; // New Coach Analysis format
                } else if (result.match_score !== undefined) {
                    score = result.match_score; // Direct property
                } else if (result.overall_score !== undefined) {
                    score = result.overall_score; // Some formats use this
                } else if (result.recruiter_analysis?.match_percentage !== undefined) {
                    score = result.recruiter_analysis.match_percentage; // Enterprise format support
                }

                return {
                    id: a.id,
                    created_at: a.created_at,
                    job_title: result.job_title || a.cv_name || 'Untitled CV',
                    company_name: result.company_name,
                    overall_score: score,
                    status: 'completed' as const,
                    top_strengths: (result.strengths || result.analysis_vs_jd?.strengths || []).slice(0, 3),
                    top_improvements: (result.improvements || result.analysis_vs_jd?.weaknesses || []).slice(0, 3),
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
            setRecentInterviews(interviews || []);

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
                    <h1 className="text-3xl font-bold text-foreground">
                        {t('welcome')}, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
                    </h1>
                    <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area (Charts + Recent CVs) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Score Performance Chart */}
                        {/* Score Performance Chart - Area Chart */}
                        {/* Score Performance Chart - Premium Capsules */}
                        {/* Score Performance Chart - Tech Lollipops */}
                        {/* Score Performance Chart - Fluid Area Trend */}
                        <div className="bg-card rounded-xl p-6 border border-border shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                                    {t('stats.performanceTrend') || "Performance Trend"}
                                </h2>
                                {/* Legend */}
                                <div className="flex gap-4 text-[10px] text-muted-foreground font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <span>Overall Score</span>
                                    </div>
                                </div>
                            </div>

                            {loadingData ? (
                                <div className="h-64 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : recentAnalyses.length > 0 ? (
                                <div className="h-64 w-full relative group/chart">
                                    {(() => {
                                        // 1. Prepare Data
                                        const rawData = recentAnalyses.slice(0, 7).reverse(); // Oldest first
                                        if (rawData.length < 2) {
                                            return (
                                                <div className="h-full flex items-center justify-center text-muted-foreground bg-muted/5 rounded-xl border border-dashed border-border/50">
                                                    <p>Need at least 2 analysis to show trend</p>
                                                </div>
                                            );
                                        }

                                        // 2. Dimensions & Scales
                                        const width = 1000; // Internal SVG coordinate space
                                        const height = 400;
                                        const paddingX = 50;
                                        const paddingY = 40;

                                        const usableWidth = width - (paddingX * 2);
                                        const usableHeight = height - (paddingY * 2);

                                        const maxScore = 100;

                                        // Map data to coordinates
                                        const points = rawData.map((d, i) => {
                                            const x = paddingX + (i / (rawData.length - 1)) * usableWidth;
                                            const y = height - paddingY - (d.overall_score / maxScore) * usableHeight;
                                            return { x, y, ...d };
                                        });

                                        // 3. Smooth Curve Logic (Catmull-Rom to Cubic Bezier)
                                        const line = (pointA: any, pointB: any) => {
                                            const lengthX = pointB.x - pointA.x;
                                            const lengthY = pointB.y - pointA.y;
                                            return {
                                                length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
                                                angle: Math.atan2(lengthY, lengthX)
                                            }
                                        }

                                        const controlPoint = (current: any, previous: any, next: any, reverse?: boolean) => {
                                            const p = previous || current;
                                            const n = next || current;
                                            const smoothing = 0.2; // 0 to 1
                                            const o = line(p, n);
                                            const angle = o.angle + (reverse ? Math.PI : 0);
                                            const length = o.length * smoothing;
                                            const x = current.x + Math.cos(angle) * length;
                                            const y = current.y + Math.sin(angle) * length;
                                            return { x, y };
                                        }

                                        const bezierCommand = (point: any, i: number, a: any[]) => {
                                            const cps = controlPoint(a[i - 1], a[i - 2], point);
                                            const cpe = controlPoint(point, a[i - 1], a[i + 1], true);
                                            return `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`;
                                        }

                                        const dPath = points.reduce((acc, point, i, a) => {
                                            if (i === 0) return `M ${point.x},${point.y}`;
                                            return `${acc} ${bezierCommand(point, i, a)}`;
                                        }, '');

                                        const dFill = `${dPath} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

                                        return (
                                            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                                <defs>
                                                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                                                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                                    </linearGradient>
                                                    {/* Filter for glow effect */}
                                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                                        <feMerge>
                                                            <feMergeNode in="coloredBlur" />
                                                            <feMergeNode in="SourceGraphic" />
                                                        </feMerge>
                                                    </filter>
                                                </defs>

                                                {/* Y Axis Grid & Labels */}
                                                {[0, 50, 100].map(val => {
                                                    const y = height - paddingY - (val / 100) * usableHeight;
                                                    return (
                                                        <g key={val}>
                                                            <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                                                            <text x={paddingX - 10} y={y + 5} textAnchor="end" className="text-xs fill-muted-foreground font-mono">{val}%</text>
                                                        </g>
                                                    )
                                                })}

                                                {/* The Fill Area */}
                                                <path d={dFill} fill="url(#purpleGradient)" className="transition-all duration-1000 ease-in-out" />

                                                {/* The Stroke Line */}
                                                <path d={dPath} fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" filter="url(#glow)" className="transition-all duration-1000 ease-in-out" />

                                                {/* Interactive Points & Vertical Scanning Lines */}
                                                {points.map((p, i) => (
                                                    <g key={p.id} className="group/data-point">
                                                        {/* Invisible Hover Zone (Vertical columns) */}
                                                        <rect
                                                            x={i === 0 ? 0 : (points[i - 1].x + p.x) / 2}
                                                            y={0}
                                                            width={i === points.length - 1 ? (width - p.x) + (p.x - points[i - 1].x) / 2 : (points[i + 1].x - p.x) / 2 + (i === 0 ? p.x : (p.x - points[i - 1].x) / 2)}
                                                            height={height}
                                                            fill="transparent"
                                                            className="cursor-crosshair"
                                                        />

                                                        {/* Vertical Guide Line (Only visible on group hover) */}
                                                        <line
                                                            x1={p.x} y1={paddingY} x2={p.x} y2={height - paddingY}
                                                            stroke="#6366f1" strokeWidth="1" strokeDasharray="4 4"
                                                            className="opacity-0 group-hover/data-point:opacity-50 transition-opacity"
                                                        />

                                                        {/* Data Point Dot */}
                                                        <circle cx={p.x} cy={p.y} r="6" fill="#6366f1" stroke="white" strokeWidth="3" className="opacity-0 group-hover/data-point:opacity-100 transition-all duration-200" />

                                                        {/* Default Visible Small Dot (so chart isn't empty) */}
                                                        <circle cx={p.x} cy={p.y} r="3" fill="#6366f1" className="opacity-100" />

                                                        {/* Tooltip Card */}
                                                        <foreignObject x={Math.min(p.x - 75, width - 180)} y={20} width="160" height="80" className="pointer-events-none opacity-0 group-hover/data-point:opacity-100 transition-opacity duration-200 overflow-visible">
                                                            <div className="bg-popover/95 backdrop-blur-sm shadow-xl rounded-lg p-3 border border-indigo-500/20 text-xs text-popover-foreground transform translate-y-2">
                                                                <div className="font-bold text-sm mb-1 text-indigo-500">{p.overall_score}% Score</div>
                                                                <div className="font-medium truncate">{p.job_title}</div>
                                                                <div className="text-muted-foreground mt-1 text-[10px]">{new Date(p.created_at).toLocaleDateString()}</div>
                                                            </div>
                                                        </foreignObject>

                                                        {/* X Axis Label */}
                                                        <text x={p.x} y={height - 10} textAnchor="middle" className="text-xs fill-muted-foreground font-medium opacity-70">
                                                            {new Date(p.created_at).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}
                                                        </text>
                                                    </g>
                                                ))}

                                            </svg>
                                        );
                                    })()}
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border">
                                    <BarChart className="w-12 h-12 mb-2 opacity-20" aria-hidden="true" />
                                    <p>Not enough data for chart</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Analyses List */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-purple-500" aria-hidden="true" />
                                    {t('recentAnalyses.title')}
                                </h2>
                                <Link
                                    href="/dashboard/history"
                                    className="text-sm text-primary hover:text-primary/90 font-medium hover:underline"
                                >
                                    {t('recentAnalyses.viewAll')}
                                </Link>
                            </div>

                            {loadingData ? (
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
                                    ))}
                                </div>
                            ) : recentAnalyses.length > 0 ? (
                                <div className="space-y-4">
                                    {recentAnalyses.slice(0, 3).map((analysis) => (
                                        <RecentAnalysisCard key={analysis.id} analysis={analysis} locale={locale} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-card rounded-xl border border-border">
                                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                                    <p className="mt-2 text-muted-foreground">{t('recentAnalyses.empty.description')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Secondary Column */}
                    <div className="space-y-8">

                        {/* Quick Actions */}
                        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link href="/CV_analyze" className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                    <Sparkles className="w-5 h-5 mr-3" aria-hidden="true" />
                                    <span className="font-medium">Optimize a CV</span>
                                </Link>
                                <Link href="/interview" className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                                    <Mic className="w-5 h-5 mr-3" aria-hidden="true" />
                                    <span className="font-medium">Practice Interview</span>
                                </Link>
                                <Link href="/build-cv" className="flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                                    <LayoutTemplate className="w-5 h-5 mr-3" aria-hidden="true" />
                                    <span className="font-medium">Create New Resume</span>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Interviews */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Mic className="w-5 h-5 text-green-500" aria-hidden="true" />
                                    Interviews
                                </h2>
                                <Link href="/interview/history" className="text-xs text-muted-foreground hover:text-foreground">
                                    View All
                                </Link>
                            </div>

                            {loadingData ? (
                                <div className="space-y-3">
                                    {[1, 2].map(i => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
                                </div>
                            ) : recentInterviews.length > 0 ? (
                                <div className="space-y-3">
                                    {recentInterviews.map((interview) => (
                                        <Link
                                            key={interview.id}
                                            href="/interview/history"
                                            className="block bg-card rounded-lg p-3 border border-border hover:border-primary transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary">
                                                    {interview.question_context}
                                                </p>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${interview.score >= 8 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                    interview.score >= 5 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {interview.score}/10
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(interview.created_at).toLocaleDateString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 bg-card rounded-lg border border-border text-center">
                                    <p className="text-sm text-muted-foreground">No interviews yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Original Recent Interviews Section - This section is replaced by the new sidebar structure */}
                {/*
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Mic className="w-6 h-6" />
                            {t('recentInterviews.title')}
                        </h2>
                        <Link
                            href="/interview/history"
                            className="text-gray-900 hover:text-gray-700 dark:text-white dark:hover:text-gray-300 font-medium underline decoration-gray-300 underline-offset-4 flex items-center gap-1"
                        >
                            {t('recentInterviews.viewAll')}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {loadingData ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-pulse"
                                >
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : recentInterviews.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {recentInterviews.map((interview) => (
                                <Link
                                    key={interview.id}
                                    href="/interview/history"
                                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {interview.question_context.length > 50
                                                    ? interview.question_context.substring(0, 50) + '...'
                                                    : interview.question_context}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {new Date(interview.created_at).toLocaleDateString(locale, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-bold ${interview.score >= 8 ? 'border-green-500 text-green-500' :
                                            interview.score >= 5 ? 'border-yellow-500 text-yellow-500' :
                                                'border-red-500 text-red-500'
                                            }`}>
                                            {interview.score}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                        {interview.feedback.length > 100
                                            ? interview.feedback.substring(0, 100) + '...'
                                            : interview.feedback}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Mic className="mx-auto h-10 w-10 text-gray-400" />
                            <h3 className="mt-3 text-base font-medium text-gray-900 dark:text-white">
                                {t('recentInterviews.empty.title')}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {t('recentInterviews.empty.description')}
                            </p>
                            <Link
                                href="/interview"
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                            >
                                {t('recentInterviews.empty.action')}
                            </Link>
                        </div>
                    )}
                </div>
                */}

                {/* Original Recent CV Analyses Section - This section is replaced by the new main content area structure */}
                {/*
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
                */}
            </div>
        </DashboardLayout>
    );
}

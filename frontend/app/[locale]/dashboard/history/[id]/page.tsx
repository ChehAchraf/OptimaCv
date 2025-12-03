'use client';

import { useEffect, useState, Fragment, JSX, use } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { Link } from '@/i18n/routing';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
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
    AlertCircle
} from 'lucide-react';

import { AnalysisResult, CVAnalysis } from '@/types/dashboard';



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
} as const;



function ScoreCircle({ score, color }: { score: number; color: keyof typeof colorVariants }) {
    const styles = colorVariants[color];
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700/50">
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
    color
}: {
    icon: JSX.Element;
    title: string;
    children: React.ReactNode;
    color: keyof typeof colorVariants;
}) {
    const styles = colorVariants[color];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
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
                            'mt-1 h-5 w-5 rounded-full flex items-center justify-center',
                            styles.bgLight,
                            styles.bgDarkLight,
                            styles.textMain,
                            styles.textDark
                        )}
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {item}
                    </span>
                </div>
            ))}
        </div>
    );
}






const getReportHTML = (result: AnalysisResult, score: number, config: { label: string; color: string }, date: string) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 40px; color: #000; background: #fff; width: 210mm; box-sizing: border-box;">
            <div style="border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px; color: #111;">Analysis Report</h1>
                <p style="color: #666; margin: 5px 0 0; font-size: 14px;">Generated on ${date}</p>
            </div>

            <div style="margin-bottom: 30px;">
                <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px;">Overview</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Job Title:</td>
                        <td style="padding: 8px 0; color: #000;">${result.job_title || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #555;">Company:</td>
                        <td style="padding: 8px 0; color: #000;">${result.company_name || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #555;">Match Score:</td>
                        <td style="padding: 8px 0;">
                            <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; background-color: ${score >= 70 ? '#d1fae5' : score >= 60 ? '#fef3c7' : '#ffe4e6'}; color: ${score >= 70 ? '#065f46' : score >= 60 ? '#92400e' : '#9f1239'}; font-weight: bold;">
                                ${score}/100 - ${config.label}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>

            ${result.analysis_vs_jd?.summary ? `
            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; margin-bottom: 12px;">Executive Summary</h3>
                <p style="line-height: 1.6; font-size: 14px; color: #444; margin: 0;">
                    ${result.analysis_vs_jd.summary}
                </p>
            </div>
            ` : ''}

            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; margin-bottom: 12px;">Key Strengths</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    ${(result.strengths || result.analysis_vs_jd?.strengths || []).slice(0, 5).map(item =>
        `<li style="margin-bottom: 8px; font-size: 14px; color: #444;">${item}</li>`
    ).join('')}
                </ul>
            </div>

            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; margin-bottom: 12px;">Areas for Improvement</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    ${(result.improvements || result.analysis_vs_jd?.improvements || []).slice(0, 5).map(item =>
        `<li style="margin-bottom: 8px; font-size: 14px; color: #444;">${item}</li>`
    ).join('')}
                </ul>
            </div>
            
            <div style="margin-top: 50px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
                Powered by OptimaCV
            </div>
        </div>
    `;
};

export default function AnalysisDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
    const { locale, id } = use(params);
    const router = useRouter();
    const t = useTranslations('Dashboard');

    const [analysis, setAnalysis] = useState<CVAnalysis | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const supabase = createClient();

                const { data, error } = await supabase
                    .from('ai_cv_results')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;

                const parsed =
                    typeof data.result === 'string'
                        ? JSON.parse(data.result)
                        : data.result;

                setAnalysis({ ...data, result: parsed });
            } catch (err) {
                router.push('/dashboard/history');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);


    const handleExportPDF = async () => {
        const htmlContent = getReportHTML(
            result,
            score,
            config,
            new Date().toLocaleDateString(locale, { dateStyle: 'long' })
        );

        const container = document.createElement('div');
        container.innerHTML = htmlContent;
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        try {
            const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${result.job_title || "analysis"}.pdf`);
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            document.body.removeChild(container);
        }
    };



    if (loading)
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Award className="animate-spin h-12 w-12 text-gray-900 dark:text-white" />
                </div>
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
    const score = result.analysis_vs_jd?.match_score || 0;
    const config = getScoreConfig(score);

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto p-6 space-y-8">

                {/* NAV */}
                <nav className="text-sm text-gray-500 flex items-center">
                    <Link href="/dashboard" className="hover:text-gray-900">Dashboard</Link>
                    <span className="mx-2">/</span>
                    <Link href="/dashboard/history" className="hover:text-gray-900">History</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {result.job_title || 'Analysis Details'}
                    </span>
                </nav>

                {/* HERO */}
                <div className="relative bg-white dark:bg-gray-800 border rounded-3xl p-10 shadow-sm">
                    <div className={clsx('absolute top-0 left-0 h-2 w-full', config.color === 'emerald' && 'bg-emerald-500', config.color === 'amber' && 'bg-amber-500', config.color === 'rose' && 'bg-rose-500')} />

                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <div className="flex-1 space-y-6">
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

                                <h1 className="text-4xl font-extrabold mt-3">
                                    {result.job_title || analysis.cv_name}
                                </h1>

                                {result.company_name && (
                                    <div className="flex items-center gap-2 mt-2 text-xl text-gray-600">
                                        <Building className="h-5 w-5" />
                                        {result.company_name}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleExportPDF()}
                                    className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:opacity-90 transition-all shadow-lg shadow-gray-200 dark:shadow-none"
                                >
                                    <Download className="h-4 w-4 mr-2" /> Export Report
                                </button>

                                <button
                                    onClick={async () => {
                                        await handleExportPDF();
                                        window.open('https://www.linkedin.com/feed/', '_blank');
                                        alert("PDF Downloaded! Please upload it to your LinkedIn post.");
                                    }}
                                    className="inline-flex items-center px-5 py-2.5 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                                >
                                    <Share2 className="h-4 w-4 mr-2" /> Share on LinkedIn
                                </button>
                            </div>
                        </div>

                        <ScoreCircle score={score} color={config.color} />
                    </div>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 no-advanced-colors" id="export-section">
                    <div className="lg:col-span-2 space-y-8">

                        {result.analysis_vs_jd?.summary && (
                            <SectionCard
                                icon={<Briefcase />}
                                title="Executive Summary"
                                color="blue"
                            >
                                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                    {result.analysis_vs_jd.summary}
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
                                items={result.strengths || result.analysis_vs_jd?.strengths || []}
                            />
                        </SectionCard>

                        <SectionCard
                            icon={<TrendingUp />}
                            title="Areas for Improvement"
                            color="amber"
                        >
                            <BulletList
                                color="amber"
                                items={result.improvements || result.analysis_vs_jd?.improvements || []}
                            />
                        </SectionCard>

                        {(result.weaknesses || result.analysis_vs_jd?.weaknesses) && (
                            <SectionCard
                                icon={<AlertCircle />}
                                title="Weaknesses"
                                color="rose"
                            >
                                <BulletList
                                    color="rose"
                                    items={result.weaknesses || result.analysis_vs_jd?.weaknesses || []}
                                />
                            </SectionCard>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="space-y-6">
                        <SectionCard icon={<Download />} title="Quick Actions" color="gray">
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white">
                                    Download PDF <Download className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                </button>
                                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group text-gray-700 dark:text-gray-300 font-medium hover:text-gray-900 dark:hover:text-white">
                                    Share Analysis <Share2 className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                </button>
                            </div>
                        </SectionCard>

                        <SectionCard icon={<Award />} title="Details" color="gray">
                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <p>
                                    <span className="text-xs font-semibold uppercase text-gray-500">
                                        Created
                                    </span>
                                    <br />
                                    {new Date(analysis.created_at).toLocaleDateString(locale, {
                                        dateStyle: 'full'
                                    })}
                                </p>

                                <p>
                                    <span className="text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </span>
                                    <br />
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                        Completed
                                    </span>
                                </p>

                                <p>
                                    <span className="text-xs font-semibold uppercase text-gray-500">
                                        ID
                                    </span>
                                    <br />
                                    <span className="font-mono text-xs opacity-70">{analysis.id}</span>
                                </p>
                            </div>
                        </SectionCard>
                    </div>
                </div>
                {/* HIDDEN SIMPLE PDF CONTENT */}
                <div id="simple-pdf-content" style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: 0,
                    width: '210mm',
                    padding: '20mm',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    fontFamily: 'Arial, sans-serif'
                }}>
                    <div style={{ borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>OptimaCV Analysis Report</h1>
                        <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                            Generated on {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>Analysis Details</h2>
                        <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '8px 0', fontWeight: 'bold', width: '150px' }}>Job Title:</td>
                                    <td>{result.job_title || analysis.cv_name}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Company:</td>
                                    <td>{result.company_name || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Match Score:</td>
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: score >= 70 ? '#d1fae5' : score >= 60 ? '#fef3c7' : '#ffe4e6',
                                            color: score >= 70 ? '#065f46' : score >= 60 ? '#92400e' : '#9f1239',
                                            fontWeight: 'bold'
                                        }}>
                                            {score}/100 - {config.label}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {result.analysis_vs_jd?.summary && (
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Executive Summary</h3>
                            <p style={{ marginTop: '10px', lineHeight: '1.6', fontSize: '14px' }}>
                                {result.analysis_vs_jd.summary}
                            </p>
                        </div>
                    )}

                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Key Strengths</h3>
                        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                            {(result.strengths || result.analysis_vs_jd?.strengths || []).slice(0, 5).map((item, i) => (
                                <li key={i} style={{ marginBottom: '8px', fontSize: '14px' }}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>Areas for Improvement</h3>
                        <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                            {(result.improvements || result.analysis_vs_jd?.improvements || []).slice(0, 5).map((item, i) => (
                                <li key={i} style={{ marginBottom: '8px', fontSize: '14px' }}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginTop: '50px', fontSize: '12px', color: '#999', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                        Powered by OptimaCV
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

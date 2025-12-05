"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    FileText,
    Loader2,
    CheckCircle2,
    Sparkles,
    Trophy,
    Calendar,
    Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getEnterpriseAnalysisById } from "@/app/actions/enterpriseActions";
import { EnterpriseAnalysis, EnterpriseAnalysisResult } from "@/types/enterprise";
import { useToast } from "@/hooks/use-toast";

// Helper to safely access analysis properties
const getSafeResult = (result: any): EnterpriseAnalysisResult => {
    // If it's a raw JSON object from the 'results' column, it might not have the exact shape defined in Types
    // especially if we bypassed the DB relations. We normalize it here.
    return {
        id: result.id || `temp-${Math.random()}`,
        analysis_id: result.analysis_id || "",
        cv_id: result.cv_id || "",
        match_score: result.match_score || 0,
        summary: result.summary || "",
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        detailed_analysis: result.detailed_analysis || {},
        rank: result.rank || 0,
        created_at: result.created_at || new Date().toISOString(),
        // Add minimal mock CV if missing
        cv: result.cv || {
            file_name: result.filename || "Unknown File",
            candidate_name: result.contact_info?.name || "Unknown Candidate",
            candidate_email: result.contact_info?.email
        }
    } as EnterpriseAnalysisResult;
};

export default function AnalysisDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [analysis, setAnalysis] = useState<EnterpriseAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!params.id) return;
            try {
                const data = await getEnterpriseAnalysisById(params.id as string);
                if (data) {
                    setAnalysis(data);
                } else {
                    toast({ title: "Analysis not found", variant: "destructive" });
                    router.push("/entreprise");
                }
            } catch (error) {
                console.error("Error fetching analysis:", error);
                toast({ title: "Failed to load analysis", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [params.id, router, toast]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!analysis) return null;

    // Normalize results
    const results = (analysis.results || []).map(getSafeResult).sort((a, b) => a.rank - b.rank);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/entreprise")}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Analysis Report
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(analysis.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {analysis.analyzed_count} Candidates
                            </span>
                        </div>
                    </div>
                </div>

                {/* Job Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            Job Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {analysis.job_title && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Job Title</h3>
                                <p className="font-medium">{analysis.job_title}</p>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">Job Description</h3>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
                                {analysis.job_description}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Ranking Results
                        </CardTitle>
                        <CardDescription>
                            Top candidates ranked by AI analysis score
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {results.map((result, index) => (
                                <div
                                    key={index}
                                    className={`
                                        p-4 rounded-xl border-2 transition-all
                                        ${index === 0
                                            ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10"
                                            : index === 1
                                                ? "border-gray-300 bg-gray-50 dark:bg-gray-800/50"
                                                : index === 2
                                                    ? "border-amber-600 bg-amber-50 dark:bg-amber-900/10"
                                                    : "border-gray-200 dark:border-gray-700"
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`
                                            w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0
                                            ${index === 0
                                                ? "bg-yellow-400 text-yellow-900"
                                                : index === 1
                                                    ? "bg-gray-300 text-gray-700"
                                                    : index === 2
                                                        ? "bg-amber-600 text-white"
                                                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                            }
                                        `}>
                                            #{result.rank}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                                        {result.cv?.candidate_name || result.cv?.file_name || "Unknown Candidate"}
                                                    </h3>
                                                    {result.cv?.candidate_email && (
                                                        <p className="text-sm text-gray-500">
                                                            {result.cv.candidate_email}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-3xl font-bold text-blue-600">
                                                        {result.match_score}%
                                                    </div>
                                                    <p className="text-xs text-gray-500">Match Score</p>
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                {result.summary}
                                            </p>

                                            {result.strengths && result.strengths.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {result.strengths.slice(0, 3).map((strength: string, i: number) => (
                                                        <Badge
                                                            key={i}
                                                            variant="secondary"
                                                            className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                        >
                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                            {strength}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {results.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No results found for this analysis.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    FileText,
    Loader2,
    CheckCircle2,
    Sparkles,
    Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { rankStoredCandidates } from "@/app/actions/company";
import { saveDirectAnalysisResults, getEnterpriseCVsByIds, deleteMultipleEnterpriseCVs } from "@/app/actions/enterpriseActions";
import { processSingleBatch } from "@/app/actions/bulkAnalysis";
import { useToast } from "@/hooks/use-toast";
import { EnterpriseCV } from "@/types/enterprise";

type AnalysisStep = "configure" | "analyzing" | "results";

import { Suspense } from "react";

function AnalyzeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    // Get IDs from URL - handle potential string parsing issues
    const idsString = searchParams.get("ids");
    const cvIds = idsString
        ? idsString.split(",").map(id => id.trim()).filter(id => id.length > 0)
        : [];

    const [step, setStep] = useState<AnalysisStep>("configure");
    const [cvs, setCvs] = useState<EnterpriseCV[]>([]);
    const [isLoadingCVs, setIsLoadingCVs] = useState(true);
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [results, setResults] = useState<any[]>([]);
    const [analysisId, setAnalysisId] = useState<string | null>(null);

    // Batch processing state
    const [currentBatch, setCurrentBatch] = useState(0);
    const [totalBatches, setTotalBatches] = useState(0);
    const [processedCount, setProcessedCount] = useState(0);
    const [batchErrors, setBatchErrors] = useState<string[]>([]);

    // Fetch CV details on mount
    useEffect(() => {
        let isMounted = true;

        const loadCVs = async () => {
            if (cvIds.length === 0) {
                if (isMounted) setIsLoadingCVs(false);
                return;
            }

            try {
                // Ensure IDs are unique
                const uniqueIds = Array.from(new Set(cvIds));
                const data = await getEnterpriseCVsByIds(uniqueIds);
                console.log("Fetched CVs for analysis:", data);

                if (isMounted) {
                    setCvs(data);

                    if (data.length === 0 && cvIds.length > 0) {
                        toast({
                            title: "Could not find selected CVs",
                            description: "The CVs might have been deleted or you don't have access.",
                            variant: "destructive"
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to load CVs:", error);
                if (isMounted) {
                    toast({ title: "Failed to load selected CVs", variant: "destructive" });
                }
            } finally {
                if (isMounted) setIsLoadingCVs(false);
            }
        };

        loadCVs();
        return () => { isMounted = false; };
    }, [idsString]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle analysis with batch processing
    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            toast({ title: "Please enter a job description", variant: "destructive" });
            return;
        }

        if (cvs.length === 0) {
            toast({ title: "No CVs selected for analysis", variant: "destructive" });
            return;
        }

        // Pre-flight check: Filter out metadata-only CVs (file_size = 0 or null)
        const validCVs = cvs.filter(cv => cv.file_size && cv.file_size > 0);
        const metadataOnlyCVs = cvs.filter(cv => !cv.file_size || cv.file_size === 0);

        if (metadataOnlyCVs.length > 0) {
            const metadataNames = metadataOnlyCVs.map(cv => cv.file_name).join(", ");
            toast({
                title: "Some CVs cannot be analyzed",
                description: `${metadataOnlyCVs.length} CV(s) are metadata-only records without source files: ${metadataNames}. These were likely from previous direct analyses. Please re-upload them to analyze.`,
                variant: "destructive",
                duration: 10000
            });
        }

        if (validCVs.length === 0) {
            toast({
                title: "No valid CVs to analyze",
                description: "All selected CVs are metadata-only records without source files. Please upload new CVs with files to analyze them.",
                variant: "destructive",
                duration: 8000
            });
            return;
        }

        // Update CVs list to only include valid ones
        setCvs(validCVs);

        setIsAnalyzing(true);
        setStep("analyzing");
        setAnalysisProgress(5);
        setBatchErrors([]);
        setProcessedCount(0);

        try {
            const BATCH_SIZE = 5; // Process 5 CVs at a time
            const cvIdsList = validCVs.map(cv => cv.id); // Use validCVs, not cvs
            const batches: string[][] = [];

            // Split CVs into batches
            for (let i = 0; i < cvIdsList.length; i += BATCH_SIZE) {
                batches.push(cvIdsList.slice(i, i + BATCH_SIZE));
            }

            setTotalBatches(batches.length);
            console.log(`Processing ${cvIdsList.length} valid CVs in ${batches.length} batches of ${BATCH_SIZE}`);

            const allResults: any[] = [];
            const errors: string[] = [];

            // Process each batch
            for (let i = 0; i < batches.length; i++) {
                setCurrentBatch(i + 1);
                const batch = batches[i];

                console.log(`Processing batch ${i + 1}/${batches.length}`);

                try {
                    const batchResult = await processSingleBatch({
                        cvIds: batch,
                        jobDescription,
                        batchIndex: i,
                        totalBatches: batches.length
                    });

                    if (batchResult.success) {
                        allResults.push(...batchResult.results);
                        setProcessedCount(prev => prev + batchResult.results.length);
                    } else {
                        errors.push(`Batch ${i + 1}: ${batchResult.error || 'Unknown error'}`);
                    }
                } catch (error: any) {
                    console.error(`Error in batch ${i + 1}:`, error);
                    errors.push(`Batch ${i + 1}: ${error.message || 'Processing failed'}`);
                }

                // Update progress
                const progress = Math.min(90, 5 + ((i + 1) / batches.length) * 85);
                setAnalysisProgress(Math.round(progress));
            }

            setBatchErrors(errors);

            if (allResults.length === 0) {
                throw new Error("No CVs were successfully analyzed. " + (errors.length > 0 ? errors.join("; ") : ""));
            }

            // Rank all results by match score
            const rankedResults = allResults
                .sort((a, b) => b.match_score - a.match_score)
                .map((result, index) => ({
                    ...result,
                    rank: index + 1,
                    cv_id: cvs.find(cv => cv.file_name === result.filename)?.id
                }));

            setAnalysisProgress(95);

            // Save results to history
            try {
                const id = await saveDirectAnalysisResults({
                    job_title: jobTitle || undefined,
                    job_description: jobDescription,
                    results: rankedResults
                });
                setAnalysisId(id);
            } catch (saveError) {
                console.error("Failed to save history:", saveError);
                // Don't block UI flow if saving fails
            }

            setAnalysisProgress(100);
            setResults(rankedResults);
            setStep("results");

            // Show success toast with warnings if any
            if (errors.length > 0) {
                toast({
                    title: `Analysis completed with warnings`,
                    description: `${rankedResults.length} CVs analyzed successfully. ${errors.length} batch(es) had issues.`,
                    variant: "default"
                });
            } else {
                toast({ title: "Analysis completed successfully!" });
            }
        } catch (error: any) {
            console.error("Analysis error:", error);
            toast({
                title: "Analysis failed",
                description: error.message || "Please try again later",
                variant: "destructive"
            });
            setStep("configure");
        } finally {
            setIsAnalyzing(false);
        }
    };

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
                            Analyze Selected CVs
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {cvs.length > 0 ? (
                                <>
                                    {cvs.filter(cv => cv.file_size && cv.file_size > 0).length} valid CV(s)
                                    {cvs.filter(cv => !cv.file_size || cv.file_size === 0).length > 0 && (
                                        <span className="text-yellow-600"> ({cvs.filter(cv => !cv.file_size || cv.file_size === 0).length} metadata-only)</span>
                                    )}
                                </>
                            ) : (
                                "No candidates selected"
                            )}
                        </p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4">
                    {["configure", "analyzing", "results"].map((s, i) => (
                        <div key={s} className="flex items-center">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-medium
                                ${step === s
                                    ? "bg-blue-600 text-white"
                                    : i < ["configure", "analyzing", "results"].indexOf(step)
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                                }
                            `}>
                                {i < ["configure", "analyzing", "results"].indexOf(step) ? (
                                    <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                    i + 1
                                )}
                            </div>
                            {i < 2 && (
                                <div className={`w-24 h-1 mx-2 ${i < ["configure", "analyzing", "results"].indexOf(step)
                                    ? "bg-green-500"
                                    : "bg-gray-200 dark:bg-gray-700"
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                {step === "configure" && (
                    <div className="space-y-6">
                        {/* Selected CVs List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Selected Candidates ({cvs.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingCVs ? (
                                    <div className="flex justify-center py-4">
                                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                    </div>
                                ) : cvs.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-2">
                                            {cvs.map((cv) => {
                                                const hasFile = cv.file_size && cv.file_size > 0;
                                                return (
                                                    <Badge
                                                        key={cv.id}
                                                        variant={hasFile ? "secondary" : "destructive"}
                                                        className={`py-2 px-3 flex items-center gap-2 ${!hasFile ? "opacity-60" : ""
                                                            }`}
                                                    >
                                                        <FileText className={`w-4 h-4 ${hasFile ? "text-blue-500" : "text-red-400"
                                                            }`} />
                                                        <span className="max-w-[200px] truncate">
                                                            {cv.candidate_name || cv.file_name}
                                                        </span>
                                                        {!hasFile && (
                                                            <span className="text-xs ml-1">⚠️</span>
                                                        )}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                        {cvs.some(cv => !cv.file_size || cv.file_size === 0) && (
                                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                                    ⚠️ CVs marked with warning are metadata-only records without source files. They will be skipped during analysis.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No CVs selected. Please go back to the dashboard to select candidates.</p>
                                        <Button
                                            variant="link"
                                            onClick={() => router.push("/entreprise")}
                                            className="mt-2"
                                        >
                                            Go to Dashboard
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Job Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Job Details
                                </CardTitle>
                                <CardDescription>
                                    Enter the job requirements to match candidates against
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="job-title">Job Title (Optional)</Label>
                                    <Input
                                        id="job-title"
                                        placeholder="e.g., Senior Software Engineer"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="job-description">
                                        Job Description <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="job-description"
                                        placeholder="Paste the full job description here..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="min-h-[200px]"
                                    />
                                </div>

                                <Button
                                    onClick={handleAnalyze}
                                    disabled={!jobDescription.trim() || cvs.length === 0 || isAnalyzing}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 mr-2" />
                                            Analyze {cvs.length} CV(s)
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {step === "analyzing" && (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center space-y-6">
                                <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        Analyzing {cvs.length} CVs in Batches...
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Our AI is ranking candidates against your job description
                                    </p>
                                    {totalBatches > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Processing Batch {currentBatch} of {totalBatches}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {processedCount} / {cvs.length} CVs processed
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="max-w-md mx-auto">
                                    <Progress value={analysisProgress} className="h-2" />
                                    <p className="text-sm text-gray-500 mt-2">{analysisProgress}%</p>
                                </div>
                                {batchErrors.length > 0 && (
                                    <div className="max-w-md mx-auto mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                        <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                            Some batches encountered issues, but processing continues...
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {step === "results" && (
                    <div className="space-y-6">
                        {/* Warning Banner for Batch Errors */}
                        {batchErrors.length > 0 && (
                            <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
                                <CardHeader>
                                    <CardTitle className="text-yellow-800 dark:text-yellow-200 text-base">
                                        ⚠️ Some CVs Could Not Be Processed
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                            The following batches encountered issues:
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 text-xs text-yellow-600 dark:text-yellow-400">
                                            {batchErrors.map((error, idx) => (
                                                <li key={idx}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-yellow-500" />
                                    Ranking Results ({results.length} Candidates)
                                </CardTitle>
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
                                                                {result.contact_info?.name || result.filename}
                                                            </h3>
                                                            {result.contact_info?.email && (
                                                                <p className="text-sm text-gray-500">
                                                                    {result.contact_info.email}
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
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex gap-4 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/entreprise")}
                            >
                                Back to Dashboard
                            </Button>
                            <Button
                                onClick={() => {
                                    setStep("configure");
                                    // Keep CVs selected
                                    setJobDescription("");
                                    setJobTitle("");
                                    setResults([]);
                                    setAnalysisId(null);
                                }}
                            >
                                Analyze More CVs
                            </Button>
                            {analysisId && (
                                <Button
                                    variant="secondary"
                                    onClick={() => router.push(`/entreprise/analysis/${analysisId}`)}
                                >
                                    View Full Report
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AnalyzePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <AnalyzeContent />
        </Suspense>
    );
}

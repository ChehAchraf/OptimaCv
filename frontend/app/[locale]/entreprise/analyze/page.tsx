"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    FileText,
    Loader2,
    CheckCircle2,
    Sparkles,
    Trophy,
    Upload,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { rankCandidates } from "@/app/actions/company";
import { saveDirectAnalysisResults } from "@/app/actions/enterpriseActions";
import { useToast } from "@/hooks/use-toast";

type AnalysisStep = "configure" | "analyzing" | "results";

export default function AnalyzePage() {
    const router = useRouter();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState<AnalysisStep>("configure");
    const [files, setFiles] = useState<File[]>([]);
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [results, setResults] = useState<any[]>([]);
    const [analysisId, setAnalysisId] = useState<string | null>(null);

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).filter(
                file => file.type === "application/pdf"
            );
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    // Remove file
    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Handle drag and drop
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            const newFiles = Array.from(e.dataTransfer.files).filter(
                file => file.type === "application/pdf"
            );
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    // Handle analysis
    const handleAnalyze = async () => {
        if (!jobDescription.trim()) {
            toast({ title: "Please enter a job description", variant: "destructive" });
            return;
        }

        if (files.length === 0) {
            toast({ title: "Please upload at least one CV", variant: "destructive" });
            return;
        }

        setIsAnalyzing(true);
        setStep("analyzing");
        setAnalysisProgress(20);

        try {
            // Call the ranking API with actual files
            const response = await rankCandidates({
                jobDescription,
                files: files
            });

            setAnalysisProgress(80);

            // Process results
            const rankedResults = response.ranked_results.map((result: any, index: number) => ({
                match_score: result.analysis.match_score ?? 0,
                summary: result.analysis.summary ?? "",
                strengths: result.analysis.strengths ?? [],
                weaknesses: result.analysis.weaknesses ?? [],
                rank: index + 1,
                filename: result.filename,
                contact_info: result.analysis.contact_info,
                detailed_analysis: result.analysis.detailed_analysis || {}
            }));

            setAnalysisProgress(90);

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

            toast({ title: "Analysis completed successfully!" });
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
                            Bulk CV Analysis
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Upload CVs and rank candidates against a job description
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
                        {/* CV Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    1. Upload CVs
                                </CardTitle>
                                <CardDescription>
                                    Upload the candidate CVs you want to analyze (PDF only)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                                        Drop CVs here or click to upload
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        PDF files only
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                {files.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {files.length} file(s) selected
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setFiles([])}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                Clear all
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {files.map((file, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="secondary"
                                                    className="py-2 px-3 flex items-center gap-2"
                                                >
                                                    <FileText className="w-4 h-4 text-red-500" />
                                                    <span className="max-w-[150px] truncate">{file.name}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFile(index);
                                                        }}
                                                        className="ml-1 hover:text-red-500"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Job Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    2. Job Details
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
                                    disabled={!jobDescription.trim() || files.length === 0 || isAnalyzing}
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
                                            Analyze {files.length} CV(s)
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
                                        Analyzing {files.length} CVs...
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Our AI is ranking candidates against your job description
                                    </p>
                                </div>
                                <div className="max-w-md mx-auto">
                                    <Progress value={analysisProgress} className="h-2" />
                                    <p className="text-sm text-gray-500 mt-2">{analysisProgress}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {step === "results" && (
                    <div className="space-y-6">
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
                                    setFiles([]);
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

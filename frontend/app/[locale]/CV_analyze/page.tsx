'use client';

import { Suspense, useState } from 'react';
import { analyzeCv } from "@/app/[locale]/profile/actions/analyzeCv";
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HiExclamation, HiUpload, HiDocumentText, HiPhotograph, HiCheckCircle } from 'react-icons/hi';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CardLoader } from '@/components/loading';
import { motion, AnimatePresence } from 'framer-motion';
import { cvPayloadSchema, validateData, formatZodErrors } from '@/lib/validations';
import { ZodError } from 'zod';

export default function CVAnalyze() {
    const t = useTranslations('CVAnalyze');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [filePDF, setFilePDF] = useState<File | null>(null);
    const [fileImage, setFileImage] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [analyzeVisuals, setAnalyzeVisuals] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<any | null>(null);

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFilePDF(e.target.files[0]);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!filePDF || !jobDescription) {
            setError(t('form.errorMissing'));
            return;
        }

        if (analyzeVisuals && !fileImage) {
            setError(t('form.errorVisual'));
            return;
        }

        const payloadData: any = {
            cv_pdf: filePDF,
            job_description: jobDescription,
        };

        if (analyzeVisuals && fileImage) {
            payloadData.cv_image = fileImage;
        }

        const validationResult = validateData(cvPayloadSchema, payloadData);

        if (!validationResult.success) {
            const firstError = Object.values(validationResult.errors)[0]?.[0];
            setError(firstError || t('form.errorMissing'));
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const response = await analyzeCv(validationResult.data);
            console.log("API Response:", response);
            setAnalysisResult(response);

        } catch (err: any) {
            const message =
                err.response?.data?.detail ||
                err.message ||
                "Une erreur est survenue.";

            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const VisualFeedbackDisplay = ({ feedback }: { feedback: any }) => (
        <Card className="mt-6 bg-white dark:bg-gray-800 shadow-lg border-0 ring-1 ring-gray-200 dark:ring-gray-700">
            <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <HiPhotograph className="h-5 w-5 text-purple-500" />
                    {t('results.visualTitle')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                        <Label className="text-muted-foreground mb-2 block">{t('results.presentationScore')}</Label>
                        <div className="flex items-end gap-2">
                            <h3 className="text-4xl font-bold text-purple-600 dark:text-purple-400">{feedback.layout_score}/10</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{feedback.overall_professionalism}</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label className="font-semibold text-gray-900 dark:text-gray-100">{t('results.layout')}</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{feedback.layout_notes}</p>
                        </div>
                        <div>
                            <Label className="font-semibold text-gray-900 dark:text-gray-100">{t('results.fonts')}</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{feedback.font_choice_notes}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                    <Label className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-3">
                        <HiCheckCircle className="h-4 w-4" />
                        {t('results.suggestions')}
                    </Label>
                    <ul className="space-y-2">
                        {feedback.suggestions.map((sug: string, i: number) => (
                            <li key={i} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                                {sug}
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black py-6 sm:py-12 px-3 sm:px-4 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 relative z-10">
                <div className="text-center space-y-3 sm:space-y-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        {t('title')}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
                        Get detailed insights and AI-powered recommendations to improve your CV.
                    </p>
                </div>

                <Card className="shadow-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                            {error && (
                                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                                    <HiExclamation className="h-5 w-5" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                <div className="space-y-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-3 sm:p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                                        <Label htmlFor="cv-file" className="font-semibold text-base sm:text-lg flex items-center gap-2 mb-2">
                                            <HiUpload className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                                            {t('form.cvLabel')} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="cv-file"
                                            type="file"
                                            accept="application/pdf"
                                            onChange={handlePdfChange}
                                            required
                                            className="bg-white dark:bg-black/50 text-sm"
                                        />
                                    </div>

                                    <div className="space-y-4 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="analyze-visuals"
                                                checked={analyzeVisuals}
                                                onCheckedChange={(checked) => setAnalyzeVisuals(checked as boolean)}
                                            />
                                            <Label htmlFor="analyze-visuals" className="font-medium text-base cursor-pointer">
                                                {t('form.visualLabel')}
                                            </Label>
                                        </div>

                                        <Suspense fallback={null}>
                                            {analyzeVisuals && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="space-y-2 overflow-hidden"
                                                >
                                                    <Label htmlFor="cv-image" className="text-muted-foreground text-sm">
                                                        {t('form.imageLabel')}
                                                    </Label>
                                                    <Input
                                                        id="cv-image"
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/webp"
                                                        onChange={handleImageChange}
                                                        className="bg-gray-50 dark:bg-gray-800"
                                                    />
                                                </motion.div>
                                            )}
                                        </Suspense>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="jd" className="font-semibold text-base sm:text-lg flex items-center gap-2">
                                        <HiDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                        {t('form.jdLabel')} <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="jd"
                                        className="min-h-[200px] sm:min-h-[280px] resize-none bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-sm"
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder={t('form.jdPlaceholder')}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span className="text-sm sm:text-base">{t('form.submitLoading')}</span>
                                    </div>
                                ) : (
                                    t('form.submitDefault')
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Suspense fallback={<CardLoader />}>
                    <AnimatePresence>
                        {analysisResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                                    <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-800">
                                        <h3 className="text-2xl font-bold flex items-center gap-3">
                                            {t('results.title')}
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${analysisResult.analysis_vs_jd.match_score >= 70 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                analysisResult.analysis_vs_jd.match_score >= 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                } `}>
                                                {t('results.matchScore', { score: analysisResult.analysis_vs_jd.match_score })}
                                            </span>
                                        </h3>
                                    </div>

                                    <div className="p-6 sm:p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h5 className="font-semibold text-lg mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                                                    <HiCheckCircle className="h-5 w-5" />
                                                    {t('results.strengths')}
                                                </h5>
                                                <ul className="space-y-2">
                                                    {analysisResult.analysis_vs_jd.strengths.map((s: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                                            {s}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div>
                                                <h5 className="font-semibold text-lg mb-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                                                    <HiExclamation className="h-5 w-5" />
                                                    {t('results.weaknesses')}
                                                </h5>
                                                <ul className="space-y-2">
                                                    {analysisResult.analysis_vs_jd.weaknesses.map((w: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                                            {w}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="font-semibold text-lg mb-4">{t('results.detailed')}</h5>
                                            <div className="space-y-6">
                                                {/* Hard Skills */}
                                                <div className="space-y-3">
                                                    <h6 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                        <span className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                                            <HiDocumentText className="w-4 h-4" />
                                                        </span>
                                                        Hard Skills
                                                    </h6>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {analysisResult.analysis_vs_jd.detailed_analysis.hard_skills.map((skill: any, i: number) => (
                                                            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{skill.skill}</span>
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${skill.match === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                        skill.match === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                        }`}>
                                                                        {skill.match}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{skill.comment}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Soft Skills */}
                                                <div className="space-y-3">
                                                    <h6 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                        <span className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                                                            <HiCheckCircle className="w-4 h-4" />
                                                        </span>
                                                        Soft Skills
                                                    </h6>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {analysisResult.analysis_vs_jd.detailed_analysis.soft_skills.map((skill: any, i: number) => (
                                                            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{skill.skill}</span>
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${skill.match === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                        skill.match === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                        }`}>
                                                                        {skill.match}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{skill.comment}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Experience */}
                                                <div className="space-y-3">
                                                    <h6 className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                        <span className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                                                            <HiDocumentText className="w-4 h-4" />
                                                        </span>
                                                        Experience
                                                    </h6>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        {analysisResult.analysis_vs_jd.detailed_analysis.experience.map((exp: any, i: number) => (
                                                            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{exp.requirement}</span>
                                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${exp.match === 'Yes' || exp.match === 'High' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                        exp.match === 'Partial' || exp.match === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                        }`}>
                                                                        {exp.match}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">{exp.comment}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {analysisResult.visual_analysis && (
                                    <VisualFeedbackDisplay feedback={analysisResult.visual_analysis} />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Suspense>
            </div>
        </div>
    );
}

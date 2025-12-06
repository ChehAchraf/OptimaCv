'use client';

import { Suspense, useState } from 'react';
import { analyzeCv } from "@/app/actions/analyzeCv";
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HiExclamation } from 'react-icons/hi';
import { CardLoader } from '@/components/loading';
import { AnimatePresence } from 'framer-motion';
import { cvPayloadSchema, validateData } from '@/lib/validations';
import { AnalysisForm } from '@/components/cv-analyze/AnalysisForm';
import { AnalysisResults } from '@/components/cv-analyze/AnalysisResults';

export default function CVAnalyze() {
    const t = useTranslations('CVAnalyze');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any | null>(null);

    const handleAnalysisSubmit = async (data: { filePDF: File; jobDescription: string; fileImage?: File; analyzeVisuals: boolean }) => {
        const { filePDF, jobDescription, fileImage, analyzeVisuals } = data;

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
                        {error && (
                            <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
                                <HiExclamation className="h-5 w-5" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <AnalysisForm onSubmit={handleAnalysisSubmit} isLoading={isLoading} />
                    </CardContent>
                </Card>

                <Suspense fallback={<CardLoader />}>
                    <AnimatePresence>
                        {analysisResult && (
                            <AnalysisResults result={analysisResult} />
                        )}
                    </AnimatePresence>
                </Suspense>
            </div>
        </div>
    );
}

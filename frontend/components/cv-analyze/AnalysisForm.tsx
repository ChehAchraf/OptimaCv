import React, { useState } from 'react';
import { LoadingButton } from '@/components/ui/loading-states';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { HiUpload, HiDocumentText } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';

interface AnalysisFormProps {
    onSubmit: (data: { filePDF: File; jobDescription: string; fileImage?: File; analyzeVisuals: boolean }) => void;
    isLoading: boolean;
}

export function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
    const t = useTranslations('CVAnalyze');
    const [filePDF, setFilePDF] = useState<File | null>(null);
    const [fileImage, setFileImage] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState<string>('');
    const [analyzeVisuals, setAnalyzeVisuals] = useState<boolean>(false);

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (filePDF && jobDescription) {
            onSubmit({
                filePDF,
                jobDescription,
                fileImage: fileImage || undefined,
                analyzeVisuals
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
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

                        <AnimatePresence>
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
                        </AnimatePresence>
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
                {t('form.submitDefault')}
            </Button>
        </form>
    );
}

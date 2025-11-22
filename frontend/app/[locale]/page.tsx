'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import ProcessSection from '@/components/ProcessSection';
import TrustSection from '@/components/TrustSection';
import CompanySection from '@/components/CompanySection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HiExclamation } from 'react-icons/hi';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from 'framer-motion';
import { CVPayload } from '@/types/type';
import { analyzeCv } from '@/app/actions/analyzeCv';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  const [filePDF, setFilePDF] = useState<File | null>(null);
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');

  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!filePDF || !jobDescription) {
      setError(t('analysis.form.errorMissing'));
      return;
    }

    if (analyzeVisuals && !fileImage) {
      setError(t('analysis.form.errorVisual'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const payload: CVPayload = {
      cv_pdf: filePDF,
      job_description: jobDescription,
    };

    if (analyzeVisuals && fileImage) {
      payload.cv_image = fileImage;
    }
    try {
      const response = await analyzeCv(payload);
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
    <Card className="mt-6 bg-gray-50 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t('analysis.results.visualTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>{t('analysis.results.presentationScore')}</Label>
          <h3 className="text-3xl font-bold text-blue-600">{feedback.layout_score}/10</h3>
          <p className="text-sm text-muted-foreground">{feedback.overall_professionalism}</p>
        </div>
        <div>
          <Label>{t('analysis.results.layout')}</Label>
          <p>{feedback.layout_notes}</p>
        </div>
        <div>
          <Label>{t('analysis.results.fonts')}</Label>
          <p>{feedback.font_choice_notes}</p>
        </div>
        <div>
          <Label>{t('analysis.results.suggestions')}</Label>
          <ul className="list-disc list-inside space-y-1 mt-2">
            {feedback.suggestions.map((sug: string, i: number) => <li key={i}>{sug}</li>)}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <HeroSection
        title={t('title')}
        subtitle={t('subtitle')}
        cta={t('cta')}
      />

      <ProcessSection />

      <TrustSection />

      <CompanySection />

      <section id="analyze" className="py-20 lg:py-32 bg-gray-50 dark:bg-black">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                {t('analysis.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                {error && (
                  <Alert variant="destructive">
                    <HiExclamation className="h-5 w-5" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="cv-file" className="font-medium">
                    {t('analysis.form.cvLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cv-file"
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jd" className="font-medium">
                    {t('analysis.form.jdLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="jd"
                    rows={10}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder={t('analysis.form.jdPlaceholder')}
                    required
                  />
                </div>

                <div className="space-y-4 rounded-md border p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="analyze-visuals"
                      checked={analyzeVisuals}
                      onCheckedChange={(checked) => setAnalyzeVisuals(checked as boolean)}
                    />
                    <Label htmlFor="analyze-visuals" className="font-medium text-base">
                      {t('analysis.form.visualLabel')}
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
                        <Label htmlFor="cv-image" className="text-muted-foreground">
                          {t('analysis.form.imageLabel')}
                        </Label>
                        <Input
                          id="cv-image"
                          type="file"
                          accept="image/png, image/jpeg, image/webp"
                          onChange={handleImageChange}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? t('analysis.form.submitLoading') : t('analysis.form.submitDefault')}
                </Button>

              </form>

              {analysisResult && (
                <div className="mt-10 border-t pt-6">

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                    <h3 className="text-2xl font-bold">{t('analysis.results.title')}</h3>
                    <h4 className="text-xl font-semibold mt-4">
                      {t('analysis.results.matchScore', { score: analysisResult.analysis_vs_jd.match_score })}
                    </h4>

                    <h5 className="font-semibold mt-4">{t('analysis.results.strengths')}</h5>
                    <ul className="list-disc list-inside text-green-600">
                      {analysisResult.analysis_vs_jd.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>

                    <h5 className="font-semibold mt-4">{t('analysis.results.weaknesses')}</h5>
                    <ul className="list-disc list-inside text-red-600">
                      {analysisResult.analysis_vs_jd.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                    </ul>

                    <h5 className="font-semibold mt-4">{t('analysis.results.detailed')}</h5>
                    <pre className="bg-gray-900 dark:bg-black text-white p-4 rounded-md mt-2">
                      {JSON.stringify(analysisResult.analysis_vs_jd.detailed_analysis, null, 2)}
                    </pre>
                  </div>

                  {analysisResult.visual_analysis && (
                    <VisualFeedbackDisplay feedback={analysisResult.visual_analysis} />
                  )}

                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
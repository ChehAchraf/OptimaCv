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
import { HiExclamation, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import api from "@/app/axios/path"
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
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
    setError("Veuillez fournir un CV (PDF) et une description de poste.");
    return;
  }

  if (analyzeVisuals && !fileImage) {
    setError("Veuillez télécharger l'image de votre CV pour l'analyse visuelle.");
    return;
  }

  setIsLoading(true);
  setError(null);
  setAnalysisResult(null);

  // We send pure object — interceptor will detect the File and convert to FormData.
  const payload: Record<string, any> = {
    cv_pdf: filePDF,
    job_description: jobDescription,
  };

  if (analyzeVisuals && fileImage) {
    payload.cv_image = fileImage;
  }

  try {
    const response = await api.post(
      "/analysis/analyze-full-cv/",
      payload
    );

    setAnalysisResult(response.data);

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
        <CardTitle className="text-xl font-semibold">Analyse du Design (Template)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Score de Présentation</Label>
          <h3 className="text-3xl font-bold text-blue-600">{feedback.layout_score}/10</h3>
          <p className="text-sm text-muted-foreground">{feedback.overall_professionalism}</p>
        </div>
        <div>
          <Label>Mise en page (Layout)</Label>
          <p>{feedback.layout_notes}</p>
        </div>
        <div>
          <Label>Choix de Police (Fonts)</Label>
          <p>{feedback.font_choice_notes}</p>
        </div>
        <div>
          <Label>Suggestions d'amélioration</Label>
          <ul className="list-disc list-inside space-y-1 mt-2">
            {feedback.suggestions.map((sug: string, i: number) => <li key={i}>{sug}</li>)}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <HeroSection />
      
      <ProcessSection />

      <TrustSection />

      <CompanySection />

      <section id="analyze" className="py-20 lg:py-32 bg-gray-50 dark:bg-black">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Testez l'analyseur complet
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
                    1. Téléchargez votre CV (PDF) <span className="text-red-500">*</span>
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
                    2. Collez la description de poste <span className="text-red-500">*</span>
                  </Label>
                  <Textarea 
                    id="jd"
                    rows={10} 
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Collez la description de poste ici..."
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
                      Analyser aussi le Design (Template) ? (Optionnel)
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
                          Téléchargez une image de votre CV (PNG, JPG)
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
                
                <Button type="submit" disabled={isLoading} size="lg" className="w-full">
                  {isLoading ? 'Analyse en cours...' : 'Lancer l\'analyse complète'}
                </Button>
              </form>

              {analysisResult && (
                <div className="mt-10 border-t pt-6">
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
                    <h3 className="text-2xl font-bold">Résultat de l'analyse (Texte vs ATS)</h3>
                    <h4 className="text-xl font-semibold mt-4">
                      Score de correspondance : {analysisResult.analysis_vs_jd.match_score}%
                    </h4>
                    
                    <h5 className="font-semibold mt-4">Points forts :</h5>
                    <ul className="list-disc list-inside text-green-600">
                      {analysisResult.analysis_vs_jd.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                    </ul>
                    
                    <h5 className="font-semibold mt-4">Points faibles :</h5>
                    <ul className="list-disc list-inside text-red-600">
                      {analysisResult.analysis_vs_jd.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                    </ul>
                    
                    <h5 className="font-semibold mt-4">Analyse détaillée (JSON) :</h5>
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
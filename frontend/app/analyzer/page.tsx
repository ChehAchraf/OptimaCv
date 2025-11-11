'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HiExclamation } from 'react-icons/hi';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

export default function AnalyzerPage() {
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
      setError('Veuillez fournir un CV (PDF) et une description de poste.');
      return;
    }
    if (analyzeVisuals && !fileImage) {
      setError("Veuillez télécharger l'image de votre CV pour l'analyse visuelle.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('cv_pdf', filePDF);
    formData.append('job_description', jobDescription);
    
    if (analyzeVisuals && fileImage) {
      formData.append('cv_image', fileImage);
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/analysis/analyze-full-cv/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Une erreur est survenue.');
      }

      setAnalysisResult(data);

    } catch (err: any) {
      setError(err.message);
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
          <div className="flex items-center space-x-3 mt-2">
            <Progress value={feedback.layout_score * 10} className="flex-1" />
            <span className="text-2xl font-bold text-blue-600">{feedback.layout_score}/10</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{feedback.overall_professionalism}</p>
        </div>
        <div>
          <Label className="font-semibold">Mise en page (Layout)</Label>
          <p className="mt-1">{feedback.layout_notes}</p>
        </div>
        <div>
          <Label className="font-semibold">Choix de Police (Fonts)</Label>
          <p className="mt-1">{feedback.font_choice_notes}</p>
        </div>
        <div>
          <Label className="font-semibold">Palette de Couleurs</Label>
          <p className="mt-1">{feedback.color_scheme_notes}</p>
        </div>
        <div>
          <Label className="font-semibold">Suggestions d'amélioration</Label>
          <ul className="list-disc list-inside space-y-1 mt-2">
            {feedback.suggestions?.map((sug: string, i: number) => (
              <li key={i} className="text-sm">{sug}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Analyseur Intelligent de CV
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Analysez votre CV avec l'intelligence artificielle pour maximiser vos chances de décrocher l'emploi de vos rêves.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Analyse Complète de CV
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
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {filePDF && (
                    <p className="text-sm text-green-600">✓ {filePDF.name} sélectionné</p>
                  )}
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
                    placeholder="Collez ici la description complète du poste que vous visez..."
                    required
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    {jobDescription.length} caractères
                  </p>
                </div>
                
                <div className="space-y-4 rounded-md border p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="analyze-visuals"
                      checked={analyzeVisuals}
                      onCheckedChange={(checked) => setAnalyzeVisuals(checked as boolean)}
                    />
                    <Label htmlFor="analyze-visuals" className="font-medium text-base">
                      📊 Analyser aussi le Design (Template) ? (Optionnel)
                    </Label>
                  </div>
                  
                  <AnimatePresence>
                    {analyzeVisuals && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
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
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                        />
                        {fileImage && (
                          <p className="text-sm text-green-600">✓ {fileImage.name} sélectionné</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  size="lg" 
                  className="w-full h-12 text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyse en cours...</span>
                    </div>
                  ) : (
                    '🚀 Lancer l\'analyse complète'
                  )}
                </Button>
              </form>

              {analysisResult && (
                <motion.div 
                  className="mt-10 border-t pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
                    <h3 className="text-2xl font-bold mb-6 text-center">📋 Résultat de l'Analyse</h3>
                    
                    {/* Score de correspondance */}
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                        <span className="text-3xl font-bold text-blue-600">
                          {analysisResult.analysis_vs_jd?.match_score || analysisResult.match_score}%
                        </span>
                      </div>
                      <h4 className="text-xl font-semibold">Score de Correspondance</h4>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Points forts */}
                      <div>
                        <h5 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center">
                          ✅ Points Forts
                        </h5>
                        <ul className="space-y-2">
                          {(analysisResult.analysis_vs_jd?.strengths || analysisResult.strengths || []).map((strength: string, i: number) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-green-500 mt-1">•</span>
                              <span className="text-sm">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Points faibles */}
                      <div>
                        <h5 className="font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center">
                          ⚠️ Points à Améliorer
                        </h5>
                        <ul className="space-y-2">
                          {(analysisResult.analysis_vs_jd?.weaknesses || analysisResult.weaknesses || []).map((weakness: string, i: number) => (
                            <li key={i} className="flex items-start space-x-2">
                              <span className="text-red-500 mt-1">•</span>
                              <span className="text-sm">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Analyse détaillée */}
                    {(analysisResult.analysis_vs_jd?.detailed_analysis || analysisResult.detailed_analysis) && (
                      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <h5 className="font-semibold mb-3">🔍 Analyse Détaillée</h5>
                        <div className="text-sm">
                          <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
                            {JSON.stringify(analysisResult.analysis_vs_jd?.detailed_analysis || analysisResult.detailed_analysis, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Analyse visuelle */}
                  {analysisResult.visual_analysis && (
                    <VisualFeedbackDisplay feedback={analysisResult.visual_analysis} />
                  )}

                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
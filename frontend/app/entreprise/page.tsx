'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import { AlertTriangle, CheckCircle2 } from 'lucide-react';
type AnalysisResult = {
  filename: string;
  analysis: {
    contact_info: { name: string; email: string };
    summary: string;
    match_score: number;
    strengths: string[];
  };
};

export default function CompanyPage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!files || files.length === 0 || !jobDescription) {
      setError('Veuillez fournir une description de poste et au moins un CV (PDF).');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults([]);
    const formData = new FormData();
    formData.append('job_description', jobDescription);
    Array.from(files).forEach((file) => {
      formData.append('cv_pdfs', file);
    });
    try {
      const response = await fetch('http://localhost:8000/api/v1/analysis/companies/rank-candidates/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Une erreur est survenue.');
      }
      setResults(data.ranked_results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Tableau de Bord Entreprise
          </CardTitle>
          <CardDescription className="text-center text-lg text-muted-foreground pt-2">
            Importez plusieurs CVs et comparez-les à une seule offre d'emploi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" /> 
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="jd-company" className="font-medium text-lg">
                1. Collez la description de poste (JD)
              </Label>
              <Textarea 
                id="jd-company"
                rows={10} 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Collez la description de poste complète ici..."
                required
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cv-files" className="font-medium text-lg">
                2. Téléchargez les CVs (PDF)
              </Label>
              <Input 
                id="cv-files"
                type="file" 
                accept="application/pdf"
                onChange={handleFileChange} 
                required
                multiple
                className="pt-2 h-auto"
              />
              {files && <p className="text-sm text-muted-foreground">{files.length} fichier(s) sélectionné(s)</p>}
            </div>
            
            <Button type="submit" disabled={isLoading} size="lg" className="w-full text-lg">
              {isLoading ? 'Analyse en cours (cela peut prendre du temps)...' : `Lancer l'analyse de ${files?.length || 0} CVs`}
            </Button>
          </form>

          {results.length > 0 && (
            <div className="mt-12 border-t pt-8">
              <h3 className="text-2xl font-bold mb-6">
                Résultats: {results.length} Candidats Classés
              </h3>
              <div className="space-y-4">
                {results.map((item, index) => (
                  <Card key={item.filename} className="flex flex-col md:flex-row items-start">
                    <div className="p-4 md:w-1/4 md:border-r text-center bg-gray-50 dark:bg-gray-800 rounded-t-lg md:rounded-l-lg md:rounded-t-none">
                      <div className="text-lg font-semibold text-muted-foreground">Rang #{index + 1}</div>
                      <div className="text-5xl font-bold text-blue-600 my-2">
                        {item.analysis.match_score ?? 0}%
                      </div>
                      <Progress value={item.analysis.match_score ?? 0} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">Score de correspondance</p>
                    </div>

                    <div className="p-4 md:w-3/4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar>
                          <AvatarFallback>
                            {item.analysis.contact_info?.name?.substring(0, 2) || 'N/A'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">
                            {item.analysis.contact_info?.name || 'Nom non trouvé'}
                          </CardTitle>
                          <CardDescription>
                            {item.analysis.contact_info?.email || 'Email non trouvé'}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        {item.analysis.summary || "Pas de résumé."}
                      </p>
                      
                      <h5 className="font-semibold text-sm mb-2">Points forts identifiés :</h5>
                      <div className="flex flex-wrap gap-2">
                        {item.analysis.strengths.length > 0 ? (
                          item.analysis.strengths.slice(0, 3).map((strength, i) => (
                            
                            <Badge 
                              key={i} 
                              variant="default" 
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            >
                              <CheckCircle2 className="mr-1 h-4 w-4" /> 
                              {strength}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Aucun point fort majeur détecté.</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
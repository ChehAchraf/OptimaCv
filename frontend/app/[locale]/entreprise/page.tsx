'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Upload, FileText } from 'lucide-react';
import { AnalysisResult } from '@/types/type';
import { useTranslations } from 'next-intl';
import { generateCV } from '@/app/actions/generateCv';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export default function CompanyPage() {
  const t = useTranslations('CompanyPage');
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<FileList | null>(null);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const { data: results = [] } = useQuery<AnalysisResult[]>({
    queryKey: ['company-results'],
    queryFn: () => [],
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30, 
    enabled: false, 
  });

  // Mutation to generate CV
  const mutation = useMutation<AnalysisResult[], Error, { jobDescription: string; files: FileList }>({
    mutationFn: async (payload) => {
      const response = await generateCV(payload);
      return response.ranked_results;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['company-results'], data);
      setError(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || err.message || 'Une erreur est survenue.');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!files || files.length === 0 || !jobDescription) {
      setError(t('form.error'));
      return;
    }

    mutation.mutate({ jobDescription, files });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-6 sm:py-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2">
            {t('description')}
          </p>
        </div>

        <Card className="shadow-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800 bg-white dark:bg-gray-900">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {error && (
                <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
                  <AlertTriangle className="h-5 w-5" />
                  <AlertTitle>Erreur</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-3 sm:p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    <Label htmlFor="cv-files" className="font-semibold text-base sm:text-lg flex items-center gap-2 mb-2">
                      <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                      {t('form.cvLabel')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="cv-files"
                      type="file"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      required
                      multiple
                      className="bg-white dark:bg-black/50 text-sm"
                    />
                    {files && <p className="text-sm text-muted-foreground mt-2">{t('form.fileCount', { count: files.length })}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jd-company" className="font-semibold text-base sm:text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    {t('form.jdLabel')} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="jd-company"
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
                disabled={mutation.isPending}
                className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold transition-all duration-300 shadow-lg"
              >
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="text-sm sm:text-base">{t('form.submitLoading')}</span>
                  </div>
                ) : (
                  t('form.submitDefault', { count: files?.length || 0 })
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="mt-12 border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">
              {t('results.title', { count: results.length })}
            </h3>
            <div className="space-y-4">
              {results.map((item, index) => (
                <Card key={item.filename} className="flex flex-col md:flex-row items-start shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="p-4 md:w-1/4 md:border-r text-center bg-gray-50 dark:bg-gray-800 rounded-t-lg md:rounded-l-lg md:rounded-t-none h-full flex flex-col justify-center">
                    <div className="text-lg font-semibold text-muted-foreground">{t('results.rank', { rank: index + 1 })}</div>
                    <div className="text-5xl font-bold text-blue-600 my-2">
                      {item.analysis.match_score ?? 0}%
                    </div>
                    <Progress value={item.analysis.match_score ?? 0} className="h-2 w-full" />
                    <p className="text-xs text-muted-foreground mt-2">{t('results.matchScore')}</p>
                  </div>

                  <div className="p-4 md:w-3/4 w-full">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                          {item.analysis.contact_info?.name?.substring(0, 2).toUpperCase() || 'NA'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">
                          {item.analysis.contact_info?.name || t('results.nameNotFound')}
                        </CardTitle>
                        <CardDescription>
                          {item.analysis.contact_info?.email || t('results.emailNotFound')}
                        </CardDescription>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                      {item.analysis.summary || t('results.noSummary')}
                    </p>

                    <h5 className="font-semibold text-sm mb-2 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {t('results.strengths')}
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {item.analysis.strengths.length > 0 ? (
                        item.analysis.strengths.slice(0, 3).map((strength, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                          >
                            {strength}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">{t('results.noStrengths')}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
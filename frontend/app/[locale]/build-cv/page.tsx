'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { CardLoader } from '@/components/loading';
import { CVBuildPayload, CVBuildResponse, FormData } from '@/types/type';
import { buildCV } from '@/app/actions/buildCv';

// Lazy load Stepper and heavy UI components
const Stepper = dynamic(() => import('@/components/ui/stepper').then(mod => mod.Stepper), {
  loading: () => <CardLoader />,
});

const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button));
const Input = dynamic(() => import('@/components/ui/input').then(mod => mod.Input));
const Textarea = dynamic(() => import('@/components/ui/textarea').then(mod => mod.Textarea));
const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));
const CardContent = dynamic(() => import('@/components/ui/card').then(mod => mod.CardContent));
const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => mod.CardHeader));
const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => mod.CardTitle));
const CardDescription = dynamic(() => import('@/components/ui/card').then(mod => mod.CardDescription));
const Label = dynamic(() => import('@/components/ui/label').then(mod => mod.Label));
const Badge = dynamic(() => import('@/components/ui/badge').then(mod => mod.Badge));
const Alert = dynamic(() => import('@/components/ui/alert').then(mod => mod.Alert));
const AlertTitle = dynamic(() => import('@/components/ui/alert').then(mod => mod.AlertTitle));
const AlertDescription = dynamic(() => import('@/components/ui/alert').then(mod => mod.AlertDescription));

// Lazy load icons
const AlertTriangle = dynamic(() => import('lucide-react').then(mod => mod.AlertTriangle), { ssr: false });
const Loader2 = dynamic(() => import('lucide-react').then(mod => mod.Loader2), { ssr: false });

export default function BuildCVPage() {
  const t = useTranslations('BuildCVPage');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    rawDescription: '',
    certificates: [],
    tempCert: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CVBuildResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [t('steps.info'), t('steps.profile'), t('steps.generation')];

  const updateForm = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddCertificate = () => {
    if (formData.tempCert.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates, prev.tempCert],
        tempCert: ''
      }));
    }
  };

  const handleGenerateCV = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const payload: CVBuildPayload = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      raw_description: formData.rawDescription,
      certificates: formData.certificates,
      education: [],
      experience: [],
    };

    try {
      const data = await buildCV(payload);
      setResult(data);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message);
      setCurrentStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const restart = () => {
    setCurrentStep(1);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      rawDescription: '',
      certificates: [],
      tempCert: '',
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-16">
      <Suspense fallback={<CardLoader />}>
        <Stepper currentStep={currentStep} steps={steps}>
          {currentStep === 1 && (
            <Suspense fallback={<CardLoader />}>
              <Step1 formData={formData} updateForm={updateForm} nextStep={() => setCurrentStep(2)} />
            </Suspense>
          )}

          {currentStep === 2 && (
            <Suspense fallback={<CardLoader />}>
              <Step2
                formData={formData}
                updateForm={updateForm}
                addCertificate={handleAddCertificate}
                prevStep={() => setCurrentStep(1)}
                generateCV={handleGenerateCV}
              />
            </Suspense>
          )}

          {currentStep === 3 && (
            <Suspense fallback={<CardLoader />}>
              <Step3
                isLoading={isLoading}
                error={error}
                result={result}
                restart={restart}
              />
            </Suspense>
          )}
        </Stepper>
      </Suspense>
    </div>
  );
}

// ------------------ Step Components ------------------

function Step1({ formData, updateForm, nextStep }: any) {
  const t = useTranslations('BuildCVPage');
  const isNextDisabled = !formData.fullName || !formData.email;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('step1.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('step1.name')}</Label>
          <Input id="name" value={formData.fullName} onChange={(e) => updateForm('fullName', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('step1.email')}</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t('step1.phone')}</Label>
          <Input id="phone" value={formData.phone} onChange={(e) => updateForm('phone', e.target.value)} />
        </div>
        <Button onClick={nextStep} disabled={isNextDisabled}>
          {t('step1.next')}
        </Button>
      </CardContent>
    </Card>
  );
}

function Step2({ formData, updateForm, addCertificate, prevStep, generateCV }: any) {
  const t = useTranslations('BuildCVPage');
  const isGenerateDisabled = !formData.rawDescription;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('step2.title')}</CardTitle>
        <CardDescription>
          {t('step2.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="desc">{t('step2.descLabel')}</Label>
          <Textarea
            id="desc"
            value={formData.rawDescription}
            onChange={(e) => updateForm('rawDescription', e.target.value)}
            placeholder={t('step2.descPlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('step2.certLabel')}</Label>
          <div className="flex space-x-2">
            <Input
              value={formData.tempCert}
              onChange={(e) => updateForm('tempCert', e.target.value)}
              placeholder={t('step2.certPlaceholder')}
            />
            <Button variant="outline" onClick={addCertificate}>{t('step2.add')}</Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.certificates.map((cert: string) => (
              <Badge key={cert}>{cert}</Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>{t('step2.prev')}</Button>
          <Button onClick={generateCV} disabled={isGenerateDisabled}>
            {t('step2.generate')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Step3({ isLoading, error, result, restart }: any) {
  const t = useTranslations('BuildCVPage');
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('step3.title')}</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">{t('step3.loading')}</p>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t('step3.resultTitle', { title: result.analysis.profile_focus })}</h3>

            <h4 className="font-semibold">{t('step3.keyPoints')}</h4>
            <ul className="list-disc list-inside text-green-700">
              {result.analysis.key_selling_points.map((pt: string) => <li key={pt}>{pt}</li>)}
            </ul>

            <h4 className="font-semibold mt-4">{t('step3.content')}</h4>
            <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
              {JSON.stringify(result.generated_cv, null, 2)}
            </pre>

            <Button variant="outline" onClick={restart}>{t('step3.restart')}</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

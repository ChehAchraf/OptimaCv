'use client';

import { useState } from 'react';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { CVBuildPayload, CVBuildResponse } from '@/types/type';
import { generateCV } from '@/app/actions/generateCv';
import { FormData } from '@/types/type';


export default function BuildCVPage() {
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

  const steps = ['Infos Perso', 'Profil', 'Génération'];

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
      const data = await generateCV(payload);
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
      <Stepper currentStep={currentStep} steps={steps}>
        {currentStep === 1 && (
          <Step1 formData={formData} updateForm={updateForm} nextStep={() => setCurrentStep(2)} />
        )}

        {currentStep === 2 && (
          <Step2
            formData={formData}
            updateForm={updateForm}
            addCertificate={handleAddCertificate}
            prevStep={() => setCurrentStep(1)}
            generateCV={handleGenerateCV}
          />
        )}

        {currentStep === 3 && (
          <Step3
            isLoading={isLoading}
            error={error}
            result={result}
            restart={restart}
          />
        )}
      </Stepper>
    </div>
  );
}

// ------------------ Step Components ------------------

function Step1({ formData, updateForm, nextStep }: any) {
  const isNextDisabled = !formData.fullName || !formData.email;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Étape 1: Informations de base</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" value={formData.fullName} onChange={(e) => updateForm('fullName', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" value={formData.phone} onChange={(e) => updateForm('phone', e.target.value)} />
        </div>
        <Button onClick={nextStep} disabled={isNextDisabled}>
          Suivant
        </Button>
      </CardContent>
    </Card>
  );
}

function Step2({ formData, updateForm, addCertificate, prevStep, generateCV }: any) {
  const isGenerateDisabled = !formData.rawDescription;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Étape 2: Votre Profil</CardTitle>
        <CardDescription>
          Décrivez-vous et listez vos certificats. L'IA s'occupe du reste.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="desc">Décrivez-vous (ou vos objectifs)</Label>
          <Textarea
            id="desc"
            value={formData.rawDescription}
            onChange={(e) => updateForm('rawDescription', e.target.value)}
            placeholder="Ex: 'Développeur passionné par le cloud, je viens de terminer un stage...' ou 'Cloud, DevOps, Java...'"
          />
        </div>
        <div className="space-y-2">
          <Label>Vos Certificats (Optionnel)</Label>
          <div className="flex space-x-2">
            <Input
              value={formData.tempCert}
              onChange={(e) => updateForm('tempCert', e.target.value)}
              placeholder="Ex: 'AWS Certified Cloud Practitioner'"
            />
            <Button variant="outline" onClick={addCertificate}>Ajouter</Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.certificates.map((cert: string) => (
              <Badge key={cert}>{cert}</Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>Précédent</Button>
          <Button onClick={generateCV} disabled={isGenerateDisabled}>
            Générer mon CV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Step3({ isLoading, error, result, restart }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Étape 3: Génération...</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">L'IA rédige votre CV...</p>
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
            <h3 className="text-xl font-bold">Votre nouveau profil (Titre): {result.analysis.profile_focus}</h3>

            <h4 className="font-semibold">Points forts de ce CV :</h4>
            <ul className="list-disc list-inside text-green-700">
              {result.analysis.key_selling_points.map((pt: string) => <li key={pt}>{pt}</li>)}
            </ul>

            <h4 className="font-semibold mt-4">Contenu du CV (JSON) :</h4>
            <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
              {JSON.stringify(result.generated_cv, null, 2)}
            </pre>

            <Button variant="outline" onClick={restart}>Recommencer</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

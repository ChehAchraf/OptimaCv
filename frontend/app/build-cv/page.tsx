'use client';

import { useState } from 'react';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // غانحتاجوه
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function BuildCVPage() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rawDescription, setRawDescription] = useState('');
  const [certificates, setCertificates] = useState<string[]>([]);
  const [tempCert, setTempCert] = useState(''); // (خانة مؤقتة باش يزيد الشواهد)

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null); // (هنا غاتجي CVBuildResponse)
  const [error, setError] = useState<string | null>(null);


  const steps = ["Infos Perso", "Profil", "Génération"];

  const handleGenerateCV = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentStep(3); // (كنمشيو لصفحة التحميل)

    const payload = {
      full_name: fullName,
      email: email,
      phone: phone,
      raw_description: rawDescription,
      certificates: certificates,
      education: [], 
      experience: [], 
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/analysis/generator/build-cv/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Erreur du serveur');
      
      setResult(data);

    } catch (err: any) {
      setError(err.message);
      setCurrentStep(2); // (كنرجعوه للخطوة لي قبل)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-16">
      <Stepper currentStep={currentStep} steps={steps}>
        
        {}
        <Card>
          <CardHeader>
            <CardTitle>Étape 1: Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <Button onClick={() => setCurrentStep(2)} disabled={!fullName || !email}>
              Suivant
            </Button>
          </CardContent>
        </Card>

        {}
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
                value={rawDescription}
                onChange={(e) => setRawDescription(e.target.value)}
                placeholder="Ex: 'Développeur passionné par le cloud, je viens de terminer un stage...' ou 'Cloud, DevOps, Java...'"
              />
            </div>
            <div className="space-y-2">
              <Label>Vos Certificats (Optionnel)</Label>
              <div className="flex space-x-2">
                <Input 
                  value={tempCert}
                  onChange={(e) => setTempCert(e.target.value)}
                  placeholder="Ex: 'AWS Certified Cloud Practitioner'"
                />
                <Button variant="outline" onClick={() => {
                  if (tempCert) {
                    setCertificates([...certificates, tempCert]);
                    setTempCert('');
                  }
                }}>Ajouter</Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {certificates.map((cert, i) => <Badge key={i}>{cert}</Badge>)}
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>Précédent</Button>
              <Button onClick={handleGenerateCV} disabled={!rawDescription}>
                Générer mon CV
              </Button>
            </div>
          </CardContent>
        </Card>

        {}
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
                  {result.analysis.key_selling_points.map((pt: string, i: number) => <li key={i}>{pt}</li>)}
                </ul>

                <h4 className="font-semibold mt-4">Contenu du CV (JSON) :</h4>
                <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
                  {JSON.stringify(result.generated_cv, null, 2)}
                </pre>

                <Button variant="outline" onClick={() => setCurrentStep(1)}>Recommencer</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </Stepper>
    </div>
  );
}
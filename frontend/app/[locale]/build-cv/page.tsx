'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { CardLoader } from '@/components/loading';
import { CVFullProfile } from '@/types/cv-builder';
import { PersonalForm } from '@/components/cv-builder/PersonalForm';
import { ExperienceForm } from '@/components/cv-builder/ExperienceForm';
import { EducationForm } from '@/components/cv-builder/EducationForm';
import { ProjectForm } from '@/components/cv-builder/ProjectForm';
import { SkillsForm } from '@/components/cv-builder/SkillsForm';
import { TemplateSelector } from '@/components/cv-builder/TemplateSelector';

// Lazy load Stepper and heavy UI components
const Stepper = dynamic(() => import('@/components/ui/stepper').then(mod => mod.Stepper), {
  loading: () => <CardLoader />,
});

const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button));
const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));
const CardContent = dynamic(() => import('@/components/ui/card').then(mod => mod.CardContent));
const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => mod.CardHeader));
const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => mod.CardTitle));

export default function BuildCVPage() {
  const t = useTranslations('BuildCVPage');
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState<CVFullProfile>({
    personal_details: {
      full_name: '',
      email: '',
      phone: '',
    },
    experience: [],
    education: [],
    projects: [],
    skills: [],
  });

  const steps = [
    "Personal Info",
    "Experience",
    "Education",
    "Projects",
    "Skills",
    "Preview & Download"
  ];

  const updatePersonalDetails = (key: any, value: any) => {
    setCvData(prev => ({
      ...prev,
      personal_details: { ...prev.personal_details, [key]: value }
    }));
  };

  const updateSection = (section: keyof CVFullProfile, value: any) => {
    setCvData(prev => ({ ...prev, [section]: value }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="container max-w-5xl mx-auto px-4 py-16">
      <Suspense fallback={<CardLoader />}>
        <Stepper currentStep={currentStep} steps={steps}>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1]}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <PersonalForm data={cvData.personal_details} updateData={updatePersonalDetails} />
              )}
              {currentStep === 2 && (
                <ExperienceForm data={cvData.experience} updateData={(d) => updateSection('experience', d)} />
              )}
              {currentStep === 3 && (
                <EducationForm data={cvData.education} updateData={(d) => updateSection('education', d)} />
              )}
              {currentStep === 4 && (
                <ProjectForm data={cvData.projects} updateData={(d) => updateSection('projects', d)} />
              )}
              {currentStep === 5 && (
                <SkillsForm data={cvData.skills} updateData={(d) => updateSection('skills', d)} />
              )}
              {currentStep === 6 && (
                <TemplateSelector data={cvData} />
              )}

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                  Previous
                </Button>
                {currentStep < steps.length && (
                  <Button onClick={nextStep}>
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </Stepper>
      </Suspense>
    </div>
  );
}

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
import {
  cvPersonalDetailSchema,
  cvEducationSchema,
  cvExperienceSchema,
  cvProjectSchema,
  cvSkillSchema,
  validateData
} from '@/lib/validations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HiExclamation } from 'react-icons/hi';

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
  const [validationError, setValidationError] = useState<string | null>(null);
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
    // Clear validation error when user makes changes
    if (validationError) setValidationError(null);
  };

  const updateSection = (section: keyof CVFullProfile, value: any) => {
    setCvData(prev => ({ ...prev, [section]: value }));
    // Clear validation error when user makes changes
    if (validationError) setValidationError(null);
  };

  const validateCurrentStep = (): boolean => {
    setValidationError(null);

    switch (currentStep) {
      case 1: // Personal Info
        const personalResult = validateData(cvPersonalDetailSchema, cvData.personal_details);
        if (!personalResult.success) {
          const firstError = Object.values(personalResult.errors)[0]?.[0];
          setValidationError(firstError || 'Please fill in all required fields correctly');
          return false;
        }
        break;

      case 2: // Experience (optional but validate if provided)
        if (cvData.experience.length > 0) {
          for (let i = 0; i < cvData.experience.length; i++) {
            const expResult = validateData(cvExperienceSchema, cvData.experience[i]);
            if (!expResult.success) {
              const firstError = Object.values(expResult.errors)[0]?.[0];
              setValidationError(`Experience ${i + 1}: ${firstError}`);
              return false;
            }
          }
        }
        break;

      case 3: // Education
        if (cvData.education.length === 0) {
          setValidationError('Please add at least one education entry');
          return false;
        }
        for (let i = 0; i < cvData.education.length; i++) {
          const eduResult = validateData(cvEducationSchema, cvData.education[i]);
          if (!eduResult.success) {
            const firstError = Object.values(eduResult.errors)[0]?.[0];
            setValidationError(`Education ${i + 1}: ${firstError}`);
            return false;
          }
        }
        break;

      case 4: // Projects (optional but validate if provided)
        if (cvData.projects.length > 0) {
          for (let i = 0; i < cvData.projects.length; i++) {
            const projResult = validateData(cvProjectSchema, cvData.projects[i]);
            if (!projResult.success) {
              const firstError = Object.values(projResult.errors)[0]?.[0];
              setValidationError(`Project ${i + 1}: ${firstError}`);
              return false;
            }
          }
        }
        break;

      case 5: // Skills
        if (cvData.skills.length === 0) {
          setValidationError('Please add at least one skill category');
          return false;
        }
        for (let i = 0; i < cvData.skills.length; i++) {
          const skillResult = validateData(cvSkillSchema, cvData.skills[i]);
          if (!skillResult.success) {
            const firstError = Object.values(skillResult.errors)[0]?.[0];
            setValidationError(`Skill category ${i + 1}: ${firstError}`);
            return false;
          }
        }
        break;
    }

    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setValidationError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-16">
      <Suspense fallback={<CardLoader />}>
        <Stepper currentStep={currentStep} steps={steps}>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{steps[currentStep - 1]}</CardTitle>
            </CardHeader>
            <CardContent>
              {validationError && (
                <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
                  <HiExclamation className="h-5 w-5" />
                  <AlertTitle>Validation Error</AlertTitle>
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

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

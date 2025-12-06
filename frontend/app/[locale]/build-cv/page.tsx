'use client';

import { Suspense, useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { CardLoader } from '@/components/loading';
import { useCVBuilderState } from '@/hooks/useCVBuilderState';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DataQualityIndicator } from '@/components/cv-builder/DataQualityIndicator';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Briefcase,
  GraduationCap,
  FolderKanban,
  Wrench,
  LayoutTemplate,
  Eye,
  Download,
  Crown,
  ChevronRight,
  Languages,
  Award,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReactToPrint } from 'react-to-print';
import { TemplateModern } from '@/components/cv-templates/TemplateModern';
import { TemplateClassic } from '@/components/cv-templates/TemplateClassic';
import { TemplateMinimal } from '@/components/cv-templates/TemplateMinimal';
import { TemplateExecutive } from '@/components/cv-templates/TemplateExecutive';
import { TemplateTech } from '@/components/cv-templates/TemplateTech';
import { TemplateGlobal } from '@/components/cv-templates/TemplateGlobal';
import { Badge } from '@/components/ui/badge';
import { HiLockClosed } from 'react-icons/hi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HiExclamation } from 'react-icons/hi';
import { CVFullProfile, TemplateType } from '@/types/cv-builder';
import { TemplateSelector } from '@/components/cv-builder/TemplateSelector';
import { getUserUsage } from '@/app/actions/analyzeCv';

// Dynamic imports for optimized loading
const PersonalForm = dynamic(() => import('@/components/cv-builder/PersonalForm').then(mod => mod.PersonalForm), {
  loading: () => <div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-32 w-full" /></div>
});
const ExperienceForm = dynamic(() => import('@/components/cv-builder/ExperienceForm').then(mod => mod.ExperienceForm), {
  loading: () => <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
});
const EducationForm = dynamic(() => import('@/components/cv-builder/EducationForm').then(mod => mod.EducationForm), {
  loading: () => <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
});
const ProjectForm = dynamic(() => import('@/components/cv-builder/ProjectForm').then(mod => mod.ProjectForm), {
  loading: () => <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
});
const SkillsForm = dynamic(() => import('@/components/cv-builder/SkillsForm').then(mod => mod.SkillsForm), {
  loading: () => <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
});
const LanguagesForm = dynamic(() => import('@/components/cv-builder/LanguagesForm').then(mod => mod.LanguagesForm), {
  loading: () => <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
});
const CertificationsForm = dynamic(() => import('@/components/cv-builder/CertificationsForm').then(mod => mod.CertificationsForm), {
  // eslint-disable-next-line react/display-name
  loading: () => <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
});
const InterestsForm = dynamic(() => import('@/components/cv-builder/InterestsForm').then(mod => mod.InterestsForm), {
  loading: () => <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
});

// Preview Component Logic
const CVPreview = ({ data, template }: { data: CVFullProfile, template: string }) => {
  switch (template) {
    case 'modern': return <TemplateModern data={data} />;
    case 'classic': return <TemplateClassic data={data} />;
    case 'minimal': return <TemplateMinimal data={data} />;
    case 'executive': return <TemplateExecutive data={data} />;
    case 'tech': return <TemplateTech data={data} />;
    case 'global': return <TemplateGlobal data={data} />;
    default: return <TemplateModern data={data} />;
  }
};

export default function BuildCVPage() {
  const t = useTranslations('BuildCVPage');
  const {
    currentStep,
    cvData,
    validationError,
    updatePersonalDetails,
    updateSection,
    goToStep
  } = useCVBuilderState();

  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const status = await getUserUsage();
        if (status?.isPlan) {
          setIsPremium(true);
        }
      } catch (error) {
        console.error("Failed to check premium status", error);
      }
    };
    checkPremiumStatus();
  }, []);

  // Using a ref for printing
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${cvData.personal_details.full_name?.replace(/\s+/g, '_') || 'My'}_CV`,
  });

  const menuItems = [
    { id: 1, label: t('personal_info'), icon: User },
    { id: 2, label: t('skills'), icon: Wrench },
    { id: 3, label: t('projects'), icon: FolderKanban },
    { id: 4, label: t('experience'), icon: Briefcase },
    { id: 5, label: t('education'), icon: GraduationCap },
    { id: 6, label: t('languages'), icon: Languages },
    { id: 7, label: t('certifications'), icon: Award },
    { id: 8, label: t('interests'), icon: Heart },
    { id: 9, label: t('templates'), icon: LayoutTemplate },
  ];

  const renderMainContent = () => {
    switch (currentStep) {
      case 1: return <PersonalForm data={cvData.personal_details} updateData={updatePersonalDetails} />;
      case 2: return <SkillsForm data={cvData.skills} updateData={(d) => updateSection('skills', d)} />;
      case 3: return <ProjectForm data={cvData.projects} updateData={(d) => updateSection('projects', d)} />;
      case 4: return <ExperienceForm data={cvData.experience} updateData={(d) => updateSection('experience', d)} />;
      case 5: return <EducationForm data={cvData.education} updateData={(d) => updateSection('education', d)} />;
      case 6: return <LanguagesForm data={cvData.languages} updateData={(d) => updateSection('languages', d)} />;
      case 7: return <CertificationsForm data={cvData.certifications} updateData={(d) => updateSection('certifications', d)} />;
      case 8: return <InterestsForm data={cvData.interests} updateData={(d) => updateSection('interests', d)} />;
      case 9: return (
        <TemplateSelector
          data={cvData}
          isPremium={isPremium}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 flex-col lg:flex-row overflow-hidden">
      {/* Column 1: Left Sidebar (Navigation) */}
      <aside className="w-full lg:w-64 bg-white border-r flex flex-col shrink-0 z-20">
        <div className="p-4 border-b flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">OC</div>
          <span className="font-bold text-lg">OptimaCV</span>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => goToStep(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  currentStep === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className={cn("w-5 h-5", currentStep === item.id ? "text-blue-600" : "text-gray-400")} />
                {item.label}
                {currentStep === item.id && <ChevronRight className="w-4 h-4 ml-auto text-blue-400" />}
              </button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t bg-gray-50">
          <DataQualityIndicator data={cvData} className="border-0 shadow-none bg-transparent p-0" />
        </div>
      </aside>

      {/* Column 2: Main Editor Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Mobile Header (only visible on small screens usually, but here we keep it simple) */}
        <div className="h-16 border-b flex items-center justify-between px-6 bg-white shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            {menuItems.find(i => i.id === currentStep)?.label}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Languages className="w-5 h-5 text-gray-500" />
            </Button>
            {!isPremium && (
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 hover:opacity-90">
                <Crown className="w-4 h-4 mr-1" /> {t('go_pro')}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="max-w-3xl mx-auto pb-20">
            {validationError && (
              <Alert variant="destructive" className="mb-6">
                <HiExclamation className="h-5 w-5" />
                <AlertTitle>{t('validation_error')}</AlertTitle>
                <AlertDescription>{validationError}</AlertDescription>
              </Alert>
            )}
            <Suspense fallback={<CardLoader />}>
              {renderMainContent()}
            </Suspense>
          </div>
        </div>
      </main>

      {/* Column 3: Right Sidebar (Preview & Actions) */}
      <aside className="hidden lg:flex w-96 bg-gray-100 border-l flex-col shrink-0">
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <span className="font-semibold text-sm text-gray-500 flex items-center gap-2">
            <Eye className="w-4 h-4" /> {t('live_preview')}
          </span>
          <Button size="sm" variant="default" className="bg-slate-900 hover:bg-slate-800" onClick={() => handlePrint()}>
            <Download className="w-4 h-4 mr-2" /> {t('download')}
          </Button>
        </div>

        <div className="flex-1 overflow-hidden p-6 flex flex-col items-center justify-center bg-gray-100">
          <div className="w-full max-w-[300px] shadow-2xl rounded-sm overflow-hidden bg-white ring-1 ring-black/5 relative group">
            {/* Scaled Preview Wrapper */}
            <div className="w-[210mm] h-[297mm] origin-top-left transform scale-[0.35] bg-white pointer-events-none select-none">
              <CVPreview data={cvData} template={selectedTemplate} />
            </div>
            {/* Overlay for quick action or zoom hint */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors cursor-pointer" />
          </div>

          <p className="mt-6 text-xs text-center text-muted-foreground whitespace-pre-line">
            {t('preview_scaled_msg')}
          </p>
        </div>
      </aside>

      {/* Hidden Print Component (Always rendered but hidden) */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <CVPreview data={cvData} template={selectedTemplate} />
        </div>
      </div>
    </div>
  );
}

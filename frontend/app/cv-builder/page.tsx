"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stepper } from "@/components/cv/Stepper";
import { TemplateSelector } from "@/components/cv/TemplateSelector";
import { JobOfferForm } from "@/components/cv/forms/JobOfferForm";
import { PersonalInfoForm } from "@/components/cv/forms/PersonalInfoForm";
import { EducationForm } from "@/components/cv/forms/EducationForm";
import { ExperienceForm } from "@/components/cv/forms/ExperienceForm";
import { ProjectsForm } from "@/components/cv/forms/ProjectsForm";
import { SkillsForm } from "@/components/cv/forms/SkillsForm";
import { LanguagesForm } from "@/components/cv/forms/LanguagesForm";
import { CVPreview } from "@/components/cv/CVPreview";
import { PrintableCV } from "@/components/cv/PrintableCV";
import { downloadCVAsPDF } from "@/lib/downloadUtils";
import { CVData, JobOffer } from "@/types/cv";

const steps = [
  { id: "01", name: "Template" },
  { id: "02", name: "Job Offer" },
  { id: "03", name: "Personal Info" },
  { id: "04", name: "Experience" },
  { id: "05", name: "Projects" },
  { id: "06", name: "Education" },
  { id: "07", name: "Skills" },
  { id: "08", name: "Languages & Certs" },
];

const CVBuilderPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("modern-black");
  const [jobOffer, setJobOffer] = useState<JobOffer>({
    title: "",
    company: "",
    description: "",
    requirements: "",
    skills: [],
    location: "",
    jobType: "",
  });
  const [formData, setFormData] = useState<CVData>({
    personalInfo: {
      fullName: "",
      email: "",
      phoneNumber: "",
      linkedin: "",
      github: "",
      portfolio: "",
      location: "",
      profilePhoto: "",
      title: "",
      summary: "",
    },
    education: [],
    experience: [],
    projects: [],
    skills: {
      hard: [],
      soft: [],
      languages: [],
      certifications: [],
      interests: [],
    },
    jobOffer: undefined, // Will be set when job offer is provided
    preferences: {
      primaryColor: "#3B82F6", // Default blue color
    },
  });

  const printableComponentRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const fileBaseName = `${formData.personalInfo.fullName || "CV"}-OptimaCV`;

  const handleDownloadPDF = () => {
    // Use the visible preview element instead of hidden one
    const previewElement = previewRef.current?.querySelector('.cv-preview-content') as HTMLElement;
    if (!previewElement) {
      alert('Preview not ready. Please wait for the CV to load.');
      return;
    }
    downloadCVAsPDF(previewElement, fileBaseName);
  };

  const handleFullScreenPreview = () => {
    setIsFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleNext = () => {
    // Always sync job offer data when moving from job offer step
    if (currentStep === 1) {
      setFormData(prev => ({ ...prev, jobOffer: jobOffer.description.trim() ? jobOffer : undefined }));
    }
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <TemplateSelector
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 1:
        return <JobOfferForm jobOffer={jobOffer} setJobOffer={setJobOffer} />;
      case 2:
        return <PersonalInfoForm formData={formData} setFormData={setFormData} />;
      case 3:
        return <ExperienceForm formData={formData} setFormData={setFormData} />;
      case 4:
        return <ProjectsForm formData={formData} setFormData={setFormData} />;
      case 5:
        return <EducationForm formData={formData} setFormData={setFormData} />;
      case 6:
        return <SkillsForm formData={formData} setFormData={setFormData} />;
      case 7:
        return <LanguagesForm formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Hidden component for printing */}
      <div className="hidden">
        <PrintableCV ref={printableComponentRef} template={selectedTemplate} data={formData} />
      </div>

      <h1 className="text-3xl font-bold text-center my-8">CV Builder</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Stepper
                steps={steps}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            </CardHeader>
            <CardContent>{renderStepContent()}</CardContent>
          </Card>
          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <div className="flex gap-2">
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Preview</span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleFullScreenPreview}
                  >
                    Full Screen
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleZoomOut}
                  >
                    -
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleZoomIn}
                  >
                    +
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="cv-preview-container" ref={previewRef}>
                <div className="bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-gray-200 h-[700px] overflow-y-auto">
                  <div 
                    className="cv-preview-content transition-transform duration-200"
                    style={{ 
                      transform: `scale(${zoomLevel})`, 
                      transformOrigin: 'top left',
                      fontSize: `${0.5  * zoomLevel}rem` // Base small font size that scales with zoom
                    }}
                  >
                    <CVPreview template={selectedTemplate} data={formData} />
                  </div>
                </div>
                
                {/* Preview Controls */}
                <div className="mt-4 flex justify-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const templates = ['modern-black', 'colored-sidebar', 'minimal'];
                      const currentIndex = templates.indexOf(selectedTemplate);
                      const nextIndex = (currentIndex + 1) % templates.length;
                      setSelectedTemplate(templates[nextIndex]);
                    }}
                  >
                    ↻ Switch Template
                  </Button>
                  
                  {formData.personalInfo.fullName && (
                    <div className="text-sm text-gray-600 flex items-center">
                      ✓ Ready for download
                    </div>
                  )}
                </div>
                
                {/* Data Quality Indicators */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2 rounded ${formData.personalInfo.fullName ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    👤 Personal: {formData.personalInfo.fullName ? '✓' : '⚠ Missing name'}
                  </div>
                  <div className={`p-2 rounded ${formData.experience.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    💼 Experience: {formData.experience.length || 0}
                  </div>
                  <div className={`p-2 rounded ${formData.education.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    🎓 Education: {formData.education.length || 0}
                  </div>
                  <div className={`p-2 rounded ${formData.skills.hard.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                    🛠 Skills: {formData.skills.hard.length || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-4xl max-h-full overflow-auto">
            <Button 
              onClick={handleCloseFullScreen}
              className="absolute top-4 right-4 z-10 bg-white text-black hover:bg-gray-100"
              size="sm"
            >
              ✕ Close
            </Button>
            <div className="bg-white m-4 shadow-2xl rounded-lg overflow-hidden">
              <PrintableCV template={selectedTemplate} data={formData} ref={printableComponentRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilderPage;
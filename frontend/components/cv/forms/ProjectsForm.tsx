import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles, RotateCcw } from "lucide-react";
import { CVData } from "@/types/cv";
import { optimizeContentBasedOnOffer, optimizeContentOffline } from "@/services/optimization_service";

interface ProjectsFormProps {
  formData: CVData;
  setFormData: React.Dispatch<React.SetStateAction<CVData>>;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ formData, setFormData }) => {
  const [optimizingIndex, setOptimizingIndex] = useState<number | null>(null);
  const [showJobOfferNotice, setShowJobOfferNotice] = useState(false);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newProjects = [...formData.projects];
    newProjects[index] = { ...newProjects[index], [name]: value };
    setFormData((prev) => ({ ...prev, projects: newProjects }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", description: "", url: "", originalDescription: "" },
      ],
    }));
  };

  const removeProject = (index: number) => {
    const newProjects = formData.projects.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, projects: newProjects }));
  };

  const optimizeProject = async (index: number) => {
    if (!formData.jobOffer) {
      setShowJobOfferNotice(true);
      setTimeout(() => setShowJobOfferNotice(false), 5000);
      return;
    }

    const project = formData.projects[index];
    if (!project.description.trim()) {
      return;
    }

    setOptimizingIndex(index);

    try {
      // Store original if not already stored
      if (!project.originalDescription) {
        const newProjects = [...formData.projects];
        newProjects[index] = { ...newProjects[index], originalDescription: project.description };
        setFormData((prev) => ({ ...prev, projects: newProjects }));
      }

      const result = await optimizeContentOffline({
        jobOffer: formData.jobOffer,
        originalText: project.originalDescription || project.description,
        type: 'project',
        itemTitle: project.name
      });

      const newProjects = [...formData.projects];
      newProjects[index] = { ...newProjects[index], description: result.optimizedText };
      setFormData((prev) => ({ ...prev, projects: newProjects }));

    } catch (error) {
      console.error('Error optimizing project:', error);
    } finally {
      setOptimizingIndex(null);
    }
  };

  const revertToOriginal = (index: number) => {
    const project = formData.projects[index];
    if (project.originalDescription) {
      const newProjects = [...formData.projects];
      newProjects[index] = { ...newProjects[index], description: project.originalDescription };
      setFormData((prev) => ({ ...prev, projects: newProjects }));
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        If you don't have professional experience, showcase your projects.
      </p>
      
      {/* Job Offer Notice */}
      {showJobOfferNotice && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 To enable AI optimization, please provide job offer information in the first step.
          </p>
        </div>
      )}

      {formData.projects.map((proj, index) => (
        <div key={index} className="p-4 border rounded-md space-y-2 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removeProject(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div>
            <Label>Project Name</Label>
            <Input
              name="name"
              value={proj.name}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label>Description</Label>
              <div className="flex gap-2">
                {proj.originalDescription && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => revertToOriginal(index)}
                    className="text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Revert
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => optimizeProject(index)}
                  disabled={!proj.description.trim() || optimizingIndex === index}
                  className="text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {optimizingIndex === index ? 'Optimizing...' : 'Optimize for Job'}
                </Button>
              </div>
            </div>
            <Textarea
              name="description"
              value={proj.description}
              onChange={(e) => handleChange(index, e)}
              className={proj.originalDescription ? 'border-green-200 bg-green-50' : ''}
            />
            {proj.originalDescription && (
              <p className="text-xs text-green-600">✨ Optimized for current job offer</p>
            )}
          </div>
          <div>
            <Label>Project Link</Label>
            <Input
              name="url"
              value={proj.url}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
        </div>
      ))}
      <Button onClick={addProject} variant="outline">
        Add Project
      </Button>
    </div>
  );
};

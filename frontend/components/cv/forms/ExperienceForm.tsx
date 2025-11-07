import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles, RotateCcw } from "lucide-react";
import { CVData } from "@/types/cv";
import { optimizeContentBasedOnOffer, optimizeContentOffline } from "@/services/optimization_service";

interface ExperienceFormProps {
  formData: CVData;
  setFormData: React.Dispatch<React.SetStateAction<CVData>>;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ formData, setFormData }) => {
  const [optimizingIndex, setOptimizingIndex] = useState<number | null>(null);
  const [showJobOfferNotice, setShowJobOfferNotice] = useState(false);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newExperience = [...formData.experience];
    newExperience[index] = { ...newExperience[index], [name]: value };
    setFormData((prev) => ({ ...prev, experience: newExperience }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: "", role: "", startDate: "", endDate: "", description: "", originalDescription: "" },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    const newExperience = formData.experience.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, experience: newExperience }));
  };

  const optimizeExperience = async (index: number) => {
    if (!formData.jobOffer) {
      setShowJobOfferNotice(true);
      setTimeout(() => setShowJobOfferNotice(false), 5000);
      return;
    }

    const experience = formData.experience[index];
    if (!experience.description.trim()) {
      return;
    }

    setOptimizingIndex(index);

    try {
      // Store original if not already stored
      if (!experience.originalDescription) {
        const newExperience = [...formData.experience];
        newExperience[index] = { ...newExperience[index], originalDescription: experience.description };
        setFormData((prev) => ({ ...prev, experience: newExperience }));
      }

      // The text to be optimized is the current description.
      const textToOptimize = experience.description;

      const result = await optimizeContentOffline({
        jobOffer: formData.jobOffer,
        originalText: textToOptimize,
        type: 'experience',
        itemTitle: `${experience.role} at ${experience.company}`
      });

      const newExperience = [...formData.experience];
      newExperience[index] = { ...newExperience[index], description: result.optimizedText };
      setFormData((prev) => ({ ...prev, experience: newExperience }));

    } catch (error) {
      console.error('Error optimizing experience:', error);
    } finally {
      setOptimizingIndex(null);
    }
  };

  const revertToOriginal = (index: number) => {
    const experience = formData.experience[index];
    if (experience.originalDescription) {
      const newExperience = [...formData.experience];
      newExperience[index] = { ...newExperience[index], description: experience.originalDescription };
      setFormData((prev) => ({ ...prev, experience: newExperience }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Job Offer Notice */}
      {showJobOfferNotice && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 To enable AI optimization, please provide job offer information in the first step.
          </p>
        </div>
      )}

      {formData.experience.map((exp, index) => (
        <div key={index} className="p-4 border rounded-md space-y-2 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removeExperience(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div>
            <Label>Company</Label>
            <Input
              name="company"
              value={exp.company}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <Label>Job Title</Label>
            <Input
              name="role"
              value={exp.role}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                name="startDate"
                type="month"
                value={exp.startDate}
                onChange={(e) => handleChange(index, e)}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                name="endDate"
                type="month"
                value={exp.endDate}
                onChange={(e) => handleChange(index, e)}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label>Details</Label>
              <div className="flex gap-2">
                {exp.originalDescription && (
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
                  onClick={() => optimizeExperience(index)}
                  disabled={!exp.description.trim() || optimizingIndex === index}
                  className="text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {optimizingIndex === index ? 'Optimizing...' : 'Optimize for Job'}
                </Button>
              </div>
            </div>
            <Textarea
              name="description"
              value={exp.description}
              onChange={(e) => handleChange(index, e)}
              placeholder="Describe your responsibilities and achievements."
              className={exp.originalDescription ? 'border-green-200 bg-green-50' : ''}
            />
            {exp.originalDescription && (
              <p className="text-xs text-green-600">✨ Optimized for current job offer</p>
            )}
          </div>
        </div>
      ))}
      <Button onClick={addExperience} variant="outline">
        Add Experience
      </Button>
    </div>
  );
};

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobOffer } from "@/types/cv";
import { Briefcase, Building, MapPin } from "lucide-react";

interface JobOfferFormProps {
  jobOffer: JobOffer;
  setJobOffer: React.Dispatch<React.SetStateAction<JobOffer>>;
}

export const JobOfferForm: React.FC<JobOfferFormProps> = ({ jobOffer, setJobOffer }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobOffer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobOffer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setJobOffer((prev) => ({
      ...prev,
      skills,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Info Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-800 mb-1 flex items-center">
          <Briefcase className="w-4 h-4 mr-2" />
          Job Offer Information (Optional)
        </h4>
        <p className="text-sm text-green-700">
          Provide details about the job you're applying for. Our AI will optimize your experience and projects to match this role. You can skip this step if you prefer.
        </p>
      </div>

      {/* Simple Job Description */}
      <div>
        <Label htmlFor="description">Job Offer Description</Label>
        <Textarea
          id="description"
          name="description"
          value={jobOffer.description}
          onChange={handleChange}
          placeholder="Paste the complete job offer/description here (including title, company, requirements, etc.)..."
          className="min-h-[200px]"
        />
        <p className="text-xs text-gray-500 mt-1">
          Include job title, company name, requirements, and any other relevant details in this single field.
        </p>
      </div>
    </div>
  );
};
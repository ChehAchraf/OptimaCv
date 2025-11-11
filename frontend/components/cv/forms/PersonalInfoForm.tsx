"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { CVData } from "@/types/cv";

interface PersonalInfoFormProps {
  formData: CVData;
  setFormData: React.Dispatch<React.SetStateAction<CVData>>;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, setFormData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    formData.personalInfo.profilePhoto || null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value },
    }));
  };

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      
      // Also convert to base64 for storage
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, profilePhoto: result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-1">💡 Information</h4>
        <p className="text-sm text-blue-700">
          Fields marked with <span className="font-semibold">*</span> are required. 
          All other fields are optional but help create a more complete CV.
        </p>
      </div>

      {/* Profile Photo Section - Updated Design */}
      <div className="flex flex-col items-center space-y-4">
        <div
          onClick={handleClick}
          className="relative w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition"
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          ) : (
            <User className="w-16 h-16 text-gray-500" />
          )}
          <div className="absolute bottom-0 w-full bg-black bg-opacity-40 text-white text-xs text-center py-1 opacity-0 hover:opacity-100 transition">
            Change
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-center">
          <Label className="text-sm font-medium text-gray-700">
            Profile Photo (optional) - Click the image to upload
          </Label>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.personalInfo.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="title">Professional Title (optional)</Label>
          <Input
            id="title"
            name="title"
            value={formData.personalInfo.title || ""}
            onChange={handleChange}
            placeholder="e.g., Software Engineer"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Professional Summary (optional)</Label>
        <Textarea
          id="summary"
          name="summary"
          value={formData.personalInfo.summary || ""}
          onChange={handleChange}
          rows={4}
          placeholder="Brief professional summary..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.personalInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.personalInfo.phoneNumber}
            onChange={handleChange}
            placeholder="Your phone number"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location (optional)</Label>
        <Input
          id="location"
          name="location"
          value={formData.personalInfo.location || ""}
          onChange={handleChange}
          placeholder="City, Country"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="linkedin">LinkedIn Profile (optional)</Label>
          <Input
            id="linkedin"
            name="linkedin"
            value={formData.personalInfo.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
          />
        </div>
        <div>
          <Label htmlFor="github">GitHub Profile (optional)</Label>
          <Input
            id="github"
            name="github"
            value={formData.personalInfo.github}
            onChange={handleChange}
            placeholder="https://github.com/username"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="portfolio">Portfolio (optional)</Label>
        <Input
          id="portfolio"
          name="portfolio"
          value={formData.personalInfo.portfolio || ""}
          onChange={handleChange}
          placeholder="https://yourportfolio.com"
        />
      </div>
    </div>
  );
};

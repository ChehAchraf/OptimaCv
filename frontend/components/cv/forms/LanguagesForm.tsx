import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CVData } from "@/types/cv";

interface LanguagesFormProps {
  formData: CVData;
  setFormData: React.Dispatch<React.SetStateAction<CVData>>;
}

export const LanguagesForm: React.FC<LanguagesFormProps> = ({ formData, setFormData }) => {
  const [newLanguage, setNewLanguage] = useState({ name: "", level: "" });
  const [newCertification, setNewCertification] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const addLanguage = () => {
    if (newLanguage.name && newLanguage.level) {
      setFormData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          languages: [...(prev.skills.languages || []), newLanguage],
        },
      }));
      setNewLanguage({ name: "", level: "" });
    }
  };

  const removeLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        languages: prev.skills.languages?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const addCertification = () => {
    if (newCertification) {
      setFormData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          certifications: [...(prev.skills.certifications || []), newCertification],
        },
      }));
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        certifications: prev.skills.certifications?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          interests: [...(prev.skills.interests || []), newInterest.trim()],
        },
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        interests: prev.skills.interests?.filter((_, i) => i !== index) || [],
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Languages Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Languages</h3>
        
        {/* Add new language */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label htmlFor="languageName">Language</Label>
                <Input
                  id="languageName"
                  value={newLanguage.name}
                  onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
                  placeholder="e.g., English"
                />
              </div>
              <div>
                <Label htmlFor="languageLevel">Level</Label>
                <Input
                  id="languageLevel"
                  value={newLanguage.level}
                  onChange={(e) => setNewLanguage({ ...newLanguage, level: e.target.value })}
                  placeholder="e.g., Native, Fluent, Intermediate"
                />
              </div>
              <Button onClick={addLanguage} type="button">
                Add Language
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Language list */}
        <div className="space-y-2">
          {formData.skills.languages?.map((lang, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{lang.name}</span>
                <span className="text-gray-500 ml-2">({lang.level})</span>
              </div>
              <Button
                onClick={() => removeLanguage(index)}
                variant="destructive"
                size="sm"
                type="button"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Certifications</h3>
        
        {/* Add new certification */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="certification">Certification</Label>
                <Input
                  id="certification"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="e.g., AWS Certified Developer"
                />
              </div>
              <Button onClick={addCertification} type="button">
                Add Certification
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Certifications list */}
        <div className="space-y-2">
          {formData.skills.certifications?.map((cert, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>{cert}</span>
              <Button
                onClick={() => removeCertification(index)}
                variant="destructive"
                size="sm"
                type="button"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Interests Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Centres d'intérêt</h3>
        
        {/* Add new interest */}
        <Card className="mb-4">
          <CardContent className="pt-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="newInterest">Interest</Label>
                <Input
                  id="newInterest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="e.g., Photography, Traveling, Reading"
                />
              </div>
              <Button onClick={addInterest} type="button">
                Add Interest
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Interests list */}
        <div className="space-y-2">
          {formData.skills.interests?.map((interest, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>{interest}</span>
              <Button
                onClick={() => removeInterest(index)}
                variant="destructive"
                size="sm"
                type="button"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
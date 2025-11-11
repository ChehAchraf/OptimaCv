import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CVData } from "@/types/cv";

interface SkillsFormProps {
  formData: CVData;
  setFormData: React.Dispatch<React.SetStateAction<CVData>>;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ formData, setFormData }) => {
  const [hardSkill, setHardSkill] = useState("");
  const [softSkill, setSoftSkill] = useState("");

  const addSkill = (type: 'hard' | 'soft') => {
    const skillToAdd = type === "hard" ? hardSkill : softSkill;
    if (skillToAdd && !formData.skills[type].includes(skillToAdd)) {
      setFormData((prev) => ({
        ...prev,
        skills: {
          ...prev.skills,
          [type]: [...prev.skills[type], skillToAdd],
        },
      }));
      if (type === "hard") setHardSkill("");
      else setSoftSkill("");
    }
  };

  const removeSkill = (type: 'hard' | 'soft', skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter((skill) => skill !== skillToRemove),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Soft Skills - Left Column */}
        <div>
          <Label htmlFor="softSkill">Soft Skills</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              id="softSkill"
              value={softSkill}
              onChange={(e) => setSoftSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill('soft')}
              placeholder="e.g., Leadership, Communication"
            />
            <Button onClick={() => addSkill("soft")}>Add</Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.skills.soft.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
                <button onClick={() => removeSkill("soft", skill)} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Hard Skills - Right Column */}
        <div>
          <Label htmlFor="hardSkill">Hard Skills</Label>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              id="hardSkill"
              value={hardSkill}
              onChange={(e) => setHardSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSkill('hard')}
              placeholder="e.g., JavaScript, Python, React"
            />
            <Button onClick={() => addSkill("hard")}>Add</Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {formData.skills.hard.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
                <button onClick={() => removeSkill("hard", skill)} className="ml-2">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

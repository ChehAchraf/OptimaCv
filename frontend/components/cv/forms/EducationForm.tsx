import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CVData } from "@/types/cv";

interface EducationFormProps {
  formData: CVData;
  setFormData: React.Dispatch<React.SetStateAction<CVData>>;
}

export const EducationForm: React.FC<EducationFormProps> = ({ formData, setFormData }) => {
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [name]: value };
    setFormData((prev) => ({ ...prev, education: newEducation }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { school: "", degree: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    const newEducation = formData.education.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, education: newEducation }));
  };

  return (
    <div className="space-y-4">
      {formData.education.map((edu, index) => (
        <div key={index} className="p-4 border rounded-md space-y-2 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removeEducation(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div>
            <Label>School</Label>
            <Input
              name="school"
              value={edu.school}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <Label>Degree</Label>
            <Input
              name="degree"
              value={edu.degree}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                name="startDate"
                type="month"
                value={edu.startDate}
                onChange={(e) => handleChange(index, e)}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                name="endDate"
                type="month"
                value={edu.endDate}
                onChange={(e) => handleChange(index, e)}
              />
            </div>
          </div>
        </div>
      ))}
      <Button onClick={addEducation} variant="outline">
        Add Education
      </Button>
    </div>
  );
};

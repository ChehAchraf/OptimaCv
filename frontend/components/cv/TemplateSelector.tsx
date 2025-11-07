import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CVData } from "@/types/cv";

const templates = [
  { id: "modern-black", name: "Modern Black", image: "/images/cv-templates/modern-black.svg" },
  { id: "colored-sidebar", name: "Colored Sidebar", image: "/images/cv-templates/colored-sidebar.svg" },
  { id: "minimal", name: "Minimal", image: "/images/cv-templates/minimal.svg" },
];

const predefinedColors = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Red", value: "#EF4444" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Pink", value: "#EC4899" },
];

interface TemplateSelectorProps {
    selectedTemplate: string;
    setSelectedTemplate: (id: string) => void;
    formData: CVData;
    setFormData: React.Dispatch<React.SetStateAction<CVData>>;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplate, 
  setSelectedTemplate, 
  formData, 
  setFormData 
}) => {
  const handleColorChange = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        primaryColor: color,
      },
    }));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Choose a Template</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
              selectedTemplate === template.id
                ? "border-indigo-500 scale-105"
                : "border-transparent hover:border-indigo-300"
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="w-full h-auto relative aspect-[1/1.414]">
                <Image
                    src={template.image}
                    alt={template.name}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>
            <p className="text-center text-sm font-medium p-2 bg-gray-100 dark:bg-gray-700">
              {template.name}
            </p>
          </div>
        ))}
      </div>

      {/* Color Picker for Colored Sidebar Template */}
      {selectedTemplate === "colored-sidebar" && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-md font-semibold mb-3">🎨 Customize Color</h3>
          
          {/* Predefined Colors */}
          <div className="mb-4">
            <Label className="text-sm font-medium mb-2 block">Quick Colors</Label>
            <div className="flex flex-wrap gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleColorChange(color.value)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    formData.preferences?.primaryColor === color.value
                      ? "border-gray-800 scale-110"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <Label htmlFor="customColor" className="text-sm font-medium mb-2 block">
              Custom Color
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="customColor"
                type="color"
                value={formData.preferences?.primaryColor || "#3B82F6"}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-10 p-1 border rounded"
              />
              <span className="text-sm text-gray-600">
                {formData.preferences?.primaryColor || "#3B82F6"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

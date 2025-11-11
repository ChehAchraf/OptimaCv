import React from "react";
import { ModernBlackTemplate } from "./templates/ModernBlackTemplate";
import { ColoredSidebarTemplate } from "./templates/ColoredSidebarTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { CVData } from "@/types/cv";

interface CVPreviewProps {
    template: string;
    data: CVData;
}

export const CVPreview: React.FC<CVPreviewProps> = ({ template, data }) => {
  const primaryColor = data.preferences?.primaryColor || '#3B82F6';
  
  switch (template) {
    case "modern-black":
      return <ModernBlackTemplate data={data} />;
    case "colored-sidebar":
      return <ColoredSidebarTemplate data={data} primaryColor={primaryColor} />;
    case "minimal":
      return <MinimalTemplate data={data} />;
    default:
      return (
        <div className="p-8 bg-gray-100 flex items-center justify-center text-gray-500 min-h-96">
          <div className="text-center">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-lg font-medium">Select a template to see preview</p>
            <p className="text-sm mt-2">Choose from our professional CV templates above</p>
          </div>
        </div>
      );
  }
};

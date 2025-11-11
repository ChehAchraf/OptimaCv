"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, GripVertical } from "lucide-react";

export interface SectionOrder {
  id: string;
  name: string;
  enabled: boolean;
}

interface SectionOrderingProps {
  sections: SectionOrder[];
  setSections: React.Dispatch<React.SetStateAction<SectionOrder[]>>;
}

export const SectionOrdering: React.FC<SectionOrderingProps> = ({ sections, setSections }) => {
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newSections.length) {
      [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
      setSections(newSections);
    }
  };

  const toggleSection = (index: number) => {
    const newSections = [...sections];
    newSections[index].enabled = !newSections[index].enabled;
    setSections(newSections);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Section Order & Visibility</CardTitle>
        <p className="text-sm text-gray-600">Customize the order and visibility of resume sections</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div 
              key={section.id}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                section.enabled ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-gray-400" />
                <input
                  type="checkbox"
                  checked={section.enabled}
                  onChange={() => toggleSection(index)}
                  className="rounded border-gray-300"
                />
                <span className={`${section.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                  {section.name}
                </span>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveSection(index, 'up')}
                  disabled={index === 0}
                  className="p-1"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => moveSection(index, 'down')}
                  disabled={index === sections.length - 1}
                  className="p-1"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 Use checkboxes to show/hide sections and arrows to reorder them.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
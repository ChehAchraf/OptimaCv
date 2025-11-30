import React, { useState, useRef } from 'react';
import { CVFullProfile } from '@/types/cv-builder';
import { TemplateModern } from '@/components/cv-templates/TemplateModern';
import { TemplateClassic } from '@/components/cv-templates/TemplateClassic';
import { TemplateMinimal } from '@/components/cv-templates/TemplateMinimal';
import { Button } from '@/components/ui/button';
import { useReactToPrint } from 'react-to-print';
import { HiPrinter } from 'react-icons/hi';

interface Props {
    data: CVFullProfile;
}

export const TemplateSelector: React.FC<Props> = ({ data }) => {
    const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');
    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `${data.personal_details.full_name}_CV`,
    });

    const renderTemplate = () => {
        switch (selectedTemplate) {
            case 'modern': return <TemplateModern data={data} />;
            case 'classic': return <TemplateClassic data={data} />;
            case 'minimal': return <TemplateMinimal data={data} />;
            default: return <TemplateModern data={data} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2">
                    <Button
                        variant={selectedTemplate === 'modern' ? 'default' : 'outline'}
                        onClick={() => setSelectedTemplate('modern')}
                    >
                        Modern
                    </Button>
                    <Button
                        variant={selectedTemplate === 'classic' ? 'default' : 'outline'}
                        onClick={() => setSelectedTemplate('classic')}
                    >
                        Classic
                    </Button>
                    <Button
                        variant={selectedTemplate === 'minimal' ? 'default' : 'outline'}
                        onClick={() => setSelectedTemplate('minimal')}
                    >
                        Minimal
                    </Button>
                </div>
                <Button onClick={() => handlePrint()} className="bg-green-600 hover:bg-green-700 text-white">
                    <HiPrinter className="mr-2 h-5 w-5" />
                    Download PDF
                </Button>
            </div>

            <div className="border rounded-lg shadow-lg overflow-hidden bg-gray-100 p-4 md:p-8">
                <div className="max-w-[210mm] mx-auto bg-white shadow-md">
                    <div ref={componentRef}>
                        {renderTemplate()}
                    </div>
                </div>
            </div>
        </div>
    );
};

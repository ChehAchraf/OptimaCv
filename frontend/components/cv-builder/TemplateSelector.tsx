import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import { CVFullProfile, TemplateType } from '@/types/cv-builder';
import { Button } from '@/components/ui/button';
import { useReactToPrint } from 'react-to-print';
import { HiPrinter, HiLockClosed } from 'react-icons/hi';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';

const TemplateModern = dynamic(() => import('@/components/cv-templates/TemplateModern').then(mod => mod.TemplateModern), { loading: () => <TemplateLoader /> });
const TemplateClassic = dynamic(() => import('@/components/cv-templates/TemplateClassic').then(mod => mod.TemplateClassic), { loading: () => <TemplateLoader /> });
const TemplateMinimal = dynamic(() => import('@/components/cv-templates/TemplateMinimal').then(mod => mod.TemplateMinimal), { loading: () => <TemplateLoader /> });
const TemplateExecutive = dynamic(() => import('@/components/cv-templates/TemplateExecutive').then(mod => mod.TemplateExecutive), { loading: () => <TemplateLoader /> });
const TemplateTech = dynamic(() => import('@/components/cv-templates/TemplateTech').then(mod => mod.TemplateTech), { loading: () => <TemplateLoader /> });
const TemplateGlobal = dynamic(() => import('@/components/cv-templates/TemplateGlobal').then(mod => mod.TemplateGlobal), { loading: () => <TemplateLoader /> });

const TemplateLoader = () => (
    <div className="w-full h-[800px] flex items-center justify-center bg-gray-50 border rounded-lg">
        <Skeleton className="w-[210mm] h-[297mm]" />
    </div>
);

interface Props {
    data: CVFullProfile;
    isPremium?: boolean;
    selectedTemplate: TemplateType;
    onSelectTemplate: (template: TemplateType) => void;
}

export const TemplateSelector: React.FC<Props> = ({ data, isPremium = false, selectedTemplate, onSelectTemplate }) => {
    const t = useTranslations('CVBuilder.TemplateSelector');
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `${data.personal_details.full_name?.replace(/\s+/g, '_')}_CV` || 'CV',
    });

    const templates: { id: TemplateType; name: string; isPro: boolean }[] = [
        { id: 'modern', name: t('modern'), isPro: false },
        { id: 'classic', name: t('classic'), isPro: true },
        { id: 'minimal', name: t('minimal'), isPro: true },
        { id: 'executive', name: t('executive'), isPro: true },
        { id: 'tech', name: t('tech'), isPro: true },
        { id: 'global', name: t('global'), isPro: true },
    ];

    const isLocked = (templateId: TemplateType) => {
        const template = templates.find(t => t.id === templateId);
        return template?.isPro && !isPremium;
    };

    const renderTemplate = (templateId: TemplateType) => {
        switch (templateId) {
            case 'modern': return <TemplateModern data={data} />;
            case 'classic': return <TemplateClassic data={data} />;
            case 'minimal': return <TemplateMinimal data={data} />;
            case 'executive': return <TemplateExecutive data={data} isPremium={isPremium} />;
            case 'tech': return <TemplateTech data={data} isPremium={isPremium} />;
            case 'global': return <TemplateGlobal data={data} isPremium={isPremium} />;
            default: return <TemplateModern data={data} />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                    {templates.map((template) => (
                        <div key={template.id} className="relative">
                            <Button
                                variant={selectedTemplate === template.id ? 'default' : 'outline'}
                                onClick={() => !isLocked(template.id) ? onSelectTemplate(template.id) : null}
                                className={isLocked(template.id) ? 'opacity-70 cursor-not-allowed pr-8' : ''}
                            >
                                {template.name}
                                {template.isPro && (
                                    <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 text-xs px-1">
                                        PRO
                                    </Badge>
                                )}
                            </Button>
                            {isLocked(template.id) && (
                                <div className="absolute top-0 right-0 h-full flex items-center pr-2 pointer-events-none text-muted-foreground">
                                    <HiLockClosed />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {(!isPremium && isLocked(selectedTemplate)) ? (
                    <Button variant="secondary" disabled className="w-full md:w-auto">
                        <HiLockClosed className="mr-2" /> {t('upgrade_to_pro')}
                    </Button>
                ) : (
                    <Button onClick={() => handlePrint()} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white">
                        <HiPrinter className="mr-2 h-5 w-5" />
                        {t('download_pdf')}
                    </Button>
                )}
            </div>

            {!isPremium && templates.find(t => t.id === selectedTemplate)?.isPro && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-sm text-amber-800 flex items-center">
                    <HiLockClosed className="mr-2 h-4 w-4" />
                    {t('premium_warning')}
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {/* Visual Preview (Scaled) */}
                <div className="border rounded-lg shadow-lg overflow-x-auto bg-gray-100 p-4 md:p-8 flex justify-center">
                    {/* Scale wrapper for responsive fit */}
                    <div className="bg-white shadow-xl origin-top transform-gpu scale-[0.4] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.8] xl:scale-[1] transition-transform">
                        {renderTemplate(selectedTemplate)}
                    </div>
                </div>

                {/* Hidden Print Component */}
                <div style={{ display: 'none' }}>
                    <div ref={printRef}>
                        {renderTemplate(selectedTemplate)}
                    </div>
                </div>
            </div>
        </div>
    );
};


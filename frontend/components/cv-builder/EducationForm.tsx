import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CVEducation } from '@/types/cv-builder';
import { HiTrash } from 'react-icons/hi';

export interface Props {
    data: CVEducation[];
    updateData: (data: CVEducation[]) => void;
}

export const EducationForm: React.FC<Props> = ({ data, updateData }) => {
    const t = useTranslations('EducationForm');
    useEffect(() => {
        if (data.length === 0) {
            addEducation();
        }
    }, []);

    const addEducation = () => {
        updateData([
            ...data,
            {
                institution: '',
                degree: '',
                field_of_study: '',
                start_date: '',
                current: false,
            },
        ]);
    };

    const removeEducation = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        updateData(newData);
    };

    const updateEducation = (index: number, key: keyof CVEducation, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [key]: value };
        updateData(newData);
    };

    return (
        <div className="space-y-6">
            {data.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50 dark:bg-gray-900/50 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeEducation(index)}
                    >
                        <HiTrash className="w-5 h-5" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t('institution')}</Label>
                            <Input
                                value={edu.institution}
                                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                placeholder="University Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('degree')}</Label>
                            <Input
                                value={edu.degree}
                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                placeholder="Bachelor's, Master's, etc."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('field_of_study')}</Label>
                            <Input
                                value={edu.field_of_study}
                                onChange={(e) => updateEducation(index, 'field_of_study', e.target.value)}
                                placeholder="Computer Science"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <Label>{t('start_date')}</Label>
                                    <Input
                                        value={edu.start_date}
                                        onChange={(e) => updateEducation(index, 'start_date', e.target.value)}
                                        placeholder="YYYY"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>{t('end_date')}</Label>
                                    <Input
                                        value={edu.end_date || ''}
                                        onChange={(e) => updateEducation(index, 'end_date', e.target.value)}
                                        placeholder="YYYY"
                                        disabled={edu.current}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <Checkbox
                                    id={`edu-current-${index}`}
                                    checked={edu.current}
                                    onCheckedChange={(checked) => updateEducation(index, 'current', checked)}
                                />
                                <Label htmlFor={`edu-current-${index}`}>{t('current_study')}</Label>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Button onClick={addEducation} variant="outline" className="w-full border-dashed">
                + {t('add_education')}
            </Button>
        </div>
    );
};

import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CVLanguage } from '@/types/cv-builder';
import { HiTrash } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    data: CVLanguage[];
    updateData: (data: CVLanguage[]) => void;
}

export const LanguagesForm: React.FC<Props> = ({ data, updateData }) => {
    // const t = useTranslations('CVBuilder.LanguagesForm'); // Assuming keys exist or fallback
    // Since keys don't exist yet, I'll use placeholders or existing generic ones if possible.
    // Ideally I should update translation files too.

    useEffect(() => {
        if (data.length === 0) {
            addLanguage();
        }
    }, [data.length]);

    const addLanguage = () => {
        updateData([
            ...data,
            {
                language: '',
                proficiency: 'Intermediate',
            },
        ]);
    };

    const removeLanguage = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        updateData(newData);
    };

    const updateLanguage = (index: number, key: keyof CVLanguage, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [key]: value };
        updateData(newData);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Languages</h3>
                <Button onClick={addLanguage} variant="outline" size="sm">+ Add Language</Button>
            </div>
            {data.map((lang, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50 dark:bg-gray-900/50 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeLanguage(index)}
                    >
                        <HiTrash className="w-5 h-5" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Input
                                value={lang.language}
                                onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                                placeholder="e.g. English, French"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Proficiency</Label>
                            <Select
                                value={lang.proficiency}
                                onValueChange={(val) => updateLanguage(index, 'proficiency', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select proficiency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Native">Native</SelectItem>
                                    <SelectItem value="Fluent">Fluent</SelectItem>
                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Basic">Basic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            ))}
            {data.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No languages added yet.
                </div>
            )}
        </div>
    );
};

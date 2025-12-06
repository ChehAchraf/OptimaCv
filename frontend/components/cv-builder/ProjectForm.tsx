import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CVProject } from '@/types/cv-builder';
import { HiTrash } from 'react-icons/hi';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

interface Props {
    data: CVProject[];
    updateData: (data: CVProject[]) => void;
}

export const ProjectForm: React.FC<Props> = ({ data, updateData }) => {
    const t = useTranslations('CVBuilder.ProjectForm');

    useEffect(() => {
        if (data.length === 0) {
            addProject();
        }
    }, []);

    const addProject = () => {
        updateData([
            ...data,
            {
                name: '',
                description: '',
                technologies: [],
            },
        ]);
    };

    const removeProject = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        updateData(newData);
    };

    const updateProject = (index: number, key: keyof CVProject, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [key]: value };
        updateData(newData);
    };

    const handleTechKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val) {
                const currentTechs = data[index].technologies;
                if (!currentTechs.includes(val)) {
                    updateProject(index, 'technologies', [...currentTechs, val]);
                }
                e.currentTarget.value = '';
            }
        }
    };

    const removeTech = (projectIndex: number, techToRemove: string) => {
        const currentTechs = data[projectIndex].technologies;
        updateProject(projectIndex, 'technologies', currentTechs.filter(t => t !== techToRemove));
    };

    return (
        <div className="space-y-6">
            {data.map((proj, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50 dark:bg-gray-900/50 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeProject(index)}
                    >
                        <HiTrash className="w-5 h-5" />
                    </Button>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>{t('project_name')}</Label>
                                <Input
                                    value={proj.name}
                                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                                    placeholder={t('project_name')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{t('link')}</Label>
                                <Input
                                    value={proj.link || ''}
                                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                                    placeholder={t('link')}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('technologies')}</Label>
                            <Input
                                onKeyDown={(e) => handleTechKeyDown(index, e)}
                                placeholder={t('technologies')}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {proj.technologies.map((tech) => (
                                    <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTech(index, tech)}>
                                        {tech} &times;
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('description')}</Label>
                            <Textarea
                                value={proj.description}
                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                placeholder={t('description')}
                                className="h-24"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <Button onClick={addProject} variant="outline" className="w-full border-dashed">
                + {t('add_project')}
            </Button>
        </div>
    );
};

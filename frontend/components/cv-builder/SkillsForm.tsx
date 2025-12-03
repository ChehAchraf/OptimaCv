import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CVSkill } from '@/types/cv-builder';
import { HiTrash } from 'react-icons/hi';
import { Badge } from '@/components/ui/badge';

interface Props {
    data: CVSkill[];
    updateData: (data: CVSkill[]) => void;
}

export const SkillsForm: React.FC<Props> = ({ data, updateData }) => {
    useEffect(() => {
        if (data.length === 0) {
            addSkillGroup();
        }
    }, []);

    const addSkillGroup = () => {
        updateData([
            ...data,
            {
                category: '',
                skills: [],
            },
        ]);
    };

    const removeSkillGroup = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        updateData(newData);
    };

    const updateSkillGroup = (index: number, key: keyof CVSkill, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [key]: value };
        updateData(newData);
    };

    const handleSkillKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val) {
                const currentSkills = data[index].skills;
                if (!currentSkills.includes(val)) {
                    updateSkillGroup(index, 'skills', [...currentSkills, val]);
                }
                e.currentTarget.value = '';
            }
        }
    };

    const removeSkill = (groupIndex: number, skillToRemove: string) => {
        const currentSkills = data[groupIndex].skills;
        updateSkillGroup(groupIndex, 'skills', currentSkills.filter(s => s !== skillToRemove));
    };

    return (
        <div className="space-y-6">
            {data.map((group, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50 dark:bg-gray-900/50 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeSkillGroup(index)}
                    >
                        <HiTrash className="w-5 h-5" />
                    </Button>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Input
                                value={group.category}
                                onChange={(e) => updateSkillGroup(index, 'category', e.target.value)}
                                placeholder="e.g., Frontend, Backend, Soft Skills"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Skills (Press Enter to add)</Label>
                            <Input
                                onKeyDown={(e) => handleSkillKeyDown(index, e)}
                                placeholder="Add a skill..."
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {group.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(index, skill)}>
                                        {skill} &times;
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <Button onClick={addSkillGroup} variant="outline" className="w-full border-dashed">
                + Add Skill Category
            </Button>
        </div>
    );
};

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CVExperience } from '@/types/cv-builder';
import { optimizeText } from '@/app/actions/optimize';
import { HiSparkles, HiTrash } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';

interface Props {
    data: CVExperience[];
    updateData: (data: CVExperience[]) => void;
}

export const ExperienceForm: React.FC<Props> = ({ data, updateData }) => {
    const [optimizingIndex, setOptimizingIndex] = useState<number | null>(null);

    React.useEffect(() => {
        if (data.length === 0) {
            addExperience();
        }
    }, []);

    const addExperience = () => {
        updateData([
            ...data,
            {
                company: '',
                position: '',
                start_date: '',
                current: false,
                description: '',
            },
        ]);
    };

    const removeExperience = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        updateData(newData);
    };

    const updateExperience = (index: number, key: keyof CVExperience, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [key]: value };
        updateData(newData);
    };

    const handleOptimize = async (index: number) => {
        const exp = data[index];
        if (!exp.description || exp.description.length < 10) return;

        setOptimizingIndex(index);
        try {
            const result = await optimizeText(exp.description, 'experience', exp.position);
            updateExperience(index, 'description', result.optimized_text);
        } catch (error) {
            console.error(error);
            // Handle error (toast, etc.)
        } finally {
            setOptimizingIndex(null);
        }
    };

    return (
        <div className="space-y-6">
            {data.map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50 dark:bg-gray-900/50 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeExperience(index)}
                    >
                        <HiTrash className="w-5 h-5" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                                value={exp.company}
                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                placeholder="Company Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Position</Label>
                            <Input
                                value={exp.position}
                                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                                placeholder="Job Title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Location</Label>
                            <Input
                                value={exp.location || ''}
                                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                placeholder="City, Country"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        value={exp.start_date}
                                        onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                                        placeholder="MM/YYYY"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>End Date</Label>
                                    <Input
                                        value={exp.end_date || ''}
                                        onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                                        placeholder="MM/YYYY"
                                        disabled={exp.current}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <Checkbox
                                    id={`current-${index}`}
                                    checked={exp.current}
                                    onCheckedChange={(checked) => updateExperience(index, 'current', checked)}
                                />
                                <Label htmlFor={`current-${index}`}>I currently work here</Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label>Description</Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOptimize(index)}
                                disabled={optimizingIndex === index || !exp.description}
                                className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                                {optimizingIndex === index ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <HiSparkles className="w-4 h-4 mr-2" />
                                )}
                                Optimize with AI
                            </Button>
                        </div>
                        <Textarea
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            className="h-32"
                        />
                    </div>
                </div>
            ))}

            <Button onClick={addExperience} variant="outline" className="w-full border-dashed">
                + Add Experience
            </Button>
        </div>
    );
};

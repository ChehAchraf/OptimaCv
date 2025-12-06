import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CVInterest } from '@/types/cv-builder';
import { HiTrash } from 'react-icons/hi';
import { Badge } from '@/components/ui/badge';

interface Props {
    data: CVInterest[];
    updateData: (data: CVInterest[]) => void;
}

export const InterestsForm: React.FC<Props> = ({ data, updateData }) => {

    const addInterest = () => {
        updateData([
            ...data,
            {
                name: '',
                keywords: [],
            },
        ]);
    };

    const removeInterest = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        updateData(newData);
    };

    const updateInterest = (index: number, key: keyof CVInterest, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [key]: value };
        updateData(newData);
    };

    const handleKeywordKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val) {
                const currentKeywords = data[index].keywords || [];
                if (!currentKeywords.includes(val)) {
                    updateInterest(index, 'keywords', [...currentKeywords, val]);
                }
                e.currentTarget.value = '';
            }
        }
    };

    const removeKeyword = (interestIndex: number, keywordToRemove: string) => {
        const currentKeywords = data[interestIndex].keywords || [];
        updateInterest(interestIndex, 'keywords', currentKeywords.filter(k => k !== keywordToRemove));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Interests</h3>
                <Button onClick={addInterest} variant="outline" size="sm">+ Add Interest</Button>
            </div>
            {data.map((interest, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50 dark:bg-gray-900/50 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeInterest(index)}
                    >
                        <HiTrash className="w-5 h-5" />
                    </Button>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Interest Name</Label>
                            <Input
                                value={interest.name}
                                onChange={(e) => updateInterest(index, 'name', e.target.value)}
                                placeholder="e.g. Photography, Sports"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Keywords (Press Enter to add)</Label>
                            <Input
                                onKeyDown={(e) => handleKeywordKeyDown(index, e)}
                                placeholder="e.g. Portrait, Landscape"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {interest.keywords?.map((keyword) => (
                                    <Badge key={keyword} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(index, keyword)}>
                                        {keyword} &times;
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {data.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No interests added.
                </div>
            )}
        </div>
    );
};

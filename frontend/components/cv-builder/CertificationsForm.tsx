import React, { useEffect } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CVCertification } from '@/types/cv-builder';
import { HiTrash } from 'react-icons/hi';

interface Props {
    data: CVCertification[];
    updateData: (data: CVCertification[]) => void;
}

export const CertificationsForm: React.FC<Props> = ({ data, updateData }) => {

    // Optional: Auto-add one if empty? Maybe not since it's an optional section.

    const addCertification = () => {
        updateData([
            ...data,
            {
                name: '',
                issuer: '',
                date: '',
                link: '',
            },
        ]);
    };

    const removeCertification = (index: number) => {
        const newData = [...data];
        newData.splice(index, 1);
        updateData(newData);
    };

    const updateCertification = (index: number, key: keyof CVCertification, value: any) => {
        const newData = [...data];
        newData[index] = { ...newData[index], [key]: value };
        updateData(newData);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Certifications</h3>
                <Button onClick={addCertification} variant="outline" size="sm">+ Add Certification</Button>
            </div>
            {data.map((cert, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4 bg-gray-50 dark:bg-gray-900/50 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeCertification(index)}
                    >
                        <HiTrash className="w-5 h-5" />
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Certification Name</Label>
                            <Input
                                value={cert.name}
                                onChange={(e) => updateCertification(index, 'name', e.target.value)}
                                placeholder="e.g. AWS Certified Solutions Architect"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Issuer</Label>
                            <Input
                                value={cert.issuer}
                                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                placeholder="e.g. Amazon Web Services"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={cert.date}
                                onChange={(e) => updateCertification(index, 'date', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Link (Optional)</Label>
                            <Input
                                value={cert.link}
                                onChange={(e) => updateCertification(index, 'link', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            ))}
            {data.length === 0 && (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                    No certifications added.
                </div>
            )}
        </div>
    );
};

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CVPersonalDetail } from '@/types/cv-builder';

interface Props {
    data: CVPersonalDetail;
    updateData: (key: keyof CVPersonalDetail, value: string) => void;
}

export const PersonalForm: React.FC<Props> = ({ data, updateData }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                        id="full_name"
                        value={data.full_name}
                        onChange={(e) => updateData('full_name', e.target.value)}
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => updateData('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                        id="phone"
                        value={data.phone}
                        onChange={(e) => updateData('phone', e.target.value)}
                        placeholder="+1 234 567 890"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                        id="location"
                        value={data.location || ''}
                        onChange={(e) => updateData('location', e.target.value)}
                        placeholder="New York, USA"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                        id="linkedin"
                        value={data.linkedin_url || ''}
                        onChange={(e) => updateData('linkedin_url', e.target.value)}
                        placeholder="https://linkedin.com/in/johndoe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                        id="github"
                        value={data.github_url || ''}
                        onChange={(e) => updateData('github_url', e.target.value)}
                        placeholder="https://github.com/johndoe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                        id="portfolio"
                        value={data.portfolio_url || ''}
                        onChange={(e) => updateData('portfolio_url', e.target.value)}
                        placeholder="https://johndoe.com"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                    id="summary"
                    value={data.summary || ''}
                    onChange={(e) => updateData('summary', e.target.value)}
                    placeholder="Briefly describe your professional background and goals..."
                    className="h-32"
                />
            </div>
        </div>
    );
};

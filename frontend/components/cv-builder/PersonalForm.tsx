import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CVPersonalDetail } from '@/types/cv-builder';
import { useFormValidation, cvPersonalDetailSchema } from '@/lib/validations';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sparkles, Loader2, Camera, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
    data: CVPersonalDetail;
    updateData: (key: keyof CVPersonalDetail, value: string) => void;
}

export const PersonalForm: React.FC<Props> = ({ data, updateData }) => {
    const t = useTranslations('CVBuilder.PersonalForm');
    const { getFieldError, hasError } = useFormValidation(cvPersonalDetailSchema);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleGenerateSummary = async () => {
        if (!data.full_name) {
            toast({
                title: t("missing_info"),
                description: t("please_fill_name"),
                variant: "destructive"
            });
            return;
        }

        setIsGenerating(true);
        try {
            const response = await fetch('/api/ai/generate-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to generate summary');

            const result = await response.json();
            if (result.summary) {
                updateData('summary', result.summary);
                toast({
                    title: t("success"),
                    description: t("summary_generated"),
                });
            }
        } catch (error) {
            toast({
                title: t("error"),
                description: t("generation_failed"),
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-center mb-6">
                <div className="relative group">
                    <label htmlFor="picture-upload" className="cursor-pointer block relative">
                        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                            <AvatarImage src={data.picture_url} className="object-cover" />
                            <AvatarFallback className="bg-slate-100 text-slate-400 text-2xl">
                                {data.full_name ? data.full_name.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <input
                            id="picture-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                        toast({
                                            title: t("error"),
                                            description: t("image_too_large"),
                                            variant: "destructive"
                                        });
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        updateData('picture_url', reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="full_name">
                        {t('fullName')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="full_name"
                        value={data.full_name}
                        onChange={(e) => updateData('full_name', e.target.value)}
                        placeholder={t('placeholders.fullName')}
                        required
                        className={hasError('full_name') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {hasError('full_name') && (
                        <p className="text-sm text-red-500">{getFieldError('full_name')}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="job_title">{t('jobTitle')}</Label>
                    <Input
                        id="job_title"
                        value={data.job_title || ''}
                        onChange={(e) => updateData('job_title', e.target.value)}
                        placeholder={t('placeholders.jobTitle')}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">
                        {t('email')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => updateData('email', e.target.value)}
                        placeholder={t('placeholders.email')}
                        required
                        className={hasError('email') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {hasError('email') && (
                        <p className="text-sm text-red-500">{getFieldError('email')}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">
                        {t('phone')} <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="phone"
                        value={data.phone}
                        onChange={(e) => updateData('phone', e.target.value)}
                        placeholder={t('placeholders.phone')}
                        required
                        className={hasError('phone') ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {hasError('phone') && (
                        <p className="text-sm text-red-500">{getFieldError('phone')}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">{t('location')}</Label>
                    <Input
                        id="location"
                        value={data.location || ''}
                        onChange={(e) => updateData('location', e.target.value)}
                        placeholder={t('placeholders.location')}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="linkedin">{t('linkedin')}</Label>
                    <Input
                        id="linkedin"
                        value={data.linkedin_url || ''}
                        onChange={(e) => updateData('linkedin_url', e.target.value)}
                        placeholder={t('placeholders.linkedin')}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="github">{t('github')}</Label>
                    <Input
                        id="github"
                        value={data.github_url || ''}
                        onChange={(e) => updateData('github_url', e.target.value)}
                        placeholder={t('placeholders.github')}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="portfolio">{t('portfolio')}</Label>
                    <Input
                        id="portfolio"
                        value={data.portfolio_url || ''}
                        onChange={(e) => updateData('portfolio_url', e.target.value)}
                        placeholder={t('placeholders.portfolio')}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="summary">{t('summary')}</Label>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleGenerateSummary}
                        disabled={isGenerating}
                        className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                            <Sparkles className="w-3 h-3 mr-1" />
                        )}
                        {isGenerating ? t('generating') : t('generate_summary')}
                    </Button>
                </div>
                <Textarea
                    id="summary"
                    value={data.summary || ''}
                    onChange={(e) => updateData('summary', e.target.value)}
                    placeholder={t('placeholders.summary')}
                    className="h-32"
                    disabled={isGenerating}
                />
            </div>
        </div>
    );
};


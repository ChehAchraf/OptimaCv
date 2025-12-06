'use client';

import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CVFullProfile } from '@/types/cv-builder';

interface DataQualityIndicatorProps {
    data: CVFullProfile;
    className?: string;
}

export function DataQualityIndicator({ data, className }: DataQualityIndicatorProps) {
    const score = useMemo(() => {
        let s = 0;
        // Personal Info: 20 pts
        if (data.personal_details.full_name && data.personal_details.email && data.personal_details.phone) s += 20;

        // Summary: 10 pts
        if (data.personal_details.summary && data.personal_details.summary.length > 50) s += 10;

        // Experience: 30 pts (15 per exp, max 30)
        if (data.experience.length > 0) s += Math.min(data.experience.length * 15, 30);

        // Education: 20 pts
        if (data.education.length > 0) s += 20;

        // Skills: 10 pts
        if (data.skills.length > 0) s += 10;

        // Projects: 10 pts
        if (data.projects.length > 0) s += 10;

        return Math.min(s, 100);
    }, [data]);

    const getScoreColor = (score: number) => {
        if (score < 40) return "bg-red-500";
        if (score < 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CV Strength</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{score}%</span>
                    <span className="text-xs text-muted-foreground">
                        {score < 40 ? "Weak" : score < 70 ? "Good" : "Excellent"}
                    </span>
                </div>
                <Progress value={score} className={`h-2 ${getScoreColor(score)}`} />
            </CardContent>
        </Card>
    );
}

'use client';

import { StatsCardProps } from '@/types/dashboard';
import { LucideIcon } from 'lucide-react';



export function StatsCard({ title, value, icon: Icon, loading }: Omit<StatsCardProps, 'color'>) {
    if (loading) {
        return (
            <div className="bg-card rounded-xl p-6 border border-border animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-3 flex-1">
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                        <div className="h-8 bg-muted rounded w-1/2"></div>
                    </div>
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
                </div>
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-foreground" aria-hidden="true" />
                </div>
            </div>
        </div>
    );
}

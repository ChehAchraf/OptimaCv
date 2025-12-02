'use client';

import { StatsCardProps } from '@/types/dashboard';
import { LucideIcon } from 'lucide-react';



export function StatsCard({ title, value, icon: Icon, loading }: Omit<StatsCardProps, 'color'>) {
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-3 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-gray-900 dark:text-white" />
                </div>
            </div>
        </div>
    );
}

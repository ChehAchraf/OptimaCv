import { FeatureCard, IFeatures, StatCard } from "@/types/type";
import {
    Filter,
    TrendingUp,
    Zap,
    DollarSign,
    Clock,
    Users,
    Target,
    BarChart3,
    Sparkles,
    Shield,
    Star
} from "lucide-react";

export const benefits: FeatureCard[] = [
    {
        icon: Zap,
        title: 'benefits.instantAnalysis.title',
        description: 'benefits.instantAnalysis.description',
        stat: 'benefits.instantAnalysis.stat',
        color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
        icon: Filter,
        title: 'benefits.oneClickFiltering.title',
        description: 'benefits.oneClickFiltering.description',
        stat: 'benefits.oneClickFiltering.stat',
        color: 'text-blue-600 dark:text-blue-400',
    },
    {
        icon: TrendingUp,
        title: 'benefits.maxPrecision.title',
        description: 'benefits.maxPrecision.description',
        stat: 'benefits.maxPrecision.stat',
        color: 'text-green-600 dark:text-green-400',
    },
    {
        icon: DollarSign,
        title: 'benefits.guaranteedROI.title',
        description: 'benefits.guaranteedROI.description',
        stat: 'benefits.guaranteedROI.stat',
        color: 'text-emerald-600 dark:text-emerald-400',
    },
];


export const stats: StatCard[] = [
    {
        value: '95%',
        label: 'stats.success.label',
        icon: TrendingUp,
        progress: 95,
        description: 'stats.success.description'
    },
    {
        value: '10K+',
        label: 'stats.optimized.label',
        icon: Users,
        progress: 100,
        description: 'stats.optimized.description'
    },
    {
        value: '4.9/5',
        label: 'stats.satisfaction.label',
        icon: Star,
        progress: 98,
        description: 'stats.satisfaction.description'
    },
];


export const metrics: StatCard[] = [
    {
        value: '5 min',
        label: 'metrics.analysisTime.label',
        icon: Clock,
        description: 'metrics.analysisTime.description'
    },
    {
        value: '10K+',
        label: 'metrics.cvsProcessed.label',
        icon: Users,
        description: 'metrics.cvsProcessed.description'
    },
    {
        value: '95%',
        label: 'metrics.accuracyRate.label',
        icon: Target,
        description: 'metrics.accuracyRate.description'
    },
    {
        value: '70%',
        label: 'metrics.costReduction.label',
        icon: DollarSign,
        description: 'metrics.costReduction.description'
    },
];

export const features: IFeatures[] = [
    {
        title: 'features.ranking.title',
        description: 'features.ranking.description',
        icon: BarChart3,
    },
    {
        title: 'features.analysis.title',
        description: 'features.analysis.description',
        icon: Sparkles,
    },
    {
        title: 'features.reports.title',
        description: 'features.reports.description',
        icon: Shield,
    },
];

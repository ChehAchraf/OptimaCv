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
        title: 'Analyse instantanée',
        description: 'Traitez des centaines de CVs en secondes, pas en heures',
        stat: '90% plus rapide',
        color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
        icon: Filter,
        title: 'Filtrage en un clic',
        description: 'Trouvez le candidat idéal instantanément avec notre IA avancée',
        stat: '1 clic = résultats',
        color: 'text-blue-600 dark:text-blue-400',
    },
    {
        icon: TrendingUp,
        title: 'Précision maximale',
        description: 'Notre IA analyse 50+ critères pour un matching parfait',
        stat: '95% de précision',
        color: 'text-green-600 dark:text-green-400',
    },
    {
        icon: DollarSign,
        title: 'ROI garanti',
        description: 'Réduisez vos coûts de recrutement de 70%',
        stat: '70% d\'économies',
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
        label: 'Temps moyen d\'analyse',
        icon: Clock,
        description: 'vs 2 heures manuellement'
    },
    {
        value: '10K+',
        label: 'CVs traités',
        icon: Users,
        description: 'par nos clients entreprises'
    },
    {
        value: '95%',
        label: 'Taux de précision',
        icon: Target,
        description: 'dans le matching candidat-poste'
    },
    {
        value: '70%',
        label: 'Réduction des coûts',
        icon: DollarSign,
        description: 'de recrutement en moyenne'
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

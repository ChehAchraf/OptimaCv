'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    User,
    Mail,
    Calendar,
    CreditCard,
    TrendingUp,
    CheckCircle2,
    Clock,
    Loader2,
    Crown,
    Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ProfileData } from '@/types/user';
import { DashboardLayout } from '@/components/dashboard';



export default function ProfilePage() {
    const t = useTranslations('ProfilePage');
    const router = useRouter();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/user/profile');
            const data = await response.json();

            if (!data.success) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error(data.error || t('error'));
            }

            setProfileData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-900 dark:text-white" />
                    <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
                </div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black py-12 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <p className="text-gray-900 dark:text-white mb-4">{error || t('error')}</p>
                    <Button onClick={fetchProfile}>{t('tryAgain')}</Button>
                </div>
            </div>
        );
    }

    const { user, usage } = profileData;
    const usagePercentage = usage.analysesLimit
        ? (usage.analysesUsed / usage.analysesLimit) * 100
        : 0;

    return (
        <DashboardLayout>
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-6xl mx-auto space-y-6">
                    <div className="text-center space-y-2 mb-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            {t('title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="shadow-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800">
                                <CardHeader className="text-center pb-4">
                                    <Avatar className="h-24 w-24 mx-auto mb-4">
                                        <AvatarFallback className=" text-white text-2xl font-bold">
                                            {user.email.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <CardTitle className="text-xl">
                                        {user.metadata?.name || 'User'}
                                    </CardTitle>
                                    <CardDescription className="flex items-center justify-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">{t('memberSince')}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">{t('userId')}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                                {user.id.substring(0, 12)}...
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="shadow-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg">{t('quickActions')}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Link href="/CV_analyze" className="block">
                                        <Button className="w-full" variant="default">
                                            <Zap className="h-4 w-4 mr-2" />
                                            {t('analyzeCv')}
                                        </Button>
                                    </Link>
                                    <Link href="/pricing" className="block">
                                        <Button className="w-full" variant="outline">
                                            <Crown className="h-4 w-4 mr-2" />
                                            {t('viewPlans')}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <Card className="shadow-xl border-0">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl flex items-center gap-2">
                                                <CreditCard className="h-6 w-6 text-gray-900 dark:text-white" />
                                                {t('currentPlan')}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {t('planDetails')}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            className={`text-sm px-4 py-2 ${usage.isFreeUser
                                                ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                : usage.planName === 'Enterprise'
                                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                                                    : usage.planName === 'VIP'
                                                        ? 'bg-gray-700 text-white dark:bg-gray-300 dark:text-gray-900'
                                                        : 'bg-gray-500 text-white'
                                                }`}
                                        >
                                            {usage.planName}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('price')}</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {usage.planPrice === 0 ? t('free') : `$${usage.planPrice}${t('perMonth')}`}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('status')}</p>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-gray-900 dark:text-white" />
                                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {usage.hasActivePlan ? t('active') : t('freeTrial')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {usage.hasActivePlan && usage.planEndDate && (
                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="h-5 w-5 text-gray-500" />
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    {t('subscriptionPeriod')}
                                                </p>
                                            </div>
                                            <p className="text-sm">
                                                <span className="font-semibold">{t('ends')}</span>{' '}
                                                {new Date(usage.planEndDate).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}

                                    {!usage.hasActivePlan && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                                                {t.rich('upgradePrompt', { strong: (chunks) => <strong>{chunks}</strong> })}
                                            </p>
                                            <Link href="/pricing">
                                                <Button className="w-full">
                                                    {t('upgradeNow')}
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="shadow-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-6 w-6 text-gray-900 dark:text-white" />
                                        <CardTitle className="text-2xl">{t('usageStats')}</CardTitle>
                                    </div>
                                    <CardDescription>
                                        {t('trackUsage')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    {usage.hasActivePlan ? t('analysesThisMonth') : t('analysesThisTrial')}
                                                </p>
                                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                                    {usage.analysesUsed}
                                                    <span className="text-lg text-gray-500 dark:text-gray-400">
                                                        {' / '}
                                                        {usage.analysesLimit === null ? '∞' : usage.analysesLimit}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                    {t('remaining')}
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                                    {usage.analysesRemaining === null ? '∞' : usage.analysesRemaining}
                                                </p>
                                            </div>
                                        </div>

                                        {usage.analysesLimit !== null && (
                                            <div className="space-y-2">
                                                <Progress
                                                    value={usagePercentage}
                                                    className={`h-3 ${usagePercentage >= 90 ? 'bg-gray-300 dark:bg-gray-600' :
                                                        usagePercentage >= 70 ? 'bg-gray-200 dark:bg-gray-700' :
                                                            'bg-gray-100 dark:bg-gray-800'
                                                        }`}
                                                />
                                                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                                                    {usagePercentage.toFixed(1)}% {t('used')}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {usage.analysesRemaining !== null && usage.analysesRemaining <= 2 && usage.analysesRemaining > 0 && (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                                {t.rich('warningRemaining', { count: usage.analysesRemaining, s: usage.analysesRemaining !== 1 ? 'es' : '', strong: (chunks) => <strong>{chunks}</strong> })}
                                                {!usage.hasActivePlan && t('considerUpgrading')}
                                            </p>
                                        </div>
                                    )}

                                    {usage.analysesRemaining === 0 && (
                                        <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
                                            <p className="text-sm text-gray-900 dark:text-white mb-3">
                                                {t('limitReached')}
                                                {usage.hasActivePlan
                                                    ? t('limitReset')
                                                    : t('upgradeToContinue')}
                                            </p>
                                            {!usage.hasActivePlan && (
                                                <Link href="/pricing">
                                                    <Button variant="destructive" className="w-full">
                                                        {t('upgradeNow')}
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>

    );
}

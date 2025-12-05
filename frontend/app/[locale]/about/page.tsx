'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { CardLoader } from '@/components/loading';

// Lazy load all components for the About page
const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card), {
    loading: () => <CardLoader />,
});
const CardContent = dynamic(() => import('@/components/ui/card').then(mod => mod.CardContent));
const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => mod.CardHeader));
const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => mod.CardTitle));
const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button));
const Link = dynamic(() => import('@/i18n/routing').then(mod => mod.Link));

const Icons = dynamic(() => import('lucide-react').then(mod => ({
    default: () => null,
    CheckCircle2: mod.CheckCircle2,
    Lightbulb: mod.Lightbulb,
    Users: mod.Users,
    Award: mod.Award,
})), { ssr: false });

export default function AboutPage() {
    const t = useTranslations('AboutPage');

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">

            <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        {t('hero.title')}
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        {t('hero.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                <Suspense fallback={<CardLoader />}>
                    <div className="mb-16">
                        <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent dark:bg-gray-900/50">
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">{t('story.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center max-w-4xl mx-auto">
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {t('story.description')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </Suspense>


                <Suspense fallback={<CardLoader />}>
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">{t('values.title')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <ValueCard
                                icon="Lightbulb"
                                title={t('values.innovation')}
                                iconColor="blue"
                            />
                            <ValueCard
                                icon="Users"
                                title={t('values.accessibility')}
                                iconColor="green"
                            />
                            <ValueCard
                                icon="Award"
                                title={t('values.professionalism')}
                                iconColor="purple"
                            />
                        </div>
                    </div>
                </Suspense>

                <Suspense fallback={<CardLoader />}>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            {t('cta.title')}
                        </h2>
                        <Link href="/build-cv">
                            <Button size="lg" className="text-lg px-8 py-6">
                                {t('cta.button')}
                            </Button>
                        </Link>
                    </div>
                </Suspense>
            </div>
        </div>
    );
}

function ValueCard({ icon, title, iconColor }: { icon: string; title: string; iconColor: string }) {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
        green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    };

    const IconComponent = dynamic(() => import('lucide-react').then(mod => {
        if (icon === 'Lightbulb') return { default: mod.Lightbulb };
        if (icon === 'Users') return { default: mod.Users };
        if (icon === 'Award') return { default: mod.Award };
        return { default: () => null };
    }), { ssr: false });

    return (
        <Card className="hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className={`p-3 ${colorClasses[iconColor as keyof typeof colorClasses]} rounded-full mb-4`}>
                    <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
            </CardContent>
        </Card>
    );
}

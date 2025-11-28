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

// Lazy load icons
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
        <div className="min-h-screen bg-gray-50/50">

            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        {t('hero.title')}
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        {t('hero.subtitle')}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                <Suspense fallback={<CardLoader />}>
                    <div className="mb-16">
                        <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-transparent">
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold text-center mb-4">{t('story.title')}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center max-w-4xl mx-auto">
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    {t('story.description')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </Suspense>


                <Suspense fallback={<CardLoader />}>
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center mb-10">{t('values.title')}</h2>
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">
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

// Value card component
function ValueCard({ icon, title, iconColor }: { icon: string; title: string; iconColor: string }) {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    const IconComponent = dynamic(() => import('lucide-react').then(mod => {
        if (icon === 'Lightbulb') return { default: mod.Lightbulb };
        if (icon === 'Users') return { default: mod.Users };
        if (icon === 'Award') return { default: mod.Award };
        return { default: () => null };
    }), { ssr: false });

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className={`p-3 ${colorClasses[iconColor as keyof typeof colorClasses]} rounded-full mb-4`}>
                    <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
            </CardContent>
        </Card>
    );
}

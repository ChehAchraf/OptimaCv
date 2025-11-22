'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { CheckCircle2, Lightbulb, Users, Award } from 'lucide-react';

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

                
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-center mb-10">{t('values.title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <div className="p-3 bg-blue-100 rounded-full mb-4">
                                    <Lightbulb className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t('values.innovation')}</h3>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <div className="p-3 bg-green-100 rounded-full mb-4">
                                    <Users className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t('values.accessibility')}</h3>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <div className="p-3 bg-purple-100 rounded-full mb-4">
                                    <Award className="h-8 w-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{t('values.professionalism')}</h3>
                            </CardContent>
                        </Card>
                    </div>
                </div>

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
            </div>
        </div>
    );
}

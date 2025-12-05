'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2 } from 'lucide-react';
import { IFeatures } from '@/types/type';
import { useTranslations } from 'next-intl';

interface CompanyFeaturesTabsProps {
    features: IFeatures[];
}

const TAB_VALUES = ['ranking', 'analysis', 'reports'] as const;
const TAB_FEATURES = ['complete', 'bulk', 'instant'] as const;

/**
 * Company Features Tabs Section
 * Interactive tabs showing different feature categories
 */
export default function CompanyFeaturesTabs({ features }: CompanyFeaturesTabsProps) {
    const t = useTranslations('CompanySection');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
        >
            <div className="text-center mb-10">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {t('whyChooseTitle')}
                </h3>
                <p className="text-lg text-muted-foreground">
                    {t('whyChooseSubtitle')}
                </p>
            </div>

            <Tabs defaultValue="ranking" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    {TAB_VALUES.map((tab) => (
                        <TabsTrigger key={tab} value={tab} className="text-sm md:text-base">
                            {t(`tabs.${tab}`)}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const tabValue = TAB_VALUES[index];

                    return (
                        <TabsContent key={tabValue} value={tabValue}>
                            <Card className="border-2">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-gray-900 dark:bg-gray-100 rounded-xl">
                                            <Icon className="h-6 w-6 text-white dark:text-gray-900" />
                                        </div>
                                        <CardTitle className="text-2xl font-bold">
                                            {t(feature.title)}
                                        </CardTitle>
                                    </div>

                                    <CardDescription className="text-lg">
                                        {t(feature.description)}
                                    </CardDescription>

                                    <Separator className="my-6" />

                                    <div className="grid md:grid-cols-3 gap-4">
                                        {TAB_FEATURES.map((item) => (
                                            <div key={item} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                <span className="text-sm text-muted-foreground">
                                                    {t(`tabsFeatures.${item}`)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </motion.div>
    );
}

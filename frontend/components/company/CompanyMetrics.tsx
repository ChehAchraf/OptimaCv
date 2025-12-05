'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/types/type';
import { useTranslations } from 'next-intl';

interface CompanyMetricsProps {
    metrics: StatCard[];
}

/**
 * Company Metrics Section
 * Displays key performance metrics in a dark themed card
 */
export default function CompanyMetrics({ metrics }: CompanyMetricsProps) {
    const t = useTranslations('CompanySection');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-16"
        >
            <Card className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-0 shadow-2xl">
                <CardHeader className="text-center pb-8">
                    <CardTitle className="text-3xl font-bold mb-2">
                        {t('metricsTitle')}
                    </CardTitle>
                    <CardDescription className="text-gray-300 dark:text-gray-700 text-lg">
                        {t('metricsSubtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-4 gap-6">
                        {metrics.map((metric, index) => {
                            const Icon = metric.icon;
                            return (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                                    className="text-center"
                                >
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-white/10 dark:bg-gray-900/10 rounded-xl">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="text-4xl font-bold mb-2">{metric.value}</div>
                                    <div className="text-sm font-semibold mb-1">{t(metric.label as any)}</div>
                                    <div className="text-xs opacity-80">{t(metric.description as any)}</div>
                                </motion.div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { FeatureCard as FeatureCardType } from '@/types/type';
import { useTranslations } from 'next-intl';

interface CompanyBenefitsProps {
    benefits: FeatureCardType[];
}

/**
 * Company Benefits Section
 * Displays a grid of benefit cards with icons and stats
 */
export default function CompanyBenefits({ benefits }: CompanyBenefitsProps) {
    const t = useTranslations('CompanySection');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
            {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                    <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                        <Card className="h-full border-2 hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-300 hover:shadow-xl">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                                        <Icon className={`h-6 w-6 ${benefit.color}`} />
                                    </div>
                                    <Badge variant="outline" className="text-xs font-semibold">
                                        {t(benefit.stat as any)}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-bold mb-2">
                                    {t(benefit.title as any)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {t(benefit.description as any)}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}

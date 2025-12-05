'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Filter, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const FEATURE_KEYS = ['autoAnalysis', 'smartRanking', 'detailedReports', 'timeSaving'] as const;

/**
 * Company Feature Card
 * Main feature showcase with animation and visual demo
 */
export default function CompanyFeatureCard() {
    const t = useTranslations('CompanySection');

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
        >
            <Card className="border-2 border-gray-900 dark:border-gray-100 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black shadow-2xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                    {/* Content Side */}
                    <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gray-900 dark:bg-gray-100 rounded-xl">
                                <Filter className="h-8 w-8 text-white dark:text-gray-900" />
                            </div>
                            <Badge className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-1 text-sm font-bold">
                                {t('featureCard.badge')}
                            </Badge>
                        </div>

                        <CardTitle className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                            {t.rich('featureCard.title', {
                                highlight: (chunks) => (
                                    <span className="text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                                        {chunks}
                                    </span>
                                )
                            })}
                        </CardTitle>

                        <CardDescription className="text-lg mb-6">
                            {t('featureCard.description')}
                        </CardDescription>

                        <div className="space-y-4">
                            {FEATURE_KEYS.map((feature, index) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                        {t(`featureCard.features.${feature}`)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <Button
                                size="lg"
                                asChild
                                className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 font-semibold text-lg px-8 py-6 rounded-xl shadow-xl group"
                            >
                                <Link href="/entreprise">
                                    {t('featureCard.cta')}
                                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>

                    {/* Visual Demo Side */}
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 lg:p-12 flex items-center justify-center">
                        <FeatureVisualDemo />
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

/**
 * Animated visual demonstration for the feature card
 */
function FeatureVisualDemo() {
    return (
        <div className="relative w-full max-w-md">
            {/* Main floating card */}
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-0 left-1/2 -translate-x-1/2 z-10"
            >
                <Card className="bg-white dark:bg-gray-900 shadow-xl border-2 border-gray-900 dark:border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                        <Filter className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                        <span className="font-bold text-gray-900 dark:text-white">1 CLIC</span>
                    </div>
                </Card>
            </motion.div>

            {/* Floating CV cards */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                        delay: 0.6 + i * 0.2,
                        duration: 2 + i * 0.3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    className="absolute"
                    style={{
                        left: `${20 + i * 30}%`,
                        top: `${40 + i * 15}%`,
                    }}
                >
                    <Card className="bg-white dark:bg-gray-900 shadow-lg border p-3 w-24">
                        <div className="space-y-2">
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <Badge className={`text-xs ${i === 0
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                                }`}>
                                #{i + 1}
                            </Badge>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

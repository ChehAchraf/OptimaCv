'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

/**
 * Company CTA Section
 * Final call-to-action with gradient background
 */
export default function CompanyCTA() {
    const t = useTranslations('CompanySection');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center"
        >
            <Card className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900 border-0 shadow-2xl">
                <CardContent className="p-12">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4">
                        {t('ctaTitle')}
                    </h3>
                    <p className="text-xl mb-8 opacity-90">
                        {t('ctaSubtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            asChild
                            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-lg px-8 py-6 rounded-xl shadow-xl"
                        >
                            <Link href="/entreprise">
                                {t('ctaButtons.startTrial')}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-2 border-white/30 dark:border-gray-700 text-white dark:text-gray-900 bg-transparent hover:bg-white/10 dark:hover:bg-gray-800/50 font-semibold text-lg px-8 py-6 rounded-xl"
                        >
                            {t('ctaButtons.requestDemo')}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

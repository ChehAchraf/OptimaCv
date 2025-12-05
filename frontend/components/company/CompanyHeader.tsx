'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Company Section Header
 * Displays the main title and badge for the company section
 */
export default function CompanyHeader() {
    const t = useTranslations('CompanySection');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
        >
            <Badge
                variant="outline"
                className="mb-6 text-sm font-semibold text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2"
            >
                <Shield className="mr-2 h-4 w-4" />
                {t('badge')}
            </Badge>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                {t.rich('title', {
                    span: (chunks) => (
                        <span className="relative inline-block">
                            <span className="relative z-10">{chunks}</span>
                            <motion.span
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="absolute bottom-2 left-0 right-0 h-4 bg-gray-300 dark:bg-gray-700 -z-0 opacity-40"
                            />
                        </span>
                    ),
                    highlight: (chunks) => (
                        <span className="text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                            {chunks}
                        </span>
                    )
                })}
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t.rich('subtitle', {
                    strong: (chunks) => <strong className="text-gray-900 dark:text-white">{chunks}</strong>
                })}
            </p>
        </motion.div>
    );
}

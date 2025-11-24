'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowRight,
  Filter,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { benefits, metrics, features } from '@/config/company';
import { useTranslations } from 'next-intl';

const CompanySection = () => {
  const t = useTranslations('CompanySection');
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-950 dark:to-black overflow-hidden">
      { }
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-200 dark:bg-gray-900 rounded-full blur-3xl opacity-10" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 dark:bg-gray-900 rounded-full blur-3xl opacity-10" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        { }
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

        { }
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="border-2 border-gray-900 dark:border-gray-100 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
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
                  {[
                    'autoAnalysis',
                    'smartRanking',
                    'detailedReports',
                    'timeSaving',
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{t(`featureCard.features.${feature}`)}</span>
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
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 lg:p-12 flex items-center justify-center">
                { }
                <div className="relative w-full max-w-md">
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

                  { }
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ delay: 0.6 + i * 0.2, duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
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
                          <Badge className={`text-xs ${i === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'}`}>
                            #{i + 1}
                          </Badge>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        { }
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
                      <div className={`p-3 bg-gray-100 dark:bg-gray-800 rounded-xl`}>
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

        { }
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

        { }
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
              <TabsTrigger value="ranking" className="text-sm md:text-base">
                {t('tabs.ranking')}
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-sm md:text-base">
                {t('tabs.analysis')}
              </TabsTrigger>
              <TabsTrigger value="reports" className="text-sm md:text-base">
                {t('tabs.reports')}
              </TabsTrigger>
            </TabsList>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const tabValue = ['ranking', 'analysis', 'reports'][index];
              return (
                <TabsContent key={tabValue} value={tabValue}>
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gray-900 dark:bg-gray-100 rounded-xl">
                          <Icon className="h-6 w-6 text-white dark:text-gray-900" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                          {t(feature.title)}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-lg">
                        {t(feature.description)}
                      </CardDescription>
                      <Separator className="my-6" />
                      <div className="grid md:grid-cols-3 gap-4">
                        {[
                          'complete',
                          'bulk',
                          'instant',
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-sm text-muted-foreground">{t(`tabsFeatures.${item}`)}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
        </motion.div>

        { }
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
      </div>
    </section>
  );
};

export default CompanySection;



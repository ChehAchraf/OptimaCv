'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, CheckCircle2, TrendingUp, Users, Award, Star, Zap, Target } from 'lucide-react';
import { features, stats } from '@/config/company';



import { useTranslations } from 'next-intl';

const TrustSection = () => {
  const t = useTranslations('TrustSection');

  return (
    <section className="relative py-24 lg:py-32 bg-linear-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-black dark:to-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gray-200 dark:bg-gray-900 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-200 dark:bg-gray-900 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99] }}
            className="space-y-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                variant="outline"
                className="mb-6 text-sm font-semibold text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-2"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('badge')}
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight"
            >
              {t.rich('title', {
                span: (chunks) => (
                  <span className="relative inline-block">
                    <span className="relative z-10">{chunks}</span>
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                      className="absolute bottom-2 left-0 right-0 h-4 bg-gray-300 dark:bg-gray-700 z-0 opacity-40"
                    />
                  </span>
                )
              })}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
            >
              {t('description')}
            </motion.p>

            <Separator className="my-8" />

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-6"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1, type: 'spring' }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <Card className="border-2 hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-900 dark:bg-gray-100 rounded-xl">
                              <Icon className="h-6 w-6 text-white dark:text-gray-900" />
                            </div>
                            <div>
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stat.value}
                              </div>
                              <div className="text-sm font-medium text-muted-foreground">
                                {t(stat.label)}
                              </div>
                            </div>
                          </div>
                        </div>
                        {stat.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {t(stat.description)}
                          </p>
                        )}
                        <Progress
                          value={stat.progress}
                          className="h-2"
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="h-full border hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-300">
                      <CardContent className="p-4 text-center">
                        <div className="flex justify-center mb-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <Icon className="h-5 w-5 text-gray-900 dark:text-white" />
                          </div>
                        </div>
                        <CardTitle className="text-sm font-semibold mb-1">
                          {t(feature.title)}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {t(feature.description)}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.8 }}
              className="pt-6"
            >
              <Button
                size="lg"
                asChild
                className="group bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg px-8 py-6 rounded-xl shadow-xl w-full sm:w-auto"
              >
                <a href="#analyze">
                  {t('cta')}
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="inline-block ml-2"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative h-[600px] lg:h-[700px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/we-well-help-you.svg"
                alt="Happy professionals at a successful job meeting"
                fill
                className="object-cover"
                priority
                quality={90}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-gray-900/20 via-transparent to-transparent" />

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-8 left-8 right-8"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border shadow-xl">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-lg">
                          <Award className="h-5 w-5 text-white dark:text-gray-900" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold">
                            {t('floatingCard.title')}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {t('floatingCard.description')}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { 
  HiDocumentArrowUp, 
  HiClipboardDocumentList, 
  HiPhoto, 
  HiSparkles
} from 'react-icons/hi2';

const steps = [
  {
    number: 1,
    title: 'Téléchargez votre CV',
    description: 'Uploadez votre CV au format PDF. Notre système le parse automatiquement pour extraire toutes les informations pertinentes.',
    icon: HiDocumentArrowUp,
    iconBg: 'bg-gray-900 dark:bg-gray-100',
    iconColor: 'text-white dark:text-gray-900',
    delay: 0.1,
  },
  {
    number: 2,
    title: 'Collez la description de poste',
    description: 'Copiez et collez la description complète du poste que vous visez. Notre IA va comparer votre CV avec ces exigences.',
    icon: HiClipboardDocumentList,
    iconBg: 'bg-gray-800 dark:bg-gray-200',
    iconColor: 'text-white dark:text-gray-900',
    delay: 0.2,
  },
  {
    number: 3,
    title: 'Analyse visuelle (optionnel)',
    description: 'Pour une analyse complète, téléchargez une image de votre CV. Nous analyserons le design, la mise en page et le professionnalisme visuel.',
    icon: HiPhoto,
    iconBg: 'bg-gray-700 dark:bg-gray-300',
    iconColor: 'text-white dark:text-gray-900',
    delay: 0.3,
  },
  {
    number: 4,
    title: 'Obtenez vos résultats',
    description: 'Recevez un rapport détaillé avec votre score de correspondance, vos points forts, vos points à améliorer et des suggestions concrètes.',
    icon: HiSparkles,
    iconBg: 'bg-gray-900 dark:bg-gray-100',
    iconColor: 'text-white dark:text-gray-900',
    delay: 0.4,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 100,
      duration: 0.6,
    },
  },
};

const ProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-black dark:to-gray-950">
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-200 dark:bg-gray-900 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-200 dark:bg-gray-900 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 text-sm font-semibold text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-1.5">
              Comment ça marche
            </Badge>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Un processus{' '}
            <span className="relative inline-block">
              <span className="relative z-10">simple</span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 -z-0 opacity-40"
              />
            </span>{' '}
            et efficace
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            En quelques étapes simples, obtenez une analyse complète de votre CV et optimisez vos chances de décrocher l'emploi de vos rêves.
          </motion.p>
        </motion.div>

        {}
        <div ref={ref}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 relative"
          >
            {}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
            
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div key={step.number} className="relative">
                  {}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 z-0">
                      <motion.div
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.8, delay: step.delay + 0.4, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800"
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: step.delay + 0.8, type: "spring", stiffness: 200 }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                      >
                        <div className="bg-white dark:bg-gray-950 rounded-full p-1 shadow-lg border border-gray-200 dark:border-gray-800">
                          <ArrowRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                      </motion.div>
                    </div>
                  )}

                  <motion.div variants={itemVariants}>
                    <motion.div
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="h-full"
                    >
                      <Card className="h-full relative overflow-hidden border-2 border-gray-200/80 dark:border-gray-800/80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-500 hover:shadow-2xl group">
                        {}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-gray-900/5 via-gray-800/5 to-gray-900/5 dark:from-gray-100/5 dark:via-gray-200/5 dark:to-gray-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        
                        {}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-100 to-transparent dark:from-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-full" />
                        
                        {}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-900/20 via-gray-800/20 to-gray-900/20 dark:from-gray-100/20 dark:via-gray-200/20 dark:to-gray-100/20 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
                        
                        <CardHeader className="relative p-6 pb-4">
                          {}
                          <div className="flex items-start justify-between mb-6">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                            >
                              <div className="relative">
                                <Badge 
                                  className={`${step.iconBg} ${step.iconColor} border-0 w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-xl relative overflow-hidden`}
                                >
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"
                                    animate={{
                                      opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: 'easeInOut',
                                    }}
                                  />
                                  <span className="relative z-10">{step.number}</span>
                                </Badge>
                                <motion.div
                                  className={`absolute inset-0 ${step.iconBg} rounded-2xl blur-lg opacity-30`}
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.5, 0.3],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                  }}
                                />
                              </div>
                            </motion.div>
                            
                            {}
                            <motion.div
                              whileHover={{ scale: 1.15, rotate: 10 }}
                              transition={{ type: 'spring', stiffness: 400 }}
                              className="relative"
                            >
                              <div className={`p-4 ${step.iconBg} rounded-2xl shadow-xl relative overflow-hidden group/icon`}>
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300"
                                />
                                <Icon className={`h-7 w-7 ${step.iconColor} relative z-10`} />
                                <motion.div
                                  className={`absolute -inset-1 ${step.iconBg} rounded-2xl blur-md opacity-0 group-hover/icon:opacity-50 transition-opacity duration-300`}
                                />
                              </div>
                            </motion.div>
                          </div>
                          
                          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                            {step.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="relative p-6 pt-0">
                          <CardDescription className="text-base leading-relaxed text-muted-foreground">
                            {step.description}
                          </CardDescription>
                          
                          {}
                          <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: step.delay + 0.5 }}
                            className="mt-6 h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
                          >
                            <motion.div
                              className={`h-full ${step.iconBg} rounded-full`}
                              initial={{ width: 0 }}
                              whileInView={{ width: '100%' }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: step.delay + 0.7 }}
                            />
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            Prêt à optimiser votre CV ?
          </motion.p>
          <motion.a
            href="#analyze"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10 text-lg">Commencer maintenant</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="h-5 w-5 relative z-10" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;

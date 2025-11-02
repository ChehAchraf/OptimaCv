'use client';

import HeroSection from '@/components/HeroSection';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { HiDocumentText, HiBriefcase, HiSquare3Stack3D, HiChartBar } from 'react-icons/hi2';

export default function Home() {
  const features = [
    {
      icon: HiChartBar,
      title: "Analyse Intelligente de CV",
      description: "Analysez votre CV contre des descriptions de poste avec l'IA pour obtenir un score de correspondance précis.",
      href: "/analyzer",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: HiBriefcase,
      title: "Offres d'Emploi",
      description: "Découvrez des offres d'emploi avec les compétences requises, responsabilités et mots-clés.",
      href: "/offers",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: HiSquare3Stack3D,
      title: "Créateur de CV",
      description: "Créez un CV professionnel basé sur des templates et adaptez-le aux offres d'emploi.",
      href: "/cv-builder",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: HiDocumentText,
      title: "Templates Professionnels",
      description: "Choisissez parmi une variété de templates modernes et professionnels.",
      href: "/templates",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <>
      <HeroSection />

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Optimisez votre Recherche d'Emploi
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Des outils intelligents pour analyser, créer et optimiser votre CV selon les standards du marché du travail moderne.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={feature.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 rounded-full ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 text-center">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Prêt à Optimiser votre CV ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Commencez dès maintenant avec notre analyseur intelligent ou créez un nouveau CV professionnel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/analyzer">
                <Button size="lg" className="w-full sm:w-auto">
                  Analyser mon CV
                </Button>
              </Link>
              <Link href="/cv-builder">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Créer un CV
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
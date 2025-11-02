'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  preview: string;
  features: string[];
  color: string;
  popular?: boolean;
}

const templates: Template[] = [
  {
    id: 1,
    name: "Moderne Professionnel",
    description: "Un design élégant et moderne parfait pour les secteurs tech et créatifs",
    category: "Moderne",
    preview: "🎨",
    features: ["Design épuré", "Couleurs modernes", "Mise en page flexible", "Compatible ATS"],
    color: "bg-blue-100 text-blue-700",
    popular: true
  },
  {
    id: 2,
    name: "Classique Corporate",
    description: "Template traditionnel idéal pour les secteurs corporate et finance",
    category: "Classique",
    preview: "📋",
    features: ["Style traditionnel", "Très lisible", "Format standard", "Sérieux et professionnel"],
    color: "bg-gray-100 text-gray-700"
  },
  {
    id: 3,
    name: "Créatif Designer",
    description: "Pour les métiers créatifs qui veulent se démarquer",
    category: "Créatif",
    preview: "🎭",
    features: ["Design original", "Couleurs vives", "Layout créatif", "Sections visuelles"],
    color: "bg-purple-100 text-purple-700"
  },
  {
    id: 4,
    name: "Minimaliste Clean",
    description: "Simplicité et élégance pour un impact maximum",
    category: "Minimaliste",
    preview: "⚪",
    features: ["Ultra épuré", "Beaucoup d'espace blanc", "Focus sur le contenu", "Très moderne"],
    color: "bg-green-100 text-green-700",
    popular: true
  },
  {
    id: 5,
    name: "Tech & Startups",
    description: "Parfait pour les développeurs et les startups tech",
    category: "Tech",
    preview: "💻",
    features: ["Icônes tech", "Sections pour projets", "Links GitHub/Portfolio", "Style startup"],
    color: "bg-indigo-100 text-indigo-700"
  },
  {
    id: 6,
    name: "Executive Senior",
    description: "Pour les postes de direction et les profils expérimentés",
    category: "Executive",
    preview: "👔",
    features: ["Très professionnel", "Mise en avant expérience", "Format premium", "Sections leadership"],
    color: "bg-slate-100 text-slate-700"
  }
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Templates Professionnels
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choisissez parmi notre collection de templates modernes et professionnels, 
              adaptés à tous les secteurs d'activité.
            </p>
          </div>

          {/* Filter categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {['Tous', 'Moderne', 'Classique', 'Créatif', 'Minimaliste', 'Tech', 'Executive'].map((category) => (
              <Badge 
                key={category} 
                variant={category === 'Tous' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-100"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 relative">
                  {template.popular && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-orange-500 text-white">
                        ⭐ Populaire
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    {/* Template Preview */}
                    <div className={`w-full h-48 rounded-lg ${template.color} flex items-center justify-center mb-4`}>
                      <div className="text-center">
                        <div className="text-6xl mb-2">{template.preview}</div>
                        <div className="text-sm opacity-75">Aperçu</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-bold">{template.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {template.description}
                      </p>
                      
                      {/* Features */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 text-sm">Caractéristiques :</h4>
                        <ul className="space-y-1">
                          {template.features.map((feature, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <span className="text-green-500 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        👁️ Aperçu complet
                      </Button>
                      <Link href={`/cv-builder?template=${template.id}`}>
                        <Button variant="outline" className="w-full" size="sm">
                          🚀 Utiliser ce template
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Vous ne trouvez pas ce que vous cherchez ?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Notre créateur de CV intelligent peut vous aider à personnaliser n'importe quel template 
                selon vos besoins spécifiques.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cv-builder">
                  <Button size="lg">
                    🎨 Créateur de CV personnalisé
                  </Button>
                </Link>
                <Link href="/analyzer">
                  <Button variant="outline" size="lg">
                    📊 Analyser un CV existant
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
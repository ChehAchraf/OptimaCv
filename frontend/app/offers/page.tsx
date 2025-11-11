'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { HiMapPin, HiClock, HiCurrencyDollar, HiMagnifyingGlass, HiBuildingOffice2 } from 'react-icons/hi2';

interface JobOffer {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requiredSkills: string[];
  responsibilities: string[];
  keywords: string[];
  posted: string;
}

const jobOffers: JobOffer[] = [
  {
    id: 1,
    title: "Développeur Full Stack React/Node.js",
    company: "TechCorp",
    location: "Paris, France",
    type: "CDI",
    salary: "45k - 65k €",
    description: "Nous recherchons un développeur full stack passionné pour rejoindre notre équipe dynamique et travailler sur des projets innovants.",
    requiredSkills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Git"],
    responsibilities: [
      "Développer des applications web modernes avec React",
      "Créer des APIs RESTful avec Node.js",
      "Optimiser les performances des applications",
      "Collaborer avec l'équipe UX/UI",
      "Maintenir et améliorer le code existant"
    ],
    keywords: ["développement", "full stack", "agile", "startup", "innovation"],
    posted: "Il y a 2 jours"
  },
  {
    id: 2,
    title: "Data Scientist Senior",
    company: "DataFlow Analytics",
    location: "Lyon, France",
    type: "CDI",
    salary: "55k - 75k €",
    description: "Rejoignez notre équipe data pour analyser et interpréter des données complexes dans le domaine de la finance.",
    requiredSkills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Pandas", "Jupyter"],
    responsibilities: [
      "Analyser de gros volumes de données",
      "Développer des modèles prédictifs",
      "Créer des visualisations de données",
      "Présenter les résultats aux parties prenantes",
      "Optimiser les algorithmes existants"
    ],
    keywords: ["données", "intelligence artificielle", "finance", "statistiques"],
    posted: "Il y a 1 jour"
  },
  {
    id: 3,
    title: "Designer UX/UI Senior",
    company: "CreativeStudio",
    location: "Toulouse, France",
    type: "CDI",
    salary: "40k - 55k €",
    description: "Nous cherchons un designer créatif pour concevoir des expériences utilisateur exceptionnelles.",
    requiredSkills: ["Figma", "Adobe Creative Suite", "Prototypage", "User Research", "Design System"],
    responsibilities: [
      "Concevoir des interfaces utilisateur intuitives",
      "Réaliser des tests d'utilisabilité",
      "Créer des prototypes interactifs",
      "Collaborer avec les équipes produit",
      "Maintenir le design system"
    ],
    keywords: ["design", "créativité", "expérience utilisateur", "interface"],
    posted: "Il y a 3 jours"
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Remote",
    type: "CDI",
    salary: "50k - 70k €",
    description: "Automatisez et optimisez notre infrastructure cloud dans un environnement de travail flexible.",
    requiredSkills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Monitoring"],
    responsibilities: [
      "Gérer l'infrastructure cloud",
      "Automatiser les déploiements",
      "Monitorer les performances",
      "Maintenir la sécurité des systèmes",
      "Former les équipes de développement"
    ],
    keywords: ["cloud", "automatisation", "infrastructure", "sécurité"],
    posted: "Il y a 5 jours"
  }
];

export default function OffersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);

  const filteredJobs = jobOffers.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    job.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Offres d'Emploi
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Découvrez des opportunités avec compétences requises, responsabilités et mots-clés détaillés
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher par poste, entreprise, compétence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer hover:shadow-lg transition-all duration-300 ${
                      selectedJob?.id === job.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold hover:text-blue-600">
                            {job.title}
                          </CardTitle>
                          <div className="flex items-center space-x-4 mt-2 text-gray-600 dark:text-gray-300">
                            <div className="flex items-center space-x-1">
                              <HiBuildingOffice2 className="h-4 w-4" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <HiMapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{job.type}</Badge>
                          <div className="flex items-center space-x-1 mt-2 text-green-600">
                            <HiCurrencyDollar className="h-4 w-4" />
                            <span className="font-semibold">{job.salary}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {job.description}
                      </p>
                      
                      {/* Quick Skills Preview */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {job.requiredSkills.slice(0, 4).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.requiredSkills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.requiredSkills.length - 4} autres
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <HiClock className="h-4 w-4" />
                          <span>{job.posted}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Job Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedJob ? (
                <motion.div
                  key={selectedJob.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-xl">{selectedJob.title}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-300">{selectedJob.company}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      {/* Description */}
                      <div>
                        <h3 className="font-semibold mb-2">📝 Description</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {selectedJob.description}
                        </p>
                      </div>

                      {/* Required Skills */}
                      <div>
                        <h3 className="font-semibold mb-3">🛠️ Compétences Requises</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.requiredSkills.map((skill, i) => (
                            <Badge key={i} variant="default" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Responsibilities */}
                      <div>
                        <h3 className="font-semibold mb-3">📋 Responsabilités</h3>
                        <ul className="space-y-2">
                          {selectedJob.responsibilities.map((resp, i) => (
                            <li key={i} className="flex items-start space-x-2 text-sm">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Keywords */}
                      <div>
                        <h3 className="font-semibold mb-3">🔑 Mots-clés</h3>
                        <div className="flex flex-wrap gap-1">
                          {selectedJob.keywords.map((keyword, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              #{keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <Button className="w-full">
                          📄 Postuler maintenant
                        </Button>
                        <Button variant="outline" className="w-full">
                          🔍 Analyser mon CV pour ce poste
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="sticky top-6">
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-400 mb-4">
                      <HiBuildingOffice2 className="h-12 w-12 mx-auto" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Sélectionnez une offre d'emploi pour voir les détails complets
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
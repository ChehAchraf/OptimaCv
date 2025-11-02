'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiTrash, HiEye, HiArrowDownTray } from 'react-icons/hi2';

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface CVTemplate {
  id: number;
  name: string;
  preview: string;
  color: string;
}

const templates: CVTemplate[] = [
  { id: 1, name: "Moderne", preview: "🎨", color: "bg-blue-100 text-blue-700" },
  { id: 2, name: "Classique", preview: "📋", color: "bg-gray-100 text-gray-700" },
  { id: 3, name: "Créatif", preview: "🎭", color: "bg-purple-100 text-purple-700" },
  { id: 4, name: "Minimaliste", preview: "⚪", color: "bg-green-100 text-green-700" }
];

export default function CVBuilderPage() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: ''
  });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [summary, setSummary] = useState('');

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setExperiences([...experiences, newExp]);
  };

  const updateExperience = (id: number, field: keyof Experience, value: any) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const removeExperience = (id: number) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now(),
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setEducation([...education, newEdu]);
  };

  const updateEducation = (id: number, field: keyof Education, value: string) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const removeEducation = (id: number) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const steps = [
    "Template",
    "Informations",
    "Expérience",
    "Formation",
    "Compétences & Résumé"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Créateur de CV Professionnel
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Créez un CV moderne et adapté aux offres d'emploi en quelques étapes
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {steps.map((stepName, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step > index + 1 ? 'bg-green-500 text-white' :
                    step === index + 1 ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {step > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step === index + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'
                  }`}>
                    {stepName}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-4 ${
                      step > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Étape {step}: {steps[step - 1]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                      >
                        <h3 className="text-lg font-semibold mb-4">Choisissez un template</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {templates.map(template => (
                            <div
                              key={template.id}
                              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedTemplate?.id === template.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              onClick={() => setSelectedTemplate(template)}
                            >
                              <div className="text-center">
                                <div className={`w-16 h-16 rounded-lg ${template.color} flex items-center justify-center mx-auto mb-3`}>
                                  <span className="text-2xl">{template.preview}</span>
                                </div>
                                <h4 className="font-medium">{template.name}</h4>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                      >
                        <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fullName">Nom complet *</Label>
                            <Input
                              id="fullName"
                              value={personalInfo.fullName}
                              onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})}
                              placeholder="Jean Dupont"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={personalInfo.email}
                              onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                              placeholder="jean.dupont@email.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input
                              id="phone"
                              value={personalInfo.phone}
                              onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                              placeholder="+33 6 12 34 56 78"
                            />
                          </div>
                          <div>
                            <Label htmlFor="location">Localisation</Label>
                            <Input
                              id="location"
                              value={personalInfo.location}
                              onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                              placeholder="Paris, France"
                            />
                          </div>
                          <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              id="linkedin"
                              value={personalInfo.linkedin}
                              onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                              placeholder="linkedin.com/in/jean-dupont"
                            />
                          </div>
                          <div>
                            <Label htmlFor="github">GitHub</Label>
                            <Input
                              id="github"
                              value={personalInfo.github}
                              onChange={(e) => setPersonalInfo({...personalInfo, github: e.target.value})}
                              placeholder="github.com/jean-dupont"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Expérience professionnelle</h3>
                          <Button onClick={addExperience} size="sm">
                            <HiPlus className="h-4 w-4 mr-2" />
                            Ajouter
                          </Button>
                        </div>
                        
                        {experiences.map((exp, index) => (
                          <Card key={exp.id} className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">Expérience {index + 1}</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeExperience(exp.id)}
                              >
                                <HiTrash className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Entreprise</Label>
                                <Input
                                  value={exp.company}
                                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                  placeholder="Nom de l'entreprise"
                                />
                              </div>
                              <div>
                                <Label>Poste</Label>
                                <Input
                                  value={exp.position}
                                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                  placeholder="Intitulé du poste"
                                />
                              </div>
                              <div>
                                <Label>Date de début</Label>
                                <Input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Date de fin</Label>
                                <Input
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                  disabled={exp.current}
                                />
                                <div className="flex items-center mt-2">
                                  <input
                                    type="checkbox"
                                    id={`current-${exp.id}`}
                                    checked={exp.current}
                                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                                    className="mr-2"
                                  />
                                  <Label htmlFor={`current-${exp.id}`} className="text-sm">
                                    Poste actuel
                                  </Label>
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                  value={exp.description}
                                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                  placeholder="Décrivez vos responsabilités et réalisations..."
                                  rows={3}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                        
                        {experiences.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p>Aucune expérience ajoutée pour le moment</p>
                            <Button onClick={addExperience} className="mt-4">
                              <HiPlus className="h-4 w-4 mr-2" />
                              Ajouter votre première expérience
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Formation</h3>
                          <Button onClick={addEducation} size="sm">
                            <HiPlus className="h-4 w-4 mr-2" />
                            Ajouter
                          </Button>
                        </div>
                        
                        {education.map((edu, index) => (
                          <Card key={edu.id} className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium">Formation {index + 1}</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeEducation(edu.id)}
                              >
                                <HiTrash className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Institution</Label>
                                <Input
                                  value={edu.institution}
                                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                  placeholder="Nom de l'école/université"
                                />
                              </div>
                              <div>
                                <Label>Diplôme</Label>
                                <Input
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                  placeholder="Master, Licence, etc."
                                />
                              </div>
                              <div>
                                <Label>Date de début</Label>
                                <Input
                                  type="month"
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Date de fin</Label>
                                <Input
                                  type="month"
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label>Description (optionnel)</Label>
                                <Textarea
                                  value={edu.description}
                                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                  placeholder="Spécialisation, mention, projets notables..."
                                  rows={2}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                        
                        {education.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <p>Aucune formation ajoutée pour le moment</p>
                            <Button onClick={addEducation} className="mt-4">
                              <HiPlus className="h-4 w-4 mr-2" />
                              Ajouter votre première formation
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {step === 5 && (
                      <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                      >
                        {/* Skills */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Compétences</h3>
                          <div className="flex gap-2 mb-4">
                            <Input
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Ajouter une compétence"
                              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                            />
                            <Button onClick={addSkill}>
                              <HiPlus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="cursor-pointer">
                                {skill}
                                <button
                                  onClick={() => removeSkill(skill)}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Summary */}
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Résumé professionnel</h3>
                          <Textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Rédigez un résumé de votre profil professionnel en 2-3 phrases..."
                            rows={4}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={step === 1}
                    >
                      Précédent
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={step === 5}
                    >
                      {step === 5 ? 'Terminé' : 'Suivant'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HiEye className="h-5 w-5 mr-2" />
                    Aperçu du CV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTemplate ? (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-lg ${selectedTemplate.color}`}>
                        <div className="text-center">
                          <div className="text-4xl mb-2">{selectedTemplate.preview}</div>
                          <p className="text-sm font-medium">{selectedTemplate.name}</p>
                        </div>
                      </div>
                      
                      <div className="text-sm space-y-3 border rounded-lg p-4 bg-white">
                        <div>
                          <h4 className="font-semibold text-lg">
                            {personalInfo.fullName || 'Votre Nom'}
                          </h4>
                          <p className="text-gray-600">{personalInfo.email || 'email@exemple.com'}</p>
                          {personalInfo.phone && <p className="text-gray-600">{personalInfo.phone}</p>}
                          {personalInfo.location && <p className="text-gray-600">{personalInfo.location}</p>}
                        </div>
                        
                        {summary && (
                          <div>
                            <h5 className="font-medium">Résumé</h5>
                            <p className="text-xs text-gray-600">{summary}</p>
                          </div>
                        )}
                        
                        {skills.length > 0 && (
                          <div>
                            <h5 className="font-medium">Compétences</h5>
                            <div className="flex flex-wrap gap-1">
                              {skills.slice(0, 6).map((skill, i) => (
                                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                              {skills.length > 6 && <span className="text-xs">+{skills.length - 6}</span>}
                            </div>
                          </div>
                        )}
                        
                        {experiences.length > 0 && (
                          <div>
                            <h5 className="font-medium">Expérience</h5>
                            {experiences.slice(0, 2).map((exp, i) => (
                              <div key={i} className="text-xs mb-2">
                                <p className="font-medium">{exp.position || 'Poste'}</p>
                                <p className="text-gray-600">{exp.company || 'Entreprise'}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Button className="w-full" size="sm">
                          <HiEye className="h-4 w-4 mr-2" />
                          Aperçu complet
                        </Button>
                        <Button variant="outline" className="w-full" size="sm">
                          <HiArrowDownTray className="h-4 w-4 mr-2" />
                          Télécharger PDF
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Sélectionnez un template pour voir l'aperçu</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
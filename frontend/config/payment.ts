import { Plan } from "@/types/type";

export const plans: Plan[] = [
    {
        name: 'Basic',
        price: '€9.99 / mois',
        features: ['1 CV', 'Support Email', 'Templates limités'],
    },
    {
        name: 'VIP',
        price: '€29.99 / mois',
        features: ['CV illimités', 'Support Prioritaire', 'Accès à tous les templates'],
        popular: true,
    },
    {
        name: 'Entreprise',
        price: '€99.99 / mois',
        features: ['CV illimités', 'Gestion équipe', 'Statistiques avancées'],
    },
    {
        name: 'Students',
        price: '€4.99 / mois',
        features: ['1 CV', 'Support Email', 'Templates limités', 'Prix étudiant'],
        note: '2 mois offerts avec email école',
    },
];
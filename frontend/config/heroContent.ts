import { HiCheckCircle } from 'react-icons/hi2';

export type HeroContent = {
  tryNowBadge: string;
  heading: string;
  subheading: string;
  ctaPrimary: string;
  ctaSecondary: string;
  socialProof: {
    text: string;
    avatars: string[];
    stars: number;
    reviews: string;
  };
  visuals: {
    image1_src: string;
    image1_alt: string;
    card1_title: string;
    card1_date: string;
    card1_icon: typeof HiCheckCircle;
    card2_score: string;
    card2_label: string;
    card2_avatar: string;
    image2_src: string;
    image2_alt: string;
  };
};

export const frHeroContent: HeroContent = {
  tryNowBadge: "ESSAYEZ-LE MAINTENANT !",
  heading: "Optimisez votre CV avec l'IA.",
  subheading:
    "Notre technologie avancée analyse votre CV pour l'aligner parfaitement avec les attentes des recruteurs et les systèmes ATS.",
  ctaPrimary: "Analyser mon CV",
  ctaSecondary: "Voir la démo",
  
  socialProof: {
    text: "Rejoignez +500 utilisateurs satisfaits",
    avatars: [
      "https://i.pravatar.cc/150?img=12",
      "https://i.pravatar.cc/150?img=11",
      "https://i.pravatar.cc/150?img=10",
    ],
    stars: 4.8,
    reviews: "avis vérifiés",
  },
  
  visuals: {
    image1_src: "/images/hero-image-1.jpg", 
    image1_alt: "Un CV professionnel sur un bureau",

    card1_title: "Analyse Réussie",
    card1_date: "Mar. 20, 2024",
    card1_icon: HiCheckCircle, 

    card2_score: "92%",
    card2_label: "Score de correspondance",
    card2_avatar: "https://i.pravatar.cc/150?img=5",

    image2_src: "/images/hero-image-2.jpg", 
    image2_alt: "Une personne célébrant une offre d'emploi",
  },
};
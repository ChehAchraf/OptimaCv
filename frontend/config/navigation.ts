export type NavigationContent = {
  logoText: string;
  links: {
    name: string;
    href: string;
  }[];
  loginButton: string;
  ctaButton: string;
  openMenu: string;
  closeMenu: string;
};

export const frNavigation: NavigationContent = {
  logoText: "OptimaCV",
  links: [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Tarifs", href: "#pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Pour les Entreprises", href: "/entreprise" },
  ],
  loginButton: "Se connecter",
  ctaButton: "Commencer (Gratuit)",
  openMenu: "Ouvrir le menu",
  closeMenu: "Fermer le menu",
};
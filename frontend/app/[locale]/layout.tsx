import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";

// Optimized font loading with display swap
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-cairo",
  preload: true,
});

export const metadata: Metadata = {
  title: "OptimaCv - Créez votre CV professionnel avec l'IA",
  description: "Générez des CV optimisés et professionnels en quelques secondes grâce à notre intelligence artificielle avancée. Modèles modernes, analyse de CV et suggestions personnalisées.",
  keywords: [
    "CV",
    "IA",
    "Intelligence Artificielle",
    "Recrutement",
    "Emploi",
    "Générateur de CV",
    "Curriculum Vitae",
    "OptimaCv"
  ],
  authors: [
    {
      name: "OptimaCv Team"
    }
  ],
  openGraph: {
    title: "OptimaCv - Créez votre CV professionnel avec l'IA",
    description: "Générez des CV optimisés et professionnels en quelques secondes grâce à notre intelligence artificielle avancée.",
    url: "https://optimacv.com",
    siteName: "OptimaCv",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OptimaCv - Créez votre CV professionnel avec l'IA",
    description: "Générez des CV optimisés et professionnels en quelques secondes grâce à notre intelligence artificielle avancée.",
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  const isArabic = locale === 'ar';
  const direction = isArabic ? 'rtl' : 'ltr';
  const fontClass = isArabic ? cairo.className : inter.className;

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${fontClass} bg-gray-50 dark:bg-gray-950 transition-colors duration-200`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main>
              {children}
            </main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

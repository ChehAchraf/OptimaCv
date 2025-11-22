import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter, Cairo } from "next/font/google"; 
import "../globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const cairo = Cairo({ subsets: ["arabic"], display: "swap" }); 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang={locale} dir={direction}>
      <body className={`${fontClass} bg-gray-50`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

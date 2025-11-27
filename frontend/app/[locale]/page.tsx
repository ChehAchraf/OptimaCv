'use client';

import HeroSection from '@/components/HeroSection';
import ProcessSection from '@/components/ProcessSection';
import TrustSection from '@/components/TrustSection';
import CompanySection from '@/components/CompanySection';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <>
      <HeroSection
        title={t('title')}
        subtitle={t('subtitle')}
        cta={t('cta')}
      />
      <ProcessSection />
      <TrustSection />
      <CompanySection />
    </>
  );
}
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import { useTranslations } from 'next-intl';
import { SectionLoader } from '@/components/loading';

const ProcessSection = dynamic(() => import('@/components/ProcessSection'), {
  loading: () => <SectionLoader />,
  ssr: false,
});

const TrustSection = dynamic(() => import('@/components/TrustSection'), {
  loading: () => <SectionLoader />,
  ssr: false,
});

const CompanySection = dynamic(() => import('@/components/CompanySection'), {
  loading: () => <SectionLoader />,
  ssr: false,
});

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <>
      <HeroSection
        title={t('title')}
        subtitle={t('subtitle')}
        cta={t('cta')}
      />
      <Suspense fallback={<SectionLoader />}>
        <ProcessSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TrustSection />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CompanySection />
      </Suspense>
    </>
  );
}
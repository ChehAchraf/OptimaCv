'use client';

import { benefits, metrics, features } from '@/config/company';
import {
  CompanyHeader,
  CompanyBenefits,
  CompanyMetrics,
  CompanyFeatureCard,
  CompanyFeaturesTabs,
  CompanyCTA,
} from '@/components/company';

/**
 * Company Section
 * Main landing page section showcasing enterprise features
 * 
 * Architecture: Uses composition pattern with smaller, focused components
 * for better maintainability and testability.
 */
export default function CompanySection() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-black dark:via-gray-950 dark:to-black overflow-hidden">
      {/* Background decorations */}
      <BackgroundDecorations />

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        <CompanyHeader />
        <CompanyFeatureCard />
        <CompanyBenefits benefits={benefits} />
        <CompanyMetrics metrics={metrics} />
        <CompanyFeaturesTabs features={features} />
        <CompanyCTA />
      </div>
    </section>
  );
}

/**
 * Background visual decorations
 */
function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gray-200 dark:bg-gray-900 rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 dark:bg-gray-900 rounded-full blur-3xl opacity-10" />
    </div>
  );
}

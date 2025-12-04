'use client';

import { Suspense, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PaymentPlan } from '@/types/plan';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { CardLoader } from '@/components/loading';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button));
const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));
const CardContent = dynamic(() => import('@/components/ui/card').then(mod => mod.CardContent));
const CardDescription = dynamic(() => import('@/components/ui/card').then(mod => mod.CardDescription));
const CardFooter = dynamic(() => import('@/components/ui/card').then(mod => mod.CardFooter));
const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => mod.CardHeader));
const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => mod.CardTitle));
const Badge = dynamic(() => import('@/components/ui/badge').then(mod => mod.Badge));

const Check = dynamic(() => import('lucide-react').then(mod => mod.Check), { ssr: false });

/**
 * PaymentPage Component
 * 
 * Fetches plans dynamically from Supabase via /api/plans endpoint.
 * 
 * Database fields used from `plans` table:
 * - id (uuid): Unique identifier for the plan
 * - name (text): Internal plan name (e.g., 'free', 'vip', 'enterprise', 'students')
 * - price (numeric): Plan price
 * - duration_days (integer): Subscription duration in days
 * - max_cv_builds (integer): Maximum CV builds allowed
 * - max_cv_analyses (integer): Maximum CV analyses allowed
 * - features (jsonb): Multilingual features { en: string[], fr: string[], ar: string[] }
 * - created_at (timestamp): When the plan was created
 */
const PaymentPage = () => {
    const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
    const [plans, setPlans] = useState<PaymentPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast();
    const t = useTranslations('PaymentPage');
    const params = useParams();
    const locale = params.locale as string || 'en';

    // Fetch plans from Supabase on mount
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/plans?locale=${locale}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch plans');
                }

                const data = await response.json();

                if (data.plans && Array.isArray(data.plans)) {
                    // Transform plans to PaymentPlan format
                    const transformedPlans: PaymentPlan[] = data.plans.map((plan: any) => ({
                        id: plan.id,
                        name: plan.display_name || plan.name,
                        price: formatPrice(plan.price, plan.currency || 'USD', locale),
                        features: plan.features || [],
                        popular: plan.name === 'vip',
                        note: plan.name === 'students' ? t('studentOffer') : undefined,
                    }));

                    setPlans(transformedPlans);
                }
            } catch (err) {
                console.error('Error fetching plans:', err);
                setError('Failed to load plans. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [locale, t]);

    // Format price based on locale and currency
    const formatPrice = (price: number, currency: string, locale: string): string => {
        if (price === 0) {
            return t('plans.Basic.price') || 'Free';
        }

        const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : locale === 'fr' ? 'fr-FR' : 'en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
        });

        const formattedPrice = formatter.format(price);

        // Add "/month" suffix based on locale
        const monthSuffix = locale === 'fr' ? '/mois' : locale === 'ar' ? '/شهر' : '/month';
        return `${formattedPrice} ${monthSuffix}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading plans...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
                    {t('title')}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    {t('subtitle')}
                </p>
            </div>

            <Suspense fallback={<CardLoader />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            selectedPlan={selectedPlan}
                            setSelectedPlan={setSelectedPlan}
                            toast={toast}
                            t={t}
                        />
                    ))}
                </div>
            </Suspense>

            {plans.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No plans available at the moment.</p>
                </div>
            )}

            <div className="mt-16 text-center text-sm text-muted-foreground">
                <p>{t('securePayment')}</p>
            </div>
        </div>
    );
};

interface PlanCardProps {
    plan: PaymentPlan;
    selectedPlan: PaymentPlan | null;
    setSelectedPlan: (plan: PaymentPlan) => void;
    toast: any;
    t: any;
}

function PlanCard({ plan, selectedPlan, setSelectedPlan, toast, t }: PlanCardProps) {
    const handleSelectPlan = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedPlan(plan);
        toast({
            title: t('selected'),
            description: `${plan.name} - ${plan.price}`,
        });
    };

    return (
        <Card
            className={`relative flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${selectedPlan?.id === plan.id
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-border hover:border-primary/50'
                } ${plan.popular ? 'shadow-md border-primary/20' : ''}`}
            onClick={() => setSelectedPlan(plan)}
            role="button"
            tabIndex={0}
            aria-label={`Select ${plan.name} plan for ${plan.price}`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPlan(plan);
                }
            }}
        >
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary/90 uppercase text-xs font-bold px-3 py-1">
                        {t('recommended')}
                    </Badge>
                </div>
            )}

            <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription>
                    <span className="text-3xl font-bold text-foreground">
                        {plan.price.split(' ')[0]}
                    </span>
                    <span className="text-muted-foreground ml-1">
                        {plan.price.split(' ').slice(1).join(' ')}
                    </span>
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
                <ul className="space-y-3" role="list">
                    {plan.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="pt-6 flex flex-col gap-2">
                {plan.note && (
                    <p className="text-xs font-medium text-primary text-center w-full animate-pulse" role="status">
                        {plan.note}
                    </p>
                )}
                <Button
                    variant={selectedPlan?.id === plan.id ? 'default' : 'outline'}
                    className={`w-full ${plan.popular && selectedPlan?.id !== plan.id
                        ? 'border-primary text-primary hover:bg-primary/5'
                        : ''
                        }`}
                    size="lg"
                    onClick={handleSelectPlan}
                    aria-pressed={selectedPlan?.id === plan.id}
                >
                    {selectedPlan?.id === plan.id ? t('selected') : t('selectPlan')}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default PaymentPage;

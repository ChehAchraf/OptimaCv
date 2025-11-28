'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { Plan } from '@/types/type';
import { useTranslations } from 'next-intl';
import { CardLoader } from '@/components/loading';

// Lazy load UI components
const Button = dynamic(() => import('@/components/ui/button').then(mod => mod.Button));
const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card));
const CardContent = dynamic(() => import('@/components/ui/card').then(mod => mod.CardContent));
const CardDescription = dynamic(() => import('@/components/ui/card').then(mod => mod.CardDescription));
const CardFooter = dynamic(() => import('@/components/ui/card').then(mod => mod.CardFooter));
const CardHeader = dynamic(() => import('@/components/ui/card').then(mod => mod.CardHeader));
const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => mod.CardTitle));
const Badge = dynamic(() => import('@/components/ui/badge').then(mod => mod.Badge));

// Lazy load icons
const Check = dynamic(() => import('lucide-react').then(mod => mod.Check), { ssr: false });

const PaymentPage = () => {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const t = useTranslations('PaymentPage');

    // Define plans dynamically using translations
    const plans: Plan[] = [
        {
            name: t('plans.Basic.name'),
            price: t('plans.Basic.price'),
            features: [t('plans.Basic.features.0'), t('plans.Basic.features.1'), t('plans.Basic.features.2')],
        },
        {
            name: t('plans.VIP.name'),
            price: t('plans.VIP.price'),
            features: [t('plans.VIP.features.0'), t('plans.VIP.features.1'), t('plans.VIP.features.2')],
            popular: true,
        },
        {
            name: t('plans.Entreprise.name'),
            price: t('plans.Entreprise.price'),
            features: [t('plans.Entreprise.features.0'), t('plans.Entreprise.features.1'), t('plans.Entreprise.features.2')],
        },
        {
            name: t('plans.Students.name'),
            price: t('plans.Students.price'),
            features: [t('plans.Students.features.0'), t('plans.Students.features.1'), t('plans.Students.features.2'), t('plans.Students.features.3')],
            note: t('studentOffer'),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
                    {t('title')}
                </h1>
                <p className="text-xl text-gray-600">
                    {t('subtitle')}
                </p>
            </div>

            <Suspense fallback={<CardLoader />}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.name}
                            plan={plan}
                            selectedPlan={selectedPlan}
                            setSelectedPlan={setSelectedPlan}
                            t={t}
                        />
                    ))}
                </div>
            </Suspense>

            <div className="mt-16 text-center text-sm text-muted-foreground">
                <p>{t('securePayment')}</p>
            </div>
        </div>
    );
};

// Extracted Plan Card Component
function PlanCard({ plan, selectedPlan, setSelectedPlan, t }: any) {
    return (
        <Card
            className={`relative flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${selectedPlan?.name === plan.name
                ? 'border-primary ring-2 ring-primary ring-offset-2'
                : 'border-border hover:border-primary/50'
                } ${plan.popular ? 'shadow-md border-primary/20' : ''}`}
            onClick={() => setSelectedPlan(plan)}
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
                <ul className="space-y-3">
                    {plan.features.map((feature: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="h-5 w-5 text-primary shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter className="pt-6 flex flex-col gap-2">
                {plan.note && (
                    <p className="text-xs font-medium text-primary text-center w-full animate-pulse">
                        {plan.note}
                    </p>
                )}
                <Button
                    variant={selectedPlan?.name === plan.name ? 'default' : 'outline'}
                    className={`w-full ${plan.popular && selectedPlan?.name !== plan.name
                        ? 'border-primary text-primary hover:bg-primary/5'
                        : ''
                        }`}
                    size="lg"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan);
                        alert(`${t('selected')}: ${plan.name}`);
                    }}
                >
                    {selectedPlan?.name === plan.name ? t('selected') : t('selectPlan')}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default PaymentPage;

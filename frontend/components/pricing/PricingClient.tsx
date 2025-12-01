"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Plan, UserPlan } from "@/types/plan";



export default function PricingClient() {
    const t = useTranslations('PricingPage');
    const [plans, setPlans] = useState<Plan[]>([]);
    const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [plansRes, userPlanRes] = await Promise.all([
                fetch("/api/plans"),
                fetch("/api/user/plan")
            ]);

            const plansData = await plansRes.json();
            const userPlanData = await userPlanRes.json();

            if (plansData.plans) setPlans(plansData.plans);
            if (userPlanData.success && userPlanData.plan) setUserPlan(userPlanData.plan);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planId: string) => {
        setSubscribing(planId);
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan_id: planId }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast({
                    title: t('successTitle'),
                    description: t('successMessage'),
                });
                fetchData(); // Refresh state
                router.refresh();
            } else {
                if (res.status === 401) {
                    router.push("/login");
                    return;
                }
                toast({
                    title: t('errorTitle'),
                    description: data.error || t('errorMessage'),
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: t('errorTitle'),
                description: t('genericError'),
                variant: "destructive",
            });
        } finally {
            setSubscribing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                    {t('title')}
                </h2>
                <p className="mt-4 text-xl text-muted-foreground">
                    {t('subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                {plans.map((plan) => {
                    const isCurrentPlan = userPlan?.plan_id === plan.id && userPlan?.status === 'active';

                    return (
                        <Card
                            key={plan.id}
                            className={cn(
                                "flex flex-col relative overflow-hidden transition-all hover:shadow-lg",
                                isCurrentPlan ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border"
                            )}
                        >
                            {plan.name === 'vip' && (
                                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    {t('popular')}
                                </div>
                            )}

                            <CardHeader>
                                <CardTitle className="text-2xl font-bold">{plan.display_name}</CardTitle>
                                <CardDescription className="min-h-[50px]">{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-grow">
                                <div className="mb-6">
                                    <span className="text-4xl font-extrabold">
                                        {plan.price === 0 ? t('free') : `$${plan.price}`}
                                    </span>
                                    {plan.price > 0 && <span className="text-muted-foreground">{t('perMonth')}</span>}
                                </div>

                                <ul className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                    {!plan.priority_support && (
                                        <li className="flex items-start text-muted-foreground/50">
                                            <X className="h-5 w-5 mr-2 shrink-0" />
                                            <span className="text-sm">{t('prioritySupport')}</span>
                                        </li>
                                    )}
                                </ul>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={isCurrentPlan ? "outline" : plan.name === 'vip' ? "default" : "secondary"}
                                    disabled={isCurrentPlan || subscribing !== null}
                                    onClick={() => handleSubscribe(plan.id)}
                                >
                                    {subscribing === plan.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : null}
                                    {isCurrentPlan ? t('currentPlan') : t('subscribeNow')}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

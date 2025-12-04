import { createRouteHandlerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { SupportedLocale } from "@/types/plan";

/**
 * Plan structure from database
 * 
 * Database fields:
 * - id (uuid): Unique identifier for the plan
 * - name (text): Plan name (e.g., 'Free', 'VIP', 'Enterprise', 'Students')
 * - price (numeric): Plan price
 * - duration_days (integer): Subscription duration in days
 * - max_cv_builds (integer): Maximum CV builds allowed
 * - max_cv_analyses (integer): Maximum CV analyses allowed
 * - features (jsonb): Multilingual features in format:
 *   { "ar": {"features": [...]}, "en": {"features": [...]}, "fr": {"features": [...]} }
 * - created_at (timestamp): When the plan was created
 */
interface PlanFromDB {
    id: string;
    name: string;
    price: number;
    duration_days: number;
    max_cv_builds: number;
    max_cv_analyses: number;
    features: {
        [locale: string]: {
            features?: string[];
        } | string[];
    } | null;
    created_at: string;
}

/**
 * GET /api/plans
 * 
 * Fetches all plans from the Supabase `plans` table.
 * 
 * Query params:
 * - locale: 'en' | 'fr' | 'ar' (optional, defaults to 'en')
 * 
 * Returns plans with features in the requested locale.
 */
export async function GET(request: NextRequest) {
    try {
        const { supabase } = await createRouteHandlerClient(request as any);

        // Get locale from query params or default to 'en'
        const searchParams = request.nextUrl.searchParams;
        const locale = (searchParams.get('locale') || 'en') as SupportedLocale;

        // Validate locale
        const validLocales: SupportedLocale[] = ['en', 'fr', 'ar'];
        const safeLocale = validLocales.includes(locale) ? locale : 'en';

        // Fetch all plans from database
        const { data: plansFromDB, error } = await supabase
            .from("plans")
            .select(`
                id,
                name,
                price,
                duration_days,
                max_cv_builds,
                max_cv_analyses,
                features,
                created_at
            `)
            .order("price", { ascending: true });

        if (error) {
            console.error("Error fetching plans:", error.message);
            return NextResponse.json(
                { error: "Failed to fetch plans", details: error.message },
                { status: 500 }
            );
        }

        if (!plansFromDB || plansFromDB.length === 0) {
            return NextResponse.json({ plans: [] });
        }

        // Transform plans to include locale-specific features
        const plans = (plansFromDB as PlanFromDB[]).map((plan) => {
            // Extract features for the requested locale
            // Handle both nested format { "en": { "features": [...] } }
            // and flat format { "en": [...] }
            const features = extractFeatures(plan.features, safeLocale);

            // Generate display name from the plan name
            const displayName = getDisplayName(plan.name, safeLocale);

            // Generate description based on plan name
            const description = getDefaultDescription(plan.name, safeLocale);

            // Determine if this is the popular/VIP plan
            const isPopular = plan.name.toLowerCase() === 'vip';

            // Check if plan is free
            const isFree = plan.price === 0;

            return {
                id: plan.id,
                name: plan.name,
                display_name: displayName,
                description: description,
                price: plan.price,
                currency: 'USD',
                duration_days: plan.duration_days,
                max_cv_builds: plan.max_cv_builds,
                max_cv_analyses: plan.max_cv_analyses,
                features: features,
                priority_support: isPopular || plan.name.toLowerCase() === 'enterprise',
                custom_templates: !isFree,
                popular: isPopular,
            };
        });

        return NextResponse.json({ plans });
    } catch (error) {
        console.error("Unexpected error in GET /api/plans:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * Extract features array from the features jsonb column
 * Handles multiple formats:
 * - Nested: { "en": { "features": ["...", "..."] } }
 * - Flat: { "en": ["...", "..."] }
 * - Null/undefined
 */
function extractFeatures(
    featuresObj: PlanFromDB['features'],
    locale: SupportedLocale
): string[] {
    if (!featuresObj) {
        return [];
    }

    // Try to get the locale-specific features
    const localeData = featuresObj[locale] || featuresObj['en'];

    if (!localeData) {
        return [];
    }

    // If it's already an array, return it
    if (Array.isArray(localeData)) {
        return localeData;
    }

    // If it's an object with a "features" key, extract that
    if (typeof localeData === 'object' && 'features' in localeData && Array.isArray(localeData.features)) {
        return localeData.features;
    }

    return [];
}

/**
 * Get display name based on plan name and locale
 */
function getDisplayName(planName: string, locale: SupportedLocale): string {
    const displayNames: Record<string, Record<SupportedLocale, string>> = {
        free: {
            en: "Free",
            fr: "Gratuit",
            ar: "مجاني"
        },
        vip: {
            en: "VIP",
            fr: "VIP",
            ar: "VIP"
        },
        enterprise: {
            en: "Enterprise",
            fr: "Entreprise",
            ar: "المؤسسات"
        },
        students: {
            en: "Student",
            fr: "Étudiant",
            ar: "طالب"
        }
    };

    const planKey = planName.toLowerCase();
    return displayNames[planKey]?.[locale] || displayNames[planKey]?.en || planName;
}

/**
 * Generate default descriptions based on plan name and locale
 */
function getDefaultDescription(planName: string, locale: SupportedLocale): string {
    const descriptions: Record<string, Record<SupportedLocale, string>> = {
        free: {
            en: "Get started with basic CV analysis features",
            fr: "Commencez avec les fonctionnalités d'analyse CV de base",
            ar: "ابدأ مع ميزات تحليل السيرة الذاتية الأساسية"
        },
        vip: {
            en: "Unlock premium features for serious job seekers",
            fr: "Débloquez les fonctionnalités premium pour les chercheurs d'emploi sérieux",
            ar: "افتح الميزات المميزة للباحثين الجادين عن عمل"
        },
        enterprise: {
            en: "Complete solution for recruitment teams",
            fr: "Solution complète pour les équipes de recrutement",
            ar: "حل كامل لفرق التوظيف"
        },
        students: {
            en: "Special pricing for students and graduates",
            fr: "Tarification spéciale pour les étudiants et diplômés",
            ar: "أسعار خاصة للطلاب والخريجين"
        }
    };

    const planKey = planName.toLowerCase();
    return descriptions[planKey]?.[locale] || descriptions[planKey]?.en || "";
}

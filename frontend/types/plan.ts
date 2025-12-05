/**
 * Plan type definitions for the plans table
 * 
 * Database fields used:
 * - id (uuid): Unique identifier for the plan
 * - name (text): Internal plan name (e.g., 'free', 'vip', 'enterprise', 'students')
 * - price (numeric): Plan price in the default currency
 * - duration_days (integer): Subscription duration in days
 * - max_cv_builds (integer): Maximum CV builds allowed
 * - max_cv_analyses (integer): Maximum CV analyses allowed
 * - features (jsonb): Multilingual features object { en: string[], fr: string[], ar: string[] }
 * - created_at (timestamp): When the plan was created
 */

// Raw plan data from Supabase
export interface PlanFromDB {
    id: string;
    name: string;
    price: number;
    duration_days: number;
    max_cv_builds: number;
    max_cv_analyses: number;
    features: {
        en: string[];
        fr: string[];
        ar: string[];
    };
    created_at: string;
    // Optional fields that might exist in the database
    display_name?: string;
    description?: string;
    is_active?: boolean;
    sort_order?: number;
    currency?: string;
    priority_support?: boolean;
    custom_templates?: boolean;
}

// Processed plan for frontend display
export interface Plan {
    id: string;
    name: string;
    display_name: string;
    description: string;
    price: number;
    currency: string;
    duration_days: number;
    max_cv_builds: number;
    max_cv_analyses: number;
    features: string[];
    priority_support: boolean;
    custom_templates: boolean;
}

// Plan for payment page (simpler structure)
export interface PaymentPlan {
    id: string;
    name: string;
    price: string;
    features: string[];
    popular?: boolean;
    note?: string;
}

// User's subscription to a plan
export interface UserPlan {
    plan_id: string;
    status: string;
    end_date: string;
    plan?: Plan;
}

// Supported locales for multilingual features
export type SupportedLocale = 'en' | 'fr' | 'ar';


export interface PlanCardProps {
    plan: PaymentPlan;
    selectedPlan: PaymentPlan | null;
    setSelectedPlan: (plan: PaymentPlan) => void;
    toast: any;
    t: any;
}
export interface Plan {
    id: string;
    name: string;
    display_name: string;
    description: string;
    price: number;
    currency: string;
    duration_days: number;
    features: string[];
    priority_support: boolean;
    custom_templates: boolean;
}

export interface UserPlan {
    plan_id: string;
    status: string;
    end_date: string;
}
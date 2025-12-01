import { Plan } from "./plan";

export interface ProfileData {
    user: User;
    plan: any;
    usage: Usage;
    freeUsage: any;
}


export interface User {
    id: string;
    email: string;
    createdAt: string;
    metadata: any;
}

export interface Usage {
    hasActivePlan: boolean;
    planName: string;
    planPrice: number;
    analysesUsed: number;
    analysesLimit: number | null;
    analysesRemaining: number | null;
    isFreeUser: boolean;
    planEndDate: string | null;
    planStartDate: string | null;
}

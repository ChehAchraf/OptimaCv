export interface AnalysisResult {
    filename: string;
    analysis: Analysis
};


export interface Analysis {
    contact_info: ContactInfo;
    summary: string;
    match_score: number;
    strengths: string[];
}


export interface ContactInfo {
    name: string;
    email: string
}


export interface CVBuildResponse {
    analysis: {
        profile_focus: string;
        key_selling_points: string[];
    };
    generated_cv: any;
}


export interface CVPayload {
    cv_pdf: File;
    job_description: string;
    cv_image?: File;
}

export interface CVBuildPayload {
    full_name: string;
    email: string;
    phone: string;
    raw_description: string;
    certificates: string[];
    education: any[];
    experience: any[];
}


export interface FormData {
    fullName: string;
    email: string;
    phone: string;
    rawDescription: string;
    certificates: string[];
    tempCert: string;
}



export interface NavItem {
    name: string;
    href: string;
}




export interface Plan {
    name: string;
    price: string;
    features: string[];
    popular?: boolean;
    note?: string;
}



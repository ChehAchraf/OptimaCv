export interface CVPersonalDetail {
    full_name: string;
    email: string;
    phone: string;
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
    summary?: string;
    location?: string;
}

export interface CVEducation {
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description?: string;
}

export interface CVExperience {
    company: string;
    position: string;
    location?: string;
    start_date: string;
    end_date?: string;
    current: boolean;
    description: string;
}

export interface CVProject {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
}

export interface CVSkill {
    category: string;
    skills: string[];
}

export interface CVFullProfile {
    personal_details: CVPersonalDetail;
    education: CVEducation[];
    experience: CVExperience[];
    projects: CVProject[];
    skills: CVSkill[];
}

export interface OptimizationResponse {
    original_text: string;
    optimized_text: string;
    improvements: string[];
}



export interface Props {
    data: CVExperience[];
    updateData: (data: CVExperience[]) => void;
}

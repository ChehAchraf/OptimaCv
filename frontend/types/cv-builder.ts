export interface CVPersonalDetail {
    full_name: string;
    job_title?: string;
    email: string;
    phone: string;
    linkedin_url?: string;
    github_url?: string;
    portfolio_url?: string;
    summary?: string;
    location?: string;
    picture_url?: string;
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

export interface CVLanguage {
    language: string;
    proficiency: string;
}

export interface CVCertification {
    name: string;
    issuer: string;
    date: string;
    link?: string;
}

export interface CVInterest {
    name: string;
    keywords?: string[];
}

export interface CVFullProfile {
    personal_details: CVPersonalDetail;
    education: CVEducation[];
    experience: CVExperience[];
    projects: CVProject[];
    skills: CVSkill[];
    languages: CVLanguage[];
    certifications: CVCertification[];
    interests: CVInterest[];
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

export type TemplateType = 'modern' | 'classic' | 'minimal' | 'executive' | 'tech' | 'global';

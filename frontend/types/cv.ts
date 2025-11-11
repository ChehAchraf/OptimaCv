
export interface PersonalInfo {
    fullName: string;
    email: string;
    phoneNumber: string;
    linkedin: string;
    github: string;
    portfolio?: string;
    location?: string;
    profilePhoto?: string; // Base64 or URL
    title?: string; // Professional title/role
    summary?: string; // Professional summary
  }
  
  export interface Education {
    school: string;
    degree: string;
    startDate: string;
    endDate:string;
  }
  
  export interface Experience {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    originalDescription?: string; // Store original before AI optimization
  }
  
  export interface Project {
    name: string;
    description: string;
    url: string;
    originalDescription?: string; // Store original before AI optimization
  }
  
  export interface Skills {
    hard: string[];
    soft: string[];
    languages?: Array<{name: string; level: string}>;
    certifications?: string[];
    interests?: string[];
  }

  export interface JobOffer {
    title: string;
    company: string;
    description: string;
    requirements: string;
    skills: string[];
    location?: string;
    jobType?: string;
  }
  
  export interface CVData {
    personalInfo: PersonalInfo;
    education: Education[];
    experience: Experience[];
    projects: Project[];
    skills: Skills;
    jobOffer?: JobOffer; // Add job offer data
    sectionOrder?: SectionOrder[]; // Add section ordering
    preferences?: {
      primaryColor?: string;
    };
  }

  export interface SectionOrder {
    id: string;
    name: string;
    enabled: boolean;
  }
  
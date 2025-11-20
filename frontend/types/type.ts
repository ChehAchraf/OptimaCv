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


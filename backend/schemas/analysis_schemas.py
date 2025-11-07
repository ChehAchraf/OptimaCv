from pydantic import BaseModel, EmailStr
from typing import List, Optional
from pydantic import BaseModel
class ContactInfoSchema(BaseModel):
    name: str
    email: EmailStr
    phone: str
    location: Optional[str] = None

class DetailItemSchema(BaseModel):
    skill: Optional[str] = None
    requirement: Optional[str] = None
    match: str
    comment: str

class DetailedAnalysisSchema(BaseModel):
    hard_skills: List[DetailItemSchema] = [] 
    soft_skills: List[DetailItemSchema] = []
    experience: List[DetailItemSchema] = []

class CVvsJDAnalysis(BaseModel):
    contact_info: Optional[ContactInfoSchema] = None 
    summary: Optional[str] = None 
    strengths: List[str] = []     
    weaknesses: List[str] = []    
    
    match_score: Optional[int] = None 
    
    detailed_analysis: Optional[DetailedAnalysisSchema] = None

class CVvsJDResponse(BaseModel):
    filename: str
    analysis_source: str
    analysis_vs_jd: CVvsJDAnalysis

class ExperienceSchema(BaseModel):
    company: str
    title: str
    duration: Optional[str] = None
    details: Optional[str] = None

class EducationSchema(BaseModel):
    institution: str
    degree: str
    duration: Optional[str] = None

class CVOnlyAnalysis(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    summary: Optional[str] = None
    skills: List[str]
    experience: List[ExperienceSchema]
    education: List[EducationSchema]

class CVOnlyResponse(BaseModel):
    filename: str
    analysis_source: str
    analysis: CVOnlyAnalysis

class VisualFeedback(BaseModel):
    layout_score: Optional[int] = None
    layout_notes: Optional[str] = None
    font_choice_notes: Optional[str] = None
    color_scheme_notes: Optional[str] = None
    overall_professionalism: Optional[str] = None
    suggestions: List[str] = []

class VisualAnalysisResponse(BaseModel):
    filename: str
    analysis_type: str = "Visual Analysis"
    feedback: VisualFeedback

class FullAnalysisResponse(BaseModel):
    filename_pdf: str
    filename_image: Optional[str] = None
    analysis_vs_jd: CVvsJDAnalysis
    visual_analysis: Optional[VisualFeedback] = None


class RankedAnalysisItem(BaseModel):
    """
    هذا هو الشكل ديال كل عنصر فاللائحة المرتبة
    """
    filename: str
    analysis: CVvsJDAnalysis

class FullRankingResponse(BaseModel):
    """
    هذا هو الجواب النهائي لي غايرجع للشركة
    """
    total_processed: int
    ranked_results: List[RankedAnalysisItem]


# --- Schemas for generating CV from user-provided structured info ---
class CVPersonalInfoSchema(BaseModel):
    fullName: str
    email: EmailStr
    phoneNumber: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    portfolio: Optional[str] = None
    location: Optional[str] = None
    profilePhoto: Optional[str] = None
    title: Optional[str] = None
    summary: Optional[str] = None


class CVEducationSchema(BaseModel):
    school: str
    degree: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None


class CVExperienceSchema(BaseModel):
    company: str
    role: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    description: Optional[str] = None


class CVProjectSchema(BaseModel):
    name: str
    description: Optional[str] = None
    url: Optional[str] = None


class CVLanguageSchema(BaseModel):
    name: str
    level: str


class CVSkillsSchema(BaseModel):
    hard: List[str] = []
    soft: List[str] = []
    languages: List[CVLanguageSchema] = []
    certifications: List[str] = []


class CVDataSchema(BaseModel):
    personalInfo: CVPersonalInfoSchema
    education: List[CVEducationSchema] = []
    experience: List[CVExperienceSchema] = []
    projects: List[CVProjectSchema] = []
    skills: CVSkillsSchema = CVSkillsSchema()


class CVGenerateRequest(BaseModel):
    cv_data: CVDataSchema
    job_description: Optional[str] = None
    template: Optional[str] = None


class GeneratedCVResponse(BaseModel):
    organized_data: CVDataSchema
    ai_summary: Optional[str] = None
    strengths: List[str] = []
    weaknesses: List[str] = []
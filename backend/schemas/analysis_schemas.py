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
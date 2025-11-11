"""
Pydantic schemas for CV analysis, ranking, and generation endpoints.

This module defines all request/response models used throughout the API:
- CV parsing and analysis models
- Job description matching schemas
- Visual analysis feedback models
- CV generation and ranking schemas
"""

from pydantic import BaseModel, EmailStr
from typing import List, Optional


# ============================================================================
# CORE ANALYSIS SCHEMAS
# ============================================================================

class ContactInfoSchema(BaseModel):
    """Contact information extracted from CV"""
    name: str
    email: EmailStr
    phone: str
    location: Optional[str] = None



class DetailItemSchema(BaseModel):
    """Individual skill/requirement match detail"""
    skill: Optional[str] = None
    requirement: Optional[str] = None
    match: str
    comment: str


class DetailedAnalysisSchema(BaseModel):
    """Detailed breakdown of CV vs JD analysis"""
    hard_skills: List[DetailItemSchema] = [] 
    soft_skills: List[DetailItemSchema] = []
    experience: List[DetailItemSchema] = []



class CVvsJDAnalysis(BaseModel):
    """Complete CV vs Job Description analysis result"""
    contact_info: Optional[ContactInfoSchema] = None 
    summary: Optional[str] = None 
    strengths: List[str] = []     
    weaknesses: List[str] = []    
    match_score: Optional[int] = None 
    detailed_analysis: Optional[DetailedAnalysisSchema] = None



class CVvsJDResponse(BaseModel):
    """Response model for CV vs JD analysis endpoint"""
    filename: str
    analysis_source: str
    analysis_vs_jd: CVvsJDAnalysis


class ExperienceSchema(BaseModel):
    """Work experience entry from CV"""
    company: str
    title: str
    duration: Optional[str] = None
    details: Optional[str] = None


class EducationSchema(BaseModel):
    """Education entry from CV"""
    institution: str
    degree: str
    duration: Optional[str] = None



class CVOnlyAnalysis(BaseModel):
    """Parsed CV content without job description comparison"""
    full_name: str
    email: EmailStr
    phone: str
    summary: Optional[str] = None
    skills: List[str]
    experience: List[ExperienceSchema]
    education: List[EducationSchema]


class CVOnlyResponse(BaseModel):
    """Response model for CV-only analysis endpoint"""
    filename: str
    analysis_source: str
    analysis: CVOnlyAnalysis




# ============================================================================
# VISUAL ANALYSIS SCHEMAS
# ============================================================================

class VisualFeedback(BaseModel):
    """Visual/design feedback for CV template"""
    layout_score: Optional[int] = None
    layout_notes: Optional[str] = None
    font_choice_notes: Optional[str] = None
    color_scheme_notes: Optional[str] = None
    overall_professionalism: Optional[str] = None
    suggestions: List[str] = []


class VisualAnalysisResponse(BaseModel):
    """Response model for visual analysis endpoint"""
    filename: str
    analysis_type: str = "Visual Analysis"
    feedback: VisualFeedback



class FullAnalysisResponse(BaseModel):
    """Combined text + visual analysis response"""
    filename_pdf: str
    filename_image: Optional[str] = None
    analysis_vs_jd: CVvsJDAnalysis
    visual_analysis: Optional[VisualFeedback] = None


# ============================================================================
# RANKING SCHEMAS (B2B)
# ============================================================================

class RankedAnalysisItem(BaseModel):
    """Single candidate analysis result for ranking"""
    filename: str
    analysis: CVvsJDAnalysis


class FullRankingResponse(BaseModel):
    """Response for bulk candidate ranking endpoint"""
    total_processed: int
    ranked_results: List[RankedAnalysisItem]




# ============================================================================
# CV GENERATION SCHEMAS (B2C)
# ============================================================================

class CVPersonalInfoSchema(BaseModel):
    """Personal information for CV generation"""
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
    """Education entry for CV generation"""
    school: str
    degree: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None


class CVExperienceSchema(BaseModel):
    """Work experience entry for CV generation"""
    company: str
    role: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    description: Optional[str] = None


class CVProjectSchema(BaseModel):
    """Project entry for CV generation"""
    name: str
    description: Optional[str] = None
    url: Optional[str] = None


class CVLanguageSchema(BaseModel):
    """Language proficiency for CV"""
    name: str
    level: str


class CVSkillsSchema(BaseModel):
    """Skills collection for CV generation"""
    hard: List[str] = []
    soft: List[str] = []
    languages: List[CVLanguageSchema] = []
    certifications: List[str] = []


class CVDataSchema(BaseModel):
    """Complete structured CV data for generation"""
    personalInfo: CVPersonalInfoSchema
    education: List[CVEducationSchema] = []
    experience: List[CVExperienceSchema] = []
    projects: List[CVProjectSchema] = []
    skills: CVSkillsSchema = CVSkillsSchema()


class CVGenerateRequest(BaseModel):
    """Request model for CV generation endpoint"""
    cv_data: CVDataSchema
    job_description: Optional[str] = None
    template: Optional[str] = None


class GeneratedCVResponse(BaseModel):
    """Response model for CV generation endpoint"""
    organized_data: dict  # Will contain CVDataSchema-like structure
    ai_summary: Optional[str] = None
    strengths: List[str] = []
    weaknesses: List[str] = []


# ============================================================================
# LEGACY SCHEMAS (Deprecated - keep for backward compatibility)
# ============================================================================

class CVBuildInput(BaseModel):
    """DEPRECATED: Use CVGenerateRequest instead"""
    full_name: str
    email: EmailStr
    phone: str
    raw_description: str
    certificates: List[str] = []
    education: List[str] = []
    experience: List[str] = []


class GeneratedCVData(BaseModel):
    """DEPRECATED: Legacy CV generation response"""
    professional_title: str
    summary: str
    skills_categories: List[dict]
    experience: List[str]
    education: List[str]
    certifications: List[str]


class GeneratedCVStrengths(BaseModel):
    """DEPRECATED: Legacy analysis strengths"""
    key_selling_points: List[str]
    profile_focus: str


class CVBuildResponse(BaseModel):
    """DEPRECATED: Use GeneratedCVResponse instead"""
    generated_cv: GeneratedCVData
    analysis: GeneratedCVStrengths

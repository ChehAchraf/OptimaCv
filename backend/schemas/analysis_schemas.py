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







class PersonalInfoSchema(BaseModel):
    full_name: Optional[str] = ""
    email: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""

class SkillsSchema(BaseModel):
    technical: List[str] = []
    soft: List[str] = []

class ExperienceSchema(BaseModel):
    title: Optional[str] = ""
    company: Optional[str] = ""
    period: Optional[str] = ""
    achievements: List[str] = []

class EducationSchema(BaseModel):
    degree: Optional[str] = ""
    school: Optional[str] = ""
    year: Optional[str] = ""

class ScoreSchema(BaseModel):
    overall: int = 0
    skills_match: int = 0
    clarity: int = 0
    structure: int = 0

class CVOnlyAnalysis(BaseModel):
    personal_info: PersonalInfoSchema
    summary: Optional[str] = ""
    skills: SkillsSchema
    experience: List[ExperienceSchema]
    education: List[EducationSchema]
    languages: List[str] = []
    score: ScoreSchema
    improvements: List[str] = []



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

    

    filename: str

    analysis: CVvsJDAnalysis



class FullRankingResponse(BaseModel):

    

    total_processed: int

    ranked_results: List[RankedAnalysisItem]



class CVBuildInput(BaseModel):

    

    full_name: str

    email: EmailStr

    phone: str

    raw_description: str                                 

    certificates: List[str] = []                             

    education: List[str] = []                                          

    experience: List[str] = []                                          





class GeneratedCVData(BaseModel):


    professional_title: str                                                 

    summary: str                             

    skills_categories: List[dict]                                                             

    experience: List[str]                          

    education: List[str]

    certifications: List[str]



class GeneratedCVStrengths(BaseModel):

   

    key_selling_points: List[str]                                                

    profile_focus: str                           





class CVBuildResponse(BaseModel):


    generated_cv: GeneratedCVData

    analysis: GeneratedCVStrengths


class InterviewQuestion(BaseModel):
    id: int
    question: str
    context: str
    topic: str

class InterviewPrepResponse(BaseModel):
    questions: List[InterviewQuestion]


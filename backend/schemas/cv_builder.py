from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional

class CVPersonalDetail(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    summary: Optional[str] = None
    location: Optional[str] = None

class CVEducation(BaseModel):
    institution: str
    degree: str
    field_of_study: str
    start_date: str
    end_date: Optional[str] = None
    current: bool = False
    description: Optional[str] = None

class CVExperience(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    current: bool = False
    description: str

class CVProject(BaseModel):
    name: str
    description: str
    technologies: List[str]
    link: Optional[str] = None

class CVSkill(BaseModel):
    category: str
    skills: List[str]

class CVFullProfile(BaseModel):
    personal_details: CVPersonalDetail
    education: List[CVEducation] = []
    experience: List[CVExperience] = []
    projects: List[CVProject] = []
    skills: List[CVSkill] = []

class OptimizationRequest(BaseModel):
    text: str
    context: str = "professional experience" # or "summary", "project"
    job_title: Optional[str] = None

class OptimizationResponse(BaseModel):
    original_text: str
    optimized_text: str
    improvements: List[str]

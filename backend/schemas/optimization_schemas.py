from pydantic import BaseModel
from typing import List, Optional

class JobOfferSchema(BaseModel):
    title: str
    company: str
    description: str
    requirements: str
    skills: List[str]
    location: Optional[str] = None
    jobType: Optional[str] = None

class OptimizationRequest(BaseModel):
    jobOffer: JobOfferSchema
    originalText: str
    type: str  # 'experience' or 'project'
    itemTitle: str

class OptimizationResponse(BaseModel):
    optimizedText: str
    improvements: List[str]
    matchScore: int
from pydantic import BaseModel
from typing import List, Optional, Literal

class InterviewInitResponse(BaseModel):
    session_id: str
    initial_questions: List[str]

class TranscriptChunk(BaseModel):
    text: str
    timestamp_ms: int

class BehaviorMetrics(BaseModel):
    wpm: Optional[float] = None
    filler_rate_per_min: Optional[float] = None
    avg_pause_ms: Optional[float] = None
    gaze_ratio: Optional[float] = None
    smile_ratio: Optional[float] = None
    head_pose_var: Optional[float] = None

class WSClientMessage(BaseModel):
    type: Literal["transcript", "metrics", "control"]
    text: Optional[str] = None
    timestamp_ms: Optional[int] = None
    payload: Optional[dict] = None
    action: Optional[str] = None

class WSServerMessage(BaseModel):
    type: Literal["question", "info"]
    text: str
    followup: Optional[bool] = None

class InterviewScore(BaseModel):
    content: int
    structure: int
    clarity: int
    confidence: int
    stress: int
    body_language: int
    overall: int

class InterviewReport(BaseModel):
    scores: InterviewScore
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
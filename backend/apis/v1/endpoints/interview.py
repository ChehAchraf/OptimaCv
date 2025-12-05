import shutil
import os
import tempfile
import json
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from backend.core.config import settings

router = APIRouter()

# Configure Gemini
genai.configure(api_key=settings.GOOGLE_API_KEY)

class InterviewAnalysisResponse(BaseModel):
    feedback: str
    score: int
    next_question_suggestion: str

@router.post("/analyze-answer", response_model=InterviewAnalysisResponse)
async def analyze_interview_answer(
    audio_file: UploadFile = File(...),
    video_analysis: str = Form(...),
    question_context: str = Form(...)
):
    try:
        # 1. Save audio file temporarily
        # We need a physical file to upload to Gemini
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.filename)[1]) as tmp:
            shutil.copyfileobj(audio_file.file, tmp)
            tmp_path = tmp.name

        try:
            # 2. Upload to Gemini
            # Gemini 1.5 Flash supports audio files directly
            uploaded_file = genai.upload_file(tmp_path, mime_type=audio_file.content_type or "audio/webm")
            
            # 3. Call Service (with Retry Logic)
            result = await gemini_service.analyze_interview_answer(
                audio_file=uploaded_file,
                video_analysis=video_analysis,
                question_context=question_context
            )
            
            return InterviewAnalysisResponse(
                feedback=result.get("feedback", "No feedback generated."),
                score=result.get("score", 0),
                next_question_suggestion=result.get("next_question_suggestion", "Tell me more about yourself.")
            )

        finally:
            # Cleanup temp file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
            # Cleanup Gemini file (optional, but good practice if high volume)
            # genai.delete_file(uploaded_file.name)

    except Exception as e:
        print(f"Error processing interview answer: {e}")
        raise HTTPException(status_code=500, detail=str(e))


from backend.services.pdf_service import pdf_service
from backend.services.gemini_service import gemini_service
from backend.schemas.analysis_schemas import InterviewPrepResponse

@router.post("/init-session", response_model=InterviewPrepResponse)
async def init_interview_session(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Initializes an interview session by analyzing the resume vs job description
    and generating relevant questions.
    """
    try:
        # 1. Read and Parse PDF
        if resume.content_type != "application/pdf":
             raise HTTPException(status_code=400, detail="Only PDF files are supported for resumes.")
        
        content = await resume.read()
        try:
            cv_text = pdf_service.parse_text(content)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        # 2. Generate Questions via Gemini
        result = await gemini_service.generate_interview_questions(cv_text, job_description)
        
        if not result or "questions" not in result:
             raise HTTPException(status_code=500, detail="Failed to generate interview questions.")

        return InterviewPrepResponse(questions=result["questions"])

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error initializing interview session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

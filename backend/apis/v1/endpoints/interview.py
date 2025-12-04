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
            
            # 3. Prepare the prompt
            # We parse the video analysis JSON to make it readable for the LLM
            try:
                video_stats = json.loads(video_analysis)
                video_context = json.dumps(video_stats, indent=2)
            except:
                video_context = video_analysis

            prompt = f"""
            You are an expert Interview Coach.
            
            **Context:**
            The candidate was asked: "{question_context}"
            
            **Input:**
            1. An audio recording of their answer.
            2. Body Language Analysis (from computer vision):
            {video_context}
            
            **Task:**
            Analyze the candidate's performance.
            - Listen to the audio for content quality, clarity, and confidence.
            - Cross-reference with the body language stats. For example, if 'eye_contact_score' is low, mention that they should look at the camera more. If they seem nervous based on the audio or video stats, give advice on that.
            
            **Output:**
            Return a JSON object with this exact schema:
            {{
                "feedback": "A concise paragraph (3-4 sentences) giving specific, actionable advice.",
                "score": <integer 0-10>,
                "next_question_suggestion": "A relevant follow-up interview question."
            }}
            """

            # 4. Generate Content
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(
                [prompt, uploaded_file],
                generation_config={"response_mime_type": "application/json"}
            )
            
            # 5. Parse Response
            result = json.loads(response.text)
            
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

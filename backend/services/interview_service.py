from typing import List, Dict, Any
from backend.services.pdf_service import pdf_service
from backend.services.gemini_service import gemini_service

class InterviewService:
    def __init__(self):
        # Simple in-memory store for MVP
        self.sessions: Dict[str, Dict[str, Any]] = {}

    async def create_session(self, session_id: str, cv_pdf_bytes: bytes, job_description: str) -> List[str]:
        cv_text = pdf_service.parse_text(cv_pdf_bytes)
        seed_prompt = f"""
        You are a professional interviewer. Based on the CV and JD, generate 3 initial, specific questions.
        Return JSON: {{ "questions": ["q1","q2","q3"] }}.
        CV:
        ---
        {cv_text}
        ---
        JD:
        ---
        {job_description}
        ---
        """
        resp = await gemini_service.model_pro.generate_content_async(seed_prompt)
        from json import loads
        initial = []
        try:
            data = loads(gemini_service._clean_json_response(resp.text))
            initial = data.get("questions", [])[:3]
        except Exception:
            initial = ["Tell me about yourself.", "What makes you a fit for this role?", "Describe a recent project relevant to the JD."]
        self.sessions[session_id] = {
            "cv_text": cv_text,
            "jd_text": job_description,
            "history": [],           # list of {role, text}
            "asked": initial[:],     # asked questions
            "transcript": [],        # list of {text, ts}
            "metrics": []            # list of metrics snapshots
        }
        return initial

    async def next_question(self, session_id: str) -> str:
        s = self.sessions.get(session_id)
        if not s: return "Session not found."
        convo = "\n".join([f"{h['role']}: {h['text']}" for h in s["history"]][-20:])
        metrics_summary = {}
        if s["metrics"]:
            metrics_summary = s["metrics"][-1]
        prompt = f"""
        You are a structured interviewer. Given CV, JD, conversation, and last metrics, ask exactly ONE next question.
        Prefer targeted follow-ups. Return only the question text.
        CV: {s['cv_text'][:4000]}
        JD: {s['jd_text'][:4000]}
        Conversation:
        {convo}
        LastMetrics: {metrics_summary}
        """
        resp = await gemini_service.model_pro.generate_content_async(prompt)
        return resp.text.strip().replace('"', '').strip()

    async def finalize(self, session_id: str) -> Dict[str, Any]:
        s = self.sessions.get(session_id)
        if not s: return {}
        transcript_text = "\n".join([t["text"] for t in s["transcript"]])
        prompt = f"""
        You are an interview evaluator. Score the candidate with this schema (0-10 each):
        content, structure, clarity, confidence, stress, body_language, overall.
        Provide strengths, weaknesses, recommendations, and a one-paragraph summary.
        Return JSON:
        {{
          "scores": {{
            "content": 0, "structure": 0, "clarity": 0, "confidence": 0, "stress": 0, "body_language": 0, "overall": 0
          }},
          "summary": "...",
          "strengths": ["..."],
          "weaknesses": ["..."],
          "recommendations": ["..."]
        }}
        Transcript:
        ---
        {transcript_text[:12000]}
        ---
        JD:
        ---
        {s['jd_text'][:4000]}
        ---
        Consider filler words, STAR, prosody hints from metrics (if any).
        """
        resp = await gemini_service.model_pro.generate_content_async(prompt)
        from json import loads
        try:
            return loads(gemini_service._clean_json_response(resp.text))
        except Exception:
            return {
                "scores": {"content": 5, "structure": 5, "clarity": 5, "confidence": 5, "stress": 5, "body_language": 5, "overall": 5},
                "summary": "Baseline evaluation (fallback).",
                "strengths": [],
                "weaknesses": [],
                "recommendations": []
            }

interview_service = InterviewService()
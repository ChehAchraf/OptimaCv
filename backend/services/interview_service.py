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
        You are an experienced HR interviewer (non-technical).
        Generate exactly THREE concise behavioral questions (no coding, no project deep-dives).
        Focus on soft skills, teamwork, conflict resolution, motivation, communication, time management,
        alignment with the role, and growth mindset.

        Return ONLY this JSON:
        {{ "questions": ["Q1", "Q2", "Q3"] }}

        Context (for personalization, don't ask about specific projects):
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
        initial: List[str] = []
        try:
            data = loads(gemini_service._clean_json_response(resp.text))
            initial = (data.get("questions", []) or [])[:3]
        except Exception:
            initial = [
                "Tell me about a time you handled a conflict within a team and what you learned.",
                "What motivates you in a role like this, and how do you stay motivated during challenges?",
                "Describe how you structure your time when priorities compete and deadlines are tight."
            ]

        self.sessions[session_id] = {
            "cv_text": cv_text,
            "jd_text": job_description,
            "history": [],           # list of {role, text}
            "asked": initial[:],     # fixed set of 3 HR questions
            "q_index": 0,            # next question index to send
            "transcript": [],        # list of {text, ts}
            "metrics": []            # list of metrics snapshots
        }
        return initial

    async def next_question(self, session_id: str) -> str:
        # Optional: not used in the new WS flow, kept for compatibility
        s = self.sessions.get(session_id)
        if not s:
            return "Session not found."
        idx = s.get("q_index", 0)
        if idx < len(s.get("asked", [])):
            return s["asked"][idx]
        return "No more questions."

    async def finalize(self, session_id: str) -> Dict[str, Any]:
        s = self.sessions.get(session_id)
        if not s:
            return {}
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
                "scores": {
                    "content": 5, "structure": 5, "clarity": 5,
                    "confidence": 5, "stress": 5, "body_language": 5, "overall": 5
                },
                "summary": "Baseline evaluation (fallback).",
                "strengths": [],
                "weaknesses": [],
                "recommendations": []
            }


interview_service = InterviewService()
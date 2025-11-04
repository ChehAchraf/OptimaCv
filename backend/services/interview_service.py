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
        Tu es un recruteur RH (non technique). Produis exactement DEUX questions comportementales concises en FRANÇAIS.
        Aucune question technique et pas d'approfondissement de projets spécifiques.
        Concentre-toi sur les soft skills, le travail d'équipe, la gestion de conflit, la motivation, la communication,
        la gestion du temps, l'alignement avec le rôle et l'état d'esprit de progression.

        Renvoie UNIQUEMENT ce JSON:
        {{ "questions": ["Q1", "Q2"] }}

        Contexte (pour personnaliser sans citer de projet précis):
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
            initial = (data.get("questions", []) or [])[:2]   # <- 2 max
        except Exception:
            initial = [
                "Parle-moi d’un conflit que tu as géré au sein d’une équipe et ce que tu en as retenu.",
                "Qu’est-ce qui te motive dans ce poste et comment gardes-tu cette motivation face aux difficultés ?",
            ]
        self.sessions[session_id] = {
            "cv_text": cv_text,
            "jd_text": job_description,
            "history": [],
            "asked": initial[:],     # now 2 questions
            "q_index": 0,
            "transcript": [],
            "metrics": []
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
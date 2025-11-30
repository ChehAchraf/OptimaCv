import google.generativeai as genai
from backend.core.config import settings
import json
from typing import List

class OptimizationService:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("Google API Key not configured.")
        try:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.5-pro')
        except Exception as e:
            raise ValueError(f"Failed to configure Gemini: {e}")

    def _clean_json_response(self, raw_text: str) -> str:
        cleaned = raw_text.strip().replace("```json", "").replace("```", "")
        return cleaned.strip()

    async def optimize_text(self, text: str, context: str, job_title: str = None) -> dict:
        
        prompt_context = ""
        if job_title:
            prompt_context = f"for a {job_title} role"

        prompt = f"""
        You are an expert professional resume writer.
        Your task is to OPTIMIZE the following text {prompt_context}.
        The text is part of the user's {context} section.

        Make it more professional, action-oriented, and impactful. Use strong verbs and quantify achievements where possible.
        Keep the meaning but improve the delivery.

        Return a JSON object with this *exact* structure:
        {{
            "optimized_text": "The rewritten version...",
            "improvements": ["List of 2-3 key improvements made"]
        }}

        Original Text:
        ---
        {text}
        ---
        """

        try:
            response = await self.model.generate_content_async(prompt)
            cleaned_text = self._clean_json_response(response.text)
            return json.loads(cleaned_text)
        except Exception as e:
            print(f"Optimization error: {e}")
            return {
                "optimized_text": text,
                "improvements": ["Failed to optimize due to error."]
            }

optimization_service = OptimizationService(api_key=settings.GOOGLE_API_KEY)

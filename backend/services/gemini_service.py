import google.generativeai as genai
from backend.core.config import settings
import json
import PIL.Image
import io
import asyncio

class GeminiService:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("Google API Key not configured.")
        try:
            genai.configure(api_key=api_key)
        except Exception as e:
            raise ValueError(f"Failed to configure Gemini: {e}")

        self.generation_config = {"response_mime_type": "application/json"}
        
        self.model_flash = genai.GenerativeModel(
            'models/gemini-flash-latest',
            generation_config=self.generation_config
        )
        self.model_pro = genai.GenerativeModel(
            'models/gemini-pro-latest',
            generation_config=self.generation_config
        )
        self.model_pro_vision = genai.GenerativeModel('models/gemini-pro-latest')

    def _clean_json_response(self, raw_text: str) -> str:
        """
        Kills the ```json markdown block and other unwanted chars
        """
        cleaned = raw_text.strip().replace("```json", "").replace("```", "")
        return cleaned.strip()


    async def analyze_cv_only(self, cv_text: str) -> dict:
        prompt = f"""
        Analyze the following CV text and return a JSON object with this *exact* structure:
        {{
            "full_name": "Full Name", "email": "email@example.com", "phone": "+123456",
            "summary": "...", "skills": ["Skill 1"],
            "experience": [{{ "company": "Company", "title": "Job Title", "duration": "Date - Date", "details": "..." }}],
            "education": [{{ "institution": "University", "degree": "Degree", "duration": "Date - Date" }}]
        }}
        CV Text: --- {cv_text} ---
        """
        response = await self.model_flash.generate_content_async(prompt) 
        print("--- 💡 RAW GEMINI (CV Only) RESPONSE 💡 ---")
        cleaned_text = self._clean_json_response(response.text)
        try:
            return json.loads(cleaned_text)
        except json.JSONDecodeError:
            print(f"--- 🔴 ERROR: Failed to parse cleaned CV-ONLY JSON: {cleaned_text} 🔴 ---")
            return {}

    async def generate_text(self, prompt: str) -> str:
        """
        Generic text generation using Gemini.
        """
        # Use a model without the JSON-only config for plain text generation
        text_model = genai.GenerativeModel('models/gemini-pro-latest')
        response = await text_model.generate_content_async(prompt)
        return response.text

    async def analyze_cv_vs_jd(self, cv_text: str, jd_text: str) -> dict:
        
        prompt_in_english = f"""
        You are an expert ATS (Applicant Tracking System) analyzer and a professional career coach.
        Your task is to analyze the given CV text and compare it against the provided Job Description.
        
        Return a JSON object with this *exact* structure. Do not add any other text.
        The "match_score" must be an integer (number) between 0 and 100.
        
        {{
            "contact_info": {{
                "name": "Full Name",
                "email": "email@example.com",
                "phone": "+123456",
                "location": "City, Country"
            }},
            "summary": "A brief one-paragraph summary of the candidate's fit for the role.",
            "strengths": [
                "A list of strings highlighting what matches well."
            ],
            "weaknesses": [
                "A list of strings identifying key missing elements."
            ],
            "match_score": 85, 
            "detailed_analysis": {{
                "hard_skills": [
                    {{ "skill": "Skill Name from CV", "match": "High/Medium/Low/No", "comment": "Your reasoning." }}
                ],
                "soft_skills": [
                    {{ "skill": "Skill Requirement from JD", "match": "High/Medium/Low/No", "comment": "Your reasoning." }}
                ],
                "experience": [
                    {{ "requirement": "Job Requirement (e.g., '3+ years')", "match": "Yes/No/Partial", "comment": "Your reasoning." }}
                ]
            }}
        }}

        Here is the CV text:
        ---
        {cv_text}
        ---

        Here is the Job Description:
        ---
        {jd_text}
        ---
        """
        
        response = await self.model_pro.generate_content_async(prompt_in_english)
        
        print("--- 💡 RAW GEMINI (Text vs JD) RESPONSE 💡 ---")
        cleaned_text = self._clean_json_response(response.text)
        try:
            return json.loads(cleaned_text)
        except json.JSONDecodeError:
            print(f"--- 🔴 ERROR: Failed to parse cleaned CV-vs-JD JSON: {cleaned_text} 🔴 ---")
            return {}
        print("---------------------------------------------")

        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            print("--- 🔴 ERROR: Gemini did not return valid JSON! 🔴 ---")
            return {}


    async def analyze_cv_visuals(self, image_bytes: bytes) -> dict:
        try:
            img = PIL.Image.open(io.BytesIO(image_bytes))
        except Exception as e:
            raise ValueError(f"Invalid image file: {e}")

        prompt = f"""
        You are an expert UI/UX designer and professional resume reviewer. 
        Analyze the *visual design and layout* of this CV image. 
        Return a JSON object with this *exact* structure:
        {{
            "layout_score": 8,
            "layout_notes": "Your analysis on whitespace, alignment, and structure.",
            "font_choice_notes": "Your analysis on font type, size, and readability.",
            "color_scheme_notes": "Your analysis on the use of color.",
            "overall_professionalism": "A brief summary of the design's professionalism.",
            "suggestions": [
                "Actionable suggestion 1.",
                "Actionable suggestion 2."
            ]
        }}
        """
        try:
            response = await self.model_pro_vision.generate_content_async([prompt, img])
            
            print("--- 💡 RAW GEMINI (Visual) RESPONSE 💡 ---")
            cleaned_text = self._clean_json_response(response.text)
            try:
                return json.loads(cleaned_text)
            except json.JSONDecodeError:
                print(f"--- 🔴 ERROR: Failed to parse cleaned VISUAL JSON: {cleaned_text} 🔴 ---")
                return None
            print("--------------------------------------------")

            try:
                return json.loads(response.text)
            except json.JSONDecodeError:
                print(f"--- 🔴 ERROR: Gemini (Visual) returned invalid JSON: {response.text} 🔴 ---")
                return None
        
        except Exception as e:
            print(f"Gemini content generation error: {e}")
            return None

gemini_service = GeminiService(api_key=settings.GOOGLE_API_KEY)
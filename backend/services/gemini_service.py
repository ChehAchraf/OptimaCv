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
            "experience": [{{  "company": "Company", "title": "Job Title", "duration": "Date - Date", "details": "..." }} ],
            "education": [{{  "institution": "University", "degree": "Degree", "duration": "Date - Date" }} ]
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
            }} ,
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
                    {{  "skill": "Skill Name from CV", "match": "High/Medium/Low/No", "comment": "Your reasoning." }} 
                ],
                "soft_skills": [
                    {{  "skill": "Skill Requirement from JD", "match": "High/Medium/Low/No", "comment": "Your reasoning." }} 
                ],
                "experience": [
                    {{  "requirement": "Job Requirement (e.g., '3+ years')", "match": "Yes/No/Partial", "comment": "Your reasoning." }} 
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



    async def generate_cv_from_data(self, user_data: dict) -> dict:
                                                         

        prompt = f"""
        You are an expert HR consultant and professional CV writer.
        A user has provided raw data and wants you to build a professional CV profile from it.
        
        **Your most important task is to ANALYZE the 'certificates' and 'raw_description' to INFER the user's primary professional profile.**
        Do not just list the certificates. *Use them* to build the 'professional_title', 'summary', and 'skills_categories'.
        
        For example, if certificates include 'AWS' and 'Docker', the profile is 'Cloud/DevOps', not just 'IT'.
        
        **INPUT DATA:**
        {json.dumps(user_data, indent=2)}
        
        **YOUR TASK:**
        Return a *single* JSON object with the following *exact* structure.
        Do not add any text outside the JSON block.

        {{
          "generated_cv": {{
            "professional_title": "(Infer this from the data, e.g., 'Développeur Full Stack spécialisé React')",
            "summary": "(Write a compelling, professional summary based on the raw description and certificates)",
            "skills_categories": [
              {{  
                "category": "(e.g., 'Cloud & DevOps')", 
                "skills": ["(e.g., 'AWS', 'Docker', 'Kubernetes')"] 
              }} ,
              {{  
                "category": "(e.g., 'Backend')", 
                "skills": ["(e.g., 'Node.js', 'Python')"] 
              }} 
            ],
            "experience": ["(Re-write the user's 'experience' list professionally)"],
            "education": ["(Re-write the user's 'education' list professionally)"],
            "certifications": ["(List the user's 'certificates' here)"]
          }} ,
          "analysis": {{ 
            "key_selling_points": [
                "(List 3-4 key strengths of the CV you just generated. e.g., 'Forte spécialisation en...', 'Cohérence entre les certifications et les projets.')"
            ],
            "profile_focus": "(The main focus area, e.g., 'Cloud & DevOps')"
          }} 
        }}
        """



                                          

        

                                                   

        response = await self.model_pro.generate_content_async(prompt)

        

        print(f"--- 💡 RAW CV BUILDER RESPONSE 💡 ---\n{response.text}\n---------------------------------")

        

        cleaned_text = self._clean_json_response(response.text)

        try:

            return json.loads(cleaned_text)

        except json.JSONDecodeError:

            print(f"--- 🔴 ERROR: Failed to parse CV Builder JSON: {cleaned_text} 🔴 ---")

            return {}                        

gemini_service = GeminiService(api_key=settings.GOOGLE_API_KEY)

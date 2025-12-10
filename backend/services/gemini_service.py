import google.generativeai as genai
from backend.core.config import settings
import json
import PIL.Image
import io
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type, RetryError
from google.api_core.exceptions import ResourceExhausted, ServiceUnavailable

class GeminiService:

    def __init__(self, api_key: str):

        if not api_key:

            raise ValueError("Google API Key not configured.")

        try:

            genai.configure(api_key=api_key)

            # Initialize the Gemini models
            # Primary: gemini-2.5 series
            self.model_flash = genai.GenerativeModel("models/gemini-2.5-flash")
            self.model_pro = genai.GenerativeModel("models/gemini-2.5-pro")
            self.model_pro_vision = genai.GenerativeModel("models/gemini-2.5-pro")
            
            # Fallback: gemini-2.5-flash-lite
            self.model_fallback = genai.GenerativeModel("models/gemini-2.5-flash-lite")

        except Exception as e:

            raise ValueError(f"Failed to configure Gemini: {e}")


    def _clean_json_response(self, raw_text: str) -> str:
        """
        Kills the ```json markdown block and other unwanted chars
        """

        cleaned = raw_text.strip().replace("```json", "").replace("```", "")

        return cleaned.strip()

    @retry(
        retry=retry_if_exception_type((ResourceExhausted, ServiceUnavailable)),
        wait=wait_exponential(multiplier=2, min=2, max=10),
        stop=stop_after_attempt(3) # Reduced to 3 to failover faster
    )
    async def _generate_content_with_retry(self, model, contents, generation_config=None):
        """
        Helper method to generate content with retry logic.
        """
        if generation_config:
            return await model.generate_content_async(contents, generation_config=generation_config)
        return await model.generate_content_async(contents)


    async def analyze_cv_only(self, cv_text: str) -> dict:

        prompt = f"""
        Analyze the following CV and return ONLY a JSON object with no explanations and no text outside the JSON.

        The JSON must follow exactly this structure:

        {{
          "personal_info": {{
            "full_name": "",
            "email": "",
            "phone": "",
            "location": ""
          }},
          "summary": "",
          "skills": {{
            "technical": [],
            "soft": []
          }},
          "experience": [
            {{
              "title": "",
              "company": "",
              "period": "",
              "achievements": []
            }}
          ],
          "education": [
            {{
              "degree": "",
              "school": "",
              "year": ""
            }}
          ],
          "languages": [],
          "score": {{
            "overall": 0,
            "skills_match": 0,
            "clarity": 0,
            "structure": 0
          }},
          "improvements": []
        }}

        Rules:
        - Return ONLY valid JSON.
        - Do NOT include Markdown.
        - Do NOT add commentary.
        - If information is missing, leave the field empty.
        - Arrays must never contain null values.
        - Do not invent false details.
        - Base everything strictly on the CV content.

        CV CONTENT:
        ---------------
        {cv_text}
        """

        try:
            response = await self._generate_content_with_retry(self.model_flash, prompt)
        except RetryError:
            print("--- ⚠️ WARNING: Primary model exhausted. Switching to Fallback (CV Only) ⚠️ ---")
            try:
                response = await self._generate_content_with_retry(self.model_fallback, prompt)
            except RetryError:
                raise ValueError("Service temporarily unavailable: AI Model Quota Exceeded. Please try again later.")

        print("--- 💡 RAW GEMINI (CV Only) RESPONSE 💡 ---")

        cleaned_text = self._clean_json_response(response.text)

        try:

            return json.loads(cleaned_text)

        except json.JSONDecodeError:

            print(f"--- 🔴 ERROR: Failed to parse cleaned CV-ONLY JSON: {cleaned_text} 🔴 ---")

            return {}


    async def analyze_cv_with_coach(self, cv_text: str, jd_text: str = None) -> dict:
        context_part = f"CV CONTENT:\n---\n{cv_text}\n---"
        if jd_text:
            context_part += f"\n\nJOB DESCRIPTION:\n---\n{jd_text}\n---"

        prompt = f"""
        **Role:** You are an expert AI Resume Analyst and Career Coach with 20 years of experience in HR and recruitment.

        **Objective:** Analyze the user's CV content and provide structured, actionable, and empathetic feedback to improve their chances of getting hired.

        **Strict Output Rules:**
        1.  You must respond ONLY in a valid **JSON format**.
        2.  Do not include any text, markdown, or explanations outside the JSON block.
        3.  The tone must be professional, encouraging, and constructive (User Experience focus).
        4.  Language: Detect the language of the CV (English or French) and respond in the SAME language.

        **JSON Schema Structure:**
        {{
          "overall_score": (integer 0-100),
          "score_breakdown": {{
            "impact": (integer 0-100),
            "brevity": (integer 0-100),
            "style": (integer 0-100),
            "structure": (integer 0-100)
          }},
          "summary_feedback": "A short, 2-sentence empathetic summary of the CV.",
          "key_strengths": ["string", "string", "string"],
          "critical_improvements": [
            {{
              "section": "e.g., Experience",
              "issue": "e.g., Lack of quantifiable metrics",
              "fix": "e.g., Use numbers like 'increased sales by 20%'"
            }}
          ],
          "ats_keywords_missing": ["string", "string", "string"],
          "job_title_detected": "string or null"
        }}

        {context_part}
        """

        try:
            response = await self._generate_content_with_retry(self.model_pro, prompt)
        except RetryError:
            print("--- ⚠️ WARNING: Primary model exhausted. Switching to Fallback (Coach) ⚠️ ---")
            try:
                response = await self._generate_content_with_retry(self.model_fallback, prompt)
            except RetryError:
                 raise ValueError("Service temporarily unavailable: AI Model Quota Exceeded. Please try again later.")

        print("--- 💡 RAW GEMINI (Coach) RESPONSE 💡 ---")
        cleaned_text = self._clean_json_response(response.text)
        
        try:
            return json.loads(cleaned_text)
        except json.JSONDecodeError:
            print(f"--- 🔴 ERROR: Failed to parse cleaned Coach JSON: {cleaned_text} 🔴 ---")
            return {}


    async def analyze_cv_for_recruiter(self, cv_text: str, jd_text: str) -> dict:
        prompt = f"""
        **Role:** You are a Senior Technical Recruiter and Talent Acquisition Specialist for a top-tier tech company.

        **Objective:** Evaluate a candidate's CV against a provided Job Description (JD) to determine their suitability for the role.

        **Strict Output Rules:**
        1.  You must respond ONLY in a valid **JSON format**.
        2.  Do not include any text, markdown, or explanations outside the JSON block.
        3.  The tone must be objective, analytical, and decisional (Recruiter focus).
        4.  Language: Output strictly in English (standard business language for internal HR reports).

        **JSON Schema Structure:**
        {{
          "contact_info": {{
            "name": "string",
            "email": "string",
            "phone": "string",
            "location": "string"
          }},
          "match_percentage": (integer 0-100),
          "hiring_recommendation": "Strong Hire" | "Interview" | "Backup" | "Reject",
          "executive_summary": "A 2-sentence objective summary of the candidate's fit for the hiring manager.",
          "fit_analysis": {{
            "technical_skills_match": (integer 0-100),
            "experience_relevance": (integer 0-100),
            "cultural_culture_fit": (integer 0-100),
            "education_requirements": "Met" | "Not Met" | "Exceeded"
          }},
          "key_strengths": ["string", "string", "string"],
          "gaps_and_red_flags": [
            {{
              "severity": "High" | "Medium" | "Low",
              "issue": "e.g., Employment gap of 2 years",
              "detail": "e.g., Unexplained gap between 2021 and 2023"
            }}
          ],
          "missing_critical_skills": ["string", "string"],
          "suggested_interview_questions": [
            {{
              "focus_area": "e.g., React Performance",
              "question": "e.g., I see you used React, but the project scale isn't clear. How did you handle re-renders in large lists?"
            }},
             {{
              "focus_area": "string",
              "question": "string"
            }}
          ]
        }}

        CV CONTENT:
        ---
        {cv_text}
        ---

        JOB DESCRIPTION:
        ---
        {jd_text}
        ---
        """

        try:
            response = await self._generate_content_with_retry(self.model_pro, prompt)
        except RetryError:
            print("--- ⚠️ WARNING: Primary model exhausted. Switching to Fallback (Recruiter) ⚠️ ---")
            try:
                response = await self._generate_content_with_retry(self.model_fallback, prompt)
            except RetryError:
                 raise ValueError("Service temporarily unavailable: AI Model Quota Exceeded. Please try again later.")

        print("--- 💡 RAW GEMINI (Recruiter) RESPONSE 💡 ---")
        cleaned_text = self._clean_json_response(response.text)
        
        try:
            return json.loads(cleaned_text)
        except json.JSONDecodeError:
            print(f"--- 🔴 ERROR: Failed to parse cleaned Recruiter JSON: {cleaned_text} 🔴 ---")
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

        
        try:
            response = await self._generate_content_with_retry(self.model_pro, prompt_in_english)
        except RetryError:
            print("--- ⚠️ WARNING: Primary model exhausted. Switching to Fallback (CV vs JD) ⚠️ ---")
            try:
                response = await self._generate_content_with_retry(self.model_fallback, prompt_in_english)
            except RetryError:
                 raise ValueError("Service temporarily unavailable: AI Model Quota Exceeded. Please try again later.")

        

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

            try:
                response = await self._generate_content_with_retry(self.model_pro_vision, [prompt, img])
            except RetryError:
                print("--- ⚠️ WARNING: Primary model exhausted. Switching to Fallback (Visual) ⚠️ ---")
                try:
                    response = await self._generate_content_with_retry(self.model_fallback, [prompt, img])
                except RetryError:
                     raise ValueError("Service temporarily unavailable: AI Model Quota Exceeded. Please try again later.")

            

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



    async def generate_profile_summary(self, data: dict) -> str:
        prompt = f"""
        You are a professional CV writer.
        Based on the following information, write a compelling, 3-4 sentence professional summary focusing on the candidate's value proposition.
        
        Candidate Name: {data.get("full_name", "")}
        Job Title: {data.get("job_title", "")}
        Experience Level: {data.get("experience_level", "")}
        Skills: {", ".join(data.get("skills", []))}
        
        The summary should be written in the first person (implied) or third person as is standard for CVs, but keep it engaging.
        Do NOT mention the name in the text.
        Do NOT include "Summary:" or any labels. just the text.
        """

        try:
            response = await self._generate_content_with_retry(self.model_flash, prompt)
        except RetryError:
            try:
                response = await self._generate_content_with_retry(self.model_fallback, prompt)
            except RetryError:
                raise ValueError("Service temporarily unavailable: AI Model Quota Exceeded. Please try again later.")
            
        return response.text.strip()


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



                                          

        

                                                   
        try:
            response = await self._generate_content_with_retry(self.model_pro, prompt)
        except RetryError:
            print("--- ⚠️ WARNING: Primary model exhausted. Switching to Fallback (CV Builder) ⚠️ ---")
            try:
                response = await self._generate_content_with_retry(self.model_fallback, prompt)
            except RetryError:
                 raise ValueError("Service temporarily unavailable: AI Model Quota Exceeded. Please try again later.")

        

        print(f"--- 💡 RAW CV BUILDER RESPONSE 💡 ---\n{response.text}\n---------------------------------")

        

        cleaned_text = self._clean_json_response(response.text)

        try:

            return json.loads(cleaned_text)

        except json.JSONDecodeError:

            print(f"--- 🔴 ERROR: Failed to parse CV Builder JSON: {cleaned_text} 🔴 ---")

            return {}


    async def generate_interview_questions(self, cv_text: str, jd_text: str) -> dict:
        """
        Generates 5 interview questions based on CV and JD.
        """
        prompt = f"""
        You are an Expert Technical Recruiter and Hiring Manager.
        
        **Task:**
        Generate 5 distinct interview questions to assess a candidate based on their CV and the Job Description.
        
        **Inputs:**
        1. **Candidate CV:**
        {cv_text[:10000]} (truncated if too long)
        
        2. **Job Description:**
        {jd_text[:5000]} (truncated if too long)
        
        **Requirements:**
        - Create a mix of **Technical** (hard skills) and **Behavioral** (soft skills/culture fit) questions.
        - For each question, provide a brief 'context' explaining WHY you are asking it (e.g., "To verify their experience with React hooks mentioned in the CV").
        - Assign a 'topic' (e.g., "Frontend Architecture", "Conflict Resolution").
        
        **Output Format:**
        Return a JSON object with this EXACT structure:
        {{
            "questions": [
                {{
                    "id": 1,
                    "question": "The actual question text...",
                    "context": "Reasoning for asking...",
                    "topic": "Category"
                }},
                ...
            ]
        }}
        """

        try:
            try:
                response = await self._generate_content_with_retry(self.model_flash, prompt)
            except RetryError:
                print("--- ⚠️ WARNING: Primary model exhausted. Switching to Fallback (Questions) ⚠️ ---")
                try:
                    response = await self._generate_content_with_retry(self.model_fallback, prompt)
                except RetryError:
                    print("--- 🔴 Critical: All models exhausted for Interview Questions 🔴 ---")
                    return {"questions": []}
            
            cleaned_text = self._clean_json_response(response.text)
            return json.loads(cleaned_text)
        except Exception as e:
            print(f"Error generating interview questions: {e}")
            # Return a fallback or empty structure to avoid crashing
            return {"questions": []}


    async def analyze_interview_answer(self, audio_file, video_analysis: str, question_context: str) -> dict:
        """
        Analyzes an interview answer (audio + video stats).
        """
        
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

        # Generate Content
        try:
            response = await self._generate_content_with_retry(
                self.model_flash, 
                [prompt, audio_file],
                generation_config={"response_mime_type": "application/json"}
            )
        except RetryError:
             print("--- ⚠️ WARNING: Primary model exhausted. Switching to Fallback (Answer Analysis) ⚠️ ---")
             try:
                 response = await self._generate_content_with_retry(
                    self.model_fallback, 
                    [prompt, audio_file],
                    generation_config={"response_mime_type": "application/json"}
                )
             except RetryError:
                  raise ValueError("Service temporarily unavailable: AI Model Quota Exceeded. Please try again later.")
        
        # Parse Response
        return json.loads(response.text)


gemini_service = GeminiService(api_key=settings.GOOGLE_API_KEY)

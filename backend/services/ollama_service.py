"""Ollama provider integration.

This module wraps the Ollama client and provides async-friendly helper methods
the application expects. It attempts to keep responses strict (JSON-only)
when used for structured analysis (CV parsing, CV vs JD) and provides a
generic `query` method for free-form generation.

Important notes:
- `_generate_async` bridges the synchronous Ollama Python client by running
    its call inside `asyncio.get_event_loop().run_in_executor` so other async
    tasks are not blocked.
- `_clean_json_response` tries to remove markdown fencing like ```json so
    downstream `json.loads` calls succeed when the model emits code blocks.
"""

import ollama
import json
import base64
from typing import Dict, Any, Optional
from backend.core.config import settings
import asyncio
import httpx

class OllamaService:
    def __init__(self, host: str = None, model: str = None):
        self.host = host or settings.OLLAMA_HOST
        self.model = model or settings.OLLAMA_MODEL
        self.client = ollama.Client(host=self.host)
        
    def _clean_json_response(self, raw_text: str) -> str:
        """
        Clean the response from markdown blocks and other unwanted chars
        """
        cleaned = raw_text.strip()
        # Remove markdown code blocks
        if "```json" in cleaned:
            cleaned = cleaned.split("```json")[1]
        if "```" in cleaned:
            cleaned = cleaned.split("```")[0]
        return cleaned.strip()

    async def _generate_async(self, prompt: str, system_prompt: str = None) -> str:
        """
        Generate response using Ollama with async support
        """
        try:
            # Run the synchronous ollama call in a thread pool
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.client.generate(
                    model=self.model,
                    prompt=prompt,
                    system=system_prompt,
                    stream=False
                )
            )
            return response['response']
        except Exception as e:
            print(f"--- 🔴 ERROR: Ollama generation failed: {e} 🔴 ---")
            raise e

    async def analyze_cv_only(self, cv_text: str) -> dict:
        """
        Analyze CV content only
        """
        system_prompt = """You are an expert CV analyzer. Always respond with valid JSON only, no extra text."""
        
        prompt = f"""
        Analyze the following CV text and return a JSON object with this *exact* structure:
        {{
            "full_name": "Full Name",
            "email": "email@example.com", 
            "phone": "+123456",
            "summary": "...", 
            "skills": ["Skill 1"],
            "experience": [{{ "company": "Company", "title": "Job Title", "duration": "Date - Date", "details": "..." }}],
            "education": [{{ "institution": "University", "degree": "Degree", "duration": "Date - Date" }}]
        }}
        
        CV Text: --- {cv_text} ---
        """
        
        try:
            response_text = await self._generate_async(prompt, system_prompt)
            print("--- 💡 RAW OLLAMA (CV Only) RESPONSE 💡 ---")
            print(response_text[:500] + "..." if len(response_text) > 500 else response_text)
            
            cleaned_text = self._clean_json_response(response_text)
            return json.loads(cleaned_text)
        except json.JSONDecodeError as e:
            print(f"--- 🔴 ERROR: Failed to parse CV-ONLY JSON: {cleaned_text} 🔴 ---")
            return {}
        except Exception as e:
            print(f"--- 🔴 ERROR: CV analysis failed: {e} 🔴 ---")
            return {}

    async def query(self, prompt: str) -> str:
        """
        Generic query to Ollama, returns raw text response.
        """
        return await self._generate_async(prompt)

    async def analyze_cv_vs_jd(self, cv_text: str, jd_text: str) -> dict:
        """
        Compare CV against job description
        """
        system_prompt = """You are an expert ATS (Applicant Tracking System) analyzer and professional career coach. Always respond with valid JSON only, no extra text."""
        
        prompt = f"""
        Analyze the given CV text and compare it against the provided Job Description.
        
        Return a JSON object with this *exact* structure. The "match_score" must be an integer between 0 and 100.
        
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

        CV Text:
        ---
        {cv_text}
        ---

        Job Description:
        ---
        {jd_text}
        ---
        """
        
        try:
            response_text = await self._generate_async(prompt, system_prompt)
            print("--- 💡 RAW OLLAMA (CV vs JD) RESPONSE 💡 ---")
            print(response_text[:500] + "..." if len(response_text) > 500 else response_text)
            
            cleaned_text = self._clean_json_response(response_text)
            return json.loads(cleaned_text)
        except json.JSONDecodeError as e:
            print(f"--- 🔴 ERROR: Failed to parse CV-vs-JD JSON: {cleaned_text} 🔴 ---")
            return {}
        except Exception as e:
            print(f"--- 🔴 ERROR: CV vs JD analysis failed: {e} 🔴 ---")
            return {}

    async def analyze_cv_visuals(self, image_bytes: bytes) -> dict:
        """
        Analyze CV visual design (requires vision model)
        Note: This requires a multimodal model like llava
        """
        try:
            # Convert image to base64
            image_b64 = base64.b64encode(image_bytes).decode('utf-8')
            
            system_prompt = """You are an expert UI/UX designer and professional resume reviewer. Always respond with valid JSON only, no extra text."""
            
            prompt = f"""
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
            
            # Try to use a vision model like llava
            vision_model = "llava:latest"  # You might need to pull this model
            try:
                loop = asyncio.get_event_loop()
                response = await loop.run_in_executor(
                    None,
                    lambda: self.client.generate(
                        model=vision_model,
                        prompt=prompt,
                        system=system_prompt,
                        images=[image_b64],
                        stream=False
                    )
                )
                
                cleaned_text = self._clean_json_response(response['response'])
                return json.loads(cleaned_text)
                
            except Exception as vision_error:
                print(f"--- ⚠️ WARNING: Vision model not available ({vision_error}), returning fallback analysis ---")
                # Fallback analysis without image processing
                return {
                    "layout_score": 7,
                    "layout_notes": "Image analysis unavailable. Please ensure a vision model like 'llava' is installed in Ollama.",
                    "font_choice_notes": "Unable to analyze fonts without vision model.",
                    "color_scheme_notes": "Unable to analyze colors without vision model.",
                    "overall_professionalism": "Visual analysis requires a multimodal model. Install 'ollama pull llava' for full functionality.",
                    "suggestions": [
                        "Install a vision model (e.g., 'ollama pull llava') for detailed visual analysis",
                        "Focus on content optimization until visual analysis is available"
                    ]
                }
                
        except Exception as e:
            print(f"--- 🔴 ERROR: Visual analysis failed: {e} 🔴 ---")
            return {
                "layout_score": 5,
                "layout_notes": "Analysis failed due to technical error.",
                "font_choice_notes": "Could not process image.",
                "color_scheme_notes": "Could not process image.",
                "overall_professionalism": "Unable to analyze due to error.",
                "suggestions": ["Please try again or check Ollama configuration"]
            }

# Create service instance
ollama_service = OllamaService()
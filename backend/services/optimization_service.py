"""Business logic for content optimization.

This service coordinates AI calls and simple rule-based fallbacks for
optimizing short text items (experience or project descriptions) to better
match a JobOffer. It returns an `OptimizationResponse` containing the
optimized text, human-readable improvement suggestions and a numeric
match score.

Important behavior:
- Primary path: `_optimize_with_ai` calls into the AI facade to get a
    rewritten description. If the AI call fails, a deterministic fallback is
    returned by `_optimize_fallback`.
- `_calculate_match_score` produces an integer 0-95 representing how well
    the current text matches the job offer (for display in the UI).
"""

from typing import List
import re
from ..schemas.optimization_schemas import JobOfferSchema, OptimizationRequest, OptimizationResponse
from .ai_service import AIService

class OptimizationService:
    def __init__(self):
        self.ai_service = AIService()
    
    async def optimize_content(self, request: OptimizationRequest) -> OptimizationResponse:
        """
        Optimize experience or project description based on job offer
        """
        try:
            # Use AI to optimize the content
            optimized_text = await self._optimize_with_ai(request)
            improvements = self._generate_improvements(request)
            match_score = self._calculate_match_score(request.originalText, request.jobOffer)
            
            return OptimizationResponse(
                optimizedText=optimized_text,
                improvements=improvements,
                matchScore=match_score
            )
        except Exception as e:
            # Fallback to rule-based optimization
            return self._optimize_fallback(request)
    
    async def _optimize_with_ai(self, request: OptimizationRequest) -> str:
        """
        Use AI to optimize content based on job offer
        """
        content_type = "work experience" if request.type == "experience" else "project"
        
        prompt = f"""
        You are a professional CV writer. Optimize the following {content_type} description to better match a job application.

        Job Title: {request.jobOffer.title}
        Company: {request.jobOffer.company}
        Required Skills: {', '.join(request.jobOffer.skills)}
        
        Job Requirements:
        {request.jobOffer.requirements}
        
        Original {content_type.title()} Description:
        {request.originalText}
        
        Instructions:
        1. Rewrite the description to highlight relevant skills and experiences
        2. Use keywords from the job requirements naturally
        3. Quantify achievements where possible
        4. Keep it professional and truthful
        5. Maintain the same length or slightly improve it
        6. Focus on impact and results
        
        Return ONLY the optimized description, no additional text or formatting.
        """
        
        try:
            response = await self.ai_service.generate_content(prompt)
            return response.strip()
        except:
            return request.originalText
    
    def _optimize_fallback(self, request: OptimizationRequest) -> OptimizationResponse:
        """
        Rule-based optimization fallback
        """
        original = request.originalText
        job_offer = request.jobOffer
        
        # Extract keywords from job offer
        keywords = self._extract_keywords(job_offer)
        
        # Simple keyword injection if missing
        optimized = original
        missing_skills = [skill for skill in job_offer.skills[:2] 
                         if skill.lower() not in original.lower()]
        
        if missing_skills and len(original) > 50:
            optimized += f" Utilized {' and '.join(missing_skills)} to enhance project outcomes."
        
        improvements = [
            "Add quantifiable metrics and results",
            f"Include relevant keywords: {', '.join(job_offer.skills[:3])}",
            "Use action verbs that demonstrate impact"
        ]
        
        match_score = self._calculate_match_score(original, job_offer)
        
        return OptimizationResponse(
            optimizedText=optimized,
            improvements=improvements,
            matchScore=match_score
        )
    
    def _extract_keywords(self, job_offer: JobOfferSchema) -> List[str]:
        """
        Extract relevant keywords from job offer
        """
        text = f"{job_offer.description} {job_offer.requirements}".lower()
        
        # Remove common words and extract meaningful terms
        common_words = {'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'}
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text)
        keywords = [word for word in words if word not in common_words]
        
        # Combine with explicit skills
        all_keywords = list(set(keywords + [skill.lower() for skill in job_offer.skills]))
        
        return all_keywords[:20]  # Limit to top 20 keywords
    
    def _calculate_match_score(self, text: str, job_offer: JobOfferSchema) -> int:
        """
        Calculate how well the text matches the job requirements
        """
        text_lower = text.lower()
        
        # Check for skill matches
        skill_matches = sum(1 for skill in job_offer.skills 
                           if skill.lower() in text_lower)
        skill_score = (skill_matches / max(len(job_offer.skills), 1)) * 40
        
        # Check for keyword matches from requirements
        req_words = re.findall(r'\b[a-zA-Z]{4,}\b', job_offer.requirements.lower())
        req_matches = sum(1 for word in req_words[:10] if word in text_lower)
        req_score = (req_matches / max(len(req_words[:10]), 1)) * 40
        
        # Length and detail score
        length_score = min(len(text) / 100, 1) * 20
        
        total_score = skill_score + req_score + length_score
        return min(int(total_score), 95)
    
    def _generate_improvements(self, request: OptimizationRequest) -> List[str]:
        """
        Generate specific improvement suggestions
        """
        improvements = []
        original = request.originalText.lower()
        job_offer = request.jobOffer
        
        # Check for missing skills
        missing_skills = [skill for skill in job_offer.skills[:3] 
                         if skill.lower() not in original]
        if missing_skills:
            improvements.append(f"Consider adding these relevant skills: {', '.join(missing_skills)}")
        
        # Check for quantifiable metrics
        if not re.search(r'\d+', request.originalText):
            improvements.append("Add quantifiable metrics (percentages, numbers, timeframes)")
        
        # Content type specific suggestions
        if request.type == "experience":
            if "led" not in original and "managed" not in original:
                improvements.append("Highlight leadership and management responsibilities")
        else:  # project
            if "implemented" not in original and "developed" not in original:
                improvements.append("Emphasize technical implementation and development work")
        
        return improvements[:4]  # Limit to 4 suggestions
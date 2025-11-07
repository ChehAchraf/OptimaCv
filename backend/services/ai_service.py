from backend.core.config import settings
from backend.services.ollama_service import ollama_service
from backend.services.gemini_service import gemini_service
from typing import Dict, Any

class AIService:
    """
    Unified AI service that switches between Ollama and Gemini based on configuration
    """
    
    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        
        if self.provider == "ollama":
            self.service = ollama_service
            print(f"🤖 Using Ollama with model: {settings.OLLAMA_MODEL}")
        elif self.provider == "gemini":
            self.service = gemini_service
            print("🤖 Using Google Gemini")
        else:
            # Default to Ollama if provider is unknown
            self.service = ollama_service
            print(f"⚠️ Unknown AI provider '{self.provider}', defaulting to Ollama")
    
    async def analyze_cv_only(self, cv_text: str) -> Dict[str, Any]:
        """Analyze CV content only"""
        return await self.service.analyze_cv_only(cv_text)
    
    async def analyze_cv_vs_jd(self, cv_text: str, jd_text: str) -> Dict[str, Any]:
        """Compare CV against job description"""
        return await self.service.analyze_cv_vs_jd(cv_text, jd_text)
    
    async def analyze_cv_visuals(self, image_bytes: bytes) -> Dict[str, Any]:
        """Analyze CV visual design"""
        return await self.service.analyze_cv_visuals(image_bytes)

    async def query(self, prompt: str) -> str:
        """Generic query to the AI service"""
        if hasattr(self.service, 'query'):
            return await self.service.query(prompt)
        
        # Fallback for services that don't have a generic 'query' method
        # This example assumes it's a text-generation task.
        # You might need to adapt this if the service has a different structure.
        print(f"⚠️ Service '{self.provider}' has no 'query' method. Using fallback.")
        if self.provider == 'ollama':
            return await self.service.query(prompt)
        elif self.provider == 'gemini':
            # Assuming gemini_service has a method to generate text from a prompt
            return await self.service.generate_text(prompt)
        
        raise NotImplementedError(f"Query method not implemented for provider: {self.provider}")

# Create the unified service instance
ai_service = AIService()
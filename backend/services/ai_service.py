"""backend.services.ai_service

Facade for AI providers used by the application. This module exposes a single
instance `ai_service` which selects and delegates calls to a concrete provider
(Ollama or Gemini) based on runtime configuration in `backend.core.config.settings`.

Main responsibilities:
- choose provider at startup (settings.AI_PROVIDER)
- provide unified async methods for the rest of the app:
    - analyze_cv_only(cv_text) -> dict
    - analyze_cv_vs_jd(cv_text, jd_text) -> dict
    - analyze_cv_visuals(image_bytes) -> dict
    - query(prompt) -> str   (generic text query)

Notes:
- Provider implementations should implement the methods above. If a provider
    does not implement `query`, the facade will attempt reasonable fallbacks.
"""


# The AIService is a single “entry point” that your app uses to interact with AI models (like Ollama or Gemini).
# But instead of hardcoding one provider, it can switch between multiple AI providers dynamically — depending on what’s set in your environment (for example, .env file).

# That switching ability = Strategy Pattern in action


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
            if gemini_service is None:
                raise ValueError(
                    "Gemini provider selected but not initialized. "
                    "Please set GOOGLE_API_KEY in your .env file."
                )
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

    async def generate_content(self, prompt: str) -> str:
        """Compatibility helper: some callers expect `generate_content`.

        Delegate to `query` which is the unified generic text generation
        method on this facade.
        """
        return await self.query(prompt)

# Create the unified service instance
ai_service = AIService()
from pydantic_settings import BaseSettings


# Configuration settings for the backend application.
#
# We use Pydantic's `BaseSettings` to load and validate environment
# variables. This provides several benefits:
#  - Validation: required fields and types are checked at startup.
#  - Type hints: editors and linters can infer types for safer code.
#  - Centralized defaults: sensible defaults live here and can be
#    overridden via a `.env` file or the environment in production.
#
# Example usage in code:
#   from backend.core.config import settings
#   print(settings.AI_PROVIDER)

class Settings(BaseSettings):
    # AI Model Configuration
    AI_PROVIDER: str = "ollama"  # Set to "ollama" or "gemini"
    
    # Ollama Configuration
    OLLAMA_HOST: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "gemma3:4b"  # Default model name
    
    # Gemini Configuration (fallback)
    GOOGLE_API_KEY: str = ""

    class Config:
        # Path to the environment file used in development
        env_file = ".env"


settings = Settings()
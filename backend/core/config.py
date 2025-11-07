from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # AI Model Configuration
    AI_PROVIDER: str = "ollama"  # "ollama" or "gemini"
    
    # Ollama Configuration
    OLLAMA_HOST: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "gemma3:4b"  # Default model
    
    # Gemini Configuration (fallback)
    GOOGLE_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
from pydantic_settings import BaseSettings

from typing import Optional

class Settings(BaseSettings):

    GOOGLE_API_KEY: str

    ESP32_IP_ADDRESS: Optional[str] = None



    class Config:

        env_file = ".env"
        extra = "ignore"





settings = Settings()

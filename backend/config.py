import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_URL: str        = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str        = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    OPENAI_API_KEY: str      = os.getenv("OPENAI_API_KEY", "")
    ALLOWED_ORIGINS: list    = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

settings = Settings()
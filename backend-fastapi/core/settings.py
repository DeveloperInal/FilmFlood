from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class SMTPYandexConfig(BaseModel):
    host: str = "smtp.yandex.ru"
    username: str = "inal.gergov152@yandex.ru"
    smtp_pass: str = "mkirsnxltnuvbspi"
    port: int = 587

class Settings(BaseSettings):
    smtp: SMTPYandexConfig = SMTPYandexConfig()

    model_config = SettingsConfigDict(
        case_sensitive=True,
        extra='forbid'
    )

try:
    settings = Settings()
except Exception as e:
    print(f"Error reading settings: {e}")

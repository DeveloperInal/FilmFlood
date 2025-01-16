import os
from typing import Type, TypeVar
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

load_dotenv()

T = TypeVar('T', bound=BaseSettings)

def get_settings(settings_cls: Type[T]) -> T:
    class EnvSettings(settings_cls):
        model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', extra='ignore')

    return EnvSettings()
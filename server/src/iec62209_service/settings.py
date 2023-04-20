from pathlib import Path

from pydantic import BaseSettings, validator


class ApplicationSettings(BaseSettings):
    CLIENT_OUTPUT_DIR: Path

    @validator("CLIENT_OUTPUT_DIR")
    @classmethod
    def is_client_output(cls, value: Path):
        if not value.is_dir():
            raise ValueError("Expected directory, got CLIENT_OUTPUT_DIR={value}")

        if not any(value.glob("index.html")):
            raise ValueError(f"Expected {value / 'index.html'} not found")

        return value

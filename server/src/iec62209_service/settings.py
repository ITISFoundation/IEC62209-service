import os
from pathlib import Path

from pydantic import BaseSettings, Field, validator


class OsparcServiceSettings(BaseSettings):

    INPUT_FOLDER: Path | None = Field(
        None,
        env=["INPUT_FOLDER", "DY_SIDECAR_PATH_INPUTS"],
    )
    OUTPUT_FOLDER: Path | None = Field(
        None,
        env=["OUTPUT_FOLDER", "DY_SIDECAR_PATH_OUTPUTS"],
    )
    LOG_FOLDER: Path | None = None
    STATE_FOLDERS: list[Path] = Field(
        default_factory=list,
        envs=["STATE_FOLDERS", "DY_SIDECAR_STATE_PATHS"],
    )

    @validator("INPUT_FOLDER", "OUTPUT_FOLDER")
    @classmethod
    def check_dir_exists(cls, v):
        if v is not None and not v.exists():
            raise ValueError(
                f"Folder {v} does not exists."
                "Expected predefined and created by sidecar"
            )
        return v

    @validator("INPUT_FOLDER")
    @classmethod
    def check_input_dir(cls, v):
        if v is not None:
            f = v / "inputs.json"
            if not f.exists():
                raise ValueError(
                    f"File {f} does not exists."
                    "Expected predefined and created by sidecar"
                )
        return v

    @validator("OUTPUT_FOLDER")
    @classmethod
    def check_output_dir(cls, v: Path):
        if v is not None and not os.access(v, os.W_OK):
            raise ValueError(f"Do not have write access to {v}: {v.stat()}")
        return v


class ApplicationSettings(OsparcServiceSettings):
    CLIENT_OUTPUT_DIR: Path

    @validator("CLIENT_OUTPUT_DIR")
    @classmethod
    def is_client_output(cls, value: Path):
        if not value.is_dir():
            raise ValueError(f"Expected directory, got CLIENT_OUTPUT_DIR={value}")

        if not any(value.glob("index.html")):
            raise ValueError(f"Expected {value / 'index.html'} not found")

        return value

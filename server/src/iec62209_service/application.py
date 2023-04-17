from pathlib import Path
from fastapi import FastAPI
from .api_routes import router
from pydantic import BaseSettings


class ApplicationSettings(BaseSettings):
    CLIENT_INDEX_PATH: Path



def create_app():
    app = FastAPI()
    app.include_router(router)

    app.state.settings = ApplicationSettings()

    return app



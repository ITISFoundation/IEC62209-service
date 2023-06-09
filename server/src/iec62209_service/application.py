from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from ._meta import (
    API_VERSION,
    APP_FINISHED_BANNER_MSG,
    APP_STARTED_BANNER_MSG,
    PROJECT_NAME,
)
from .api import router
from .routers import (
    analysis_creation,
    confirm_model,
    load_critical_data,
    load_model,
    load_test_data,
    load_training_data,
    meta,
    search_space,
    test_set_generation,
    training_set_generation,
    verify,
)
from .settings import ApplicationSettings


@asynccontextmanager
async def _lifespan(app: FastAPI):
    print(APP_STARTED_BANNER_MSG, flush=True)

    yield

    print(APP_FINISHED_BANNER_MSG, flush=True)


def create_app():
    app = FastAPI(
        title=PROJECT_NAME,
        version=API_VERSION,
        lifespan=_lifespan,
    )
    app.state.settings = settings = ApplicationSettings()

    # routes
    app.include_router(router)
    app.include_router(meta.router)
    app.include_router(training_set_generation.router)
    app.include_router(test_set_generation.router)
    app.include_router(load_training_data.router)
    app.include_router(analysis_creation.router)
    app.include_router(load_model.router)
    app.include_router(test_set_generation.router)
    app.include_router(load_test_data.router)
    app.include_router(confirm_model.router)
    app.include_router(search_space.router)
    app.include_router(load_critical_data.router)
    app.include_router(verify.router)

    # static files
    app.mount("/", StaticFiles(directory=settings.CLIENT_OUTPUT_DIR), name="static")

    return app

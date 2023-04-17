from enum import Enum
from pathlib import Path
from fastapi import status
from fastapi import APIRouter, Depends, FastAPI, File, HTMLResponse, Request, UploadFile
from iec62209 import Work
from pydantic import BaseModel, Field, conint

from .application import ApplicationSettings

#
# Dependency injection
#


def get_app_settings(request: Request) -> ApplicationSettings:
    settings: ApplicationSettings = request.app.state.settings
    return settings


#
# API Models
#


class Demo(BaseModel):
    x: bool
    y: int
    z: conint(ge=2)


class MyEnum(str, Enum):
    FOO = "FOO"
    BAR = "BAR"


#
# API Handlers
#

router = APIRouter()


@router.get("/")
async def get_index(settings: ApplicationSettings = Depends(get_app_settings)):
    html_content = Path(settings.CLIENT_INDEX_PATH).read_text()
    return HTMLResponse(content=html_content, status_code=status)


@router.get("/demo/{name}", response_model=Demo)
async def demo(body: Demo, name: str, enabled: MyEnum = MyEnum.BAR):
    return Demo(x=body.x, y=body.y + 3, z=body.x + 33)


@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}


@router.post("/sample")
async def generate_sample():
    # work = Work()
    ...

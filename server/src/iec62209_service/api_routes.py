from fastapi import APIRouter
from pydantic import BaseModel, Field, conint
from enum import Enum
from fastapi import File, UploadFile
from iec62209 import Work

#
# API Models
#


class Health(BaseModel):
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


@router.post("/health/{name}", response_model=Health)
async def health(health: Health, name: str, enabled: MyEnum = MyEnum.BAR):

    return Health(x=True, y=3, z=33)


@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}


@router.post("/sample")
async def generate_sample():

    # work = Work()
    ...
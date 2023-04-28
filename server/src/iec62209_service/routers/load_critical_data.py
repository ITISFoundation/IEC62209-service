from os import remove
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, UploadFile, status
from fastapi.responses import JSONResponse

from .common import ModelInterface, SampleInterface

router = APIRouter(prefix="/critical-data", tags=["critical-data"])


@router.get("/reset")
async def critical_data_reset():
    SampleInterface.criticalSet.clear()


@router.post("/load", response_class=JSONResponse)
async def critical_data_load(file: UploadFile = File(...)) -> JSONResponse:
    response = {}
    end_status = status.HTTP_200_OK
    try:
        # need to write to a temp file
        tmp = NamedTemporaryFile(delete=False)
        tmp.write(file.file.read())
        tmp.close()
        response = ModelInterface.load_critical_sample(tmp.name)
        remove(tmp.name)
    except Exception as e:
        response = {"error": str(e)}
        end_status = status.HTTP_500_INTERNAL_SERVER_ERROR
    return JSONResponse(response, status_code=end_status)
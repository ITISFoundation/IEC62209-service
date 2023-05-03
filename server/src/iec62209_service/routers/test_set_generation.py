from tempfile import NamedTemporaryFile

from fastapi import APIRouter, status
from fastapi.responses import (
    FileResponse,
    HTMLResponse,
    JSONResponse,
    Response,
    StreamingResponse,
)

from ..utils.common import ModelInterface, SampleConfig, SampleInterface

router = APIRouter(
    prefix="/test-set-generation",
    tags=["test-set-generation"],
    responses={404: {"error": "Backend not ready"}},
)


@router.post("/generate", response_class=HTMLResponse)
async def test_set_generate(config: SampleConfig) -> HTMLResponse:
    message = ""
    end_status = status.HTTP_200_OK
    try:
        SampleInterface.testSet.generate(config)
        SampleInterface.testSet.add_columns(["sar10g", "u10g"])
    except Exception as e:
        message = f"The IEC62209 package raised an exception: {e}"
        end_status = status.HTTP_500_INTERNAL_SERVER_ERROR
    return HTMLResponse(message, status_code=end_status)


@router.get("/data", response_class=JSONResponse)
async def test_set_data() -> JSONResponse:
    return JSONResponse(SampleInterface.testSet.to_dict())


@router.get("/distribution", response_class=Response)
async def test_set_distribution() -> Response:
    try:
        buf = SampleInterface.testSet.plot_distribution()
        return StreamingResponse(buf, media_type="image/png")
    except Exception as e:
        return JSONResponse(
            {"error": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.get("/xport", response_class=FileResponse)
async def test_set_xport() -> FileResponse:
    tmp = NamedTemporaryFile(delete=False)
    SampleInterface.testSet.export_to_csv(tmp.name)
    return FileResponse(tmp.name, media_type="text/csv")


@router.get("/model-area", response_class=JSONResponse)
async def test_set_get_model_area() -> JSONResponse:
    ModelInterface.raise_if_no_model()
    conf = SampleInterface.trainingSet.config
    if conf.sampleSize > 0:
        return {
            "measAreaX": f"{conf.measAreaX:.0f}",
            "measAreaY": f"{conf.measAreaY:.0f}",
        }
    return JSONResponse(
        {"error": "Sample not loaded from model"},
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


@router.get("/reset")
async def test_set_reset():
    SampleInterface.testSet.clear()

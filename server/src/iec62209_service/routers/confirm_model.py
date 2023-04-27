from fastapi import APIRouter, status
from fastapi.responses import JSONResponse, Response, StreamingResponse

from .common import ModelInterface

router = APIRouter(prefix="/confirm-model", tags=["confirm-model"])


@router.get("/confirm", response_class=JSONResponse)
async def confirm_model() -> JSONResponse:
    response = {}
    end_status = status.HTTP_200_OK
    try:
        # storing these for later
        ModelInterface.compute_residuals()
        response = ModelInterface.residuals
    except Exception as e:
        response = {"error": str(e)}
        end_status = status.HTTP_500_INTERNAL_SERVER_ERROR

    return JSONResponse(response, status_code=end_status)


@router.get("/qqplot", response_class=Response)
async def confirm_model_qqplot() -> Response:
    try:
        buf = ModelInterface.plot_residuals()
        StreamingResponse(buf, media_type="image/png")
    except Exception as e:
        return Response(
            {"error": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
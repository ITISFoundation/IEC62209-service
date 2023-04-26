import subprocess

from fastapi import APIRouter
from pydantic import BaseModel

from .._meta import API_VERSION, PROJECT_NAME, info

router = APIRouter(tags=["meta"])


class ServiceMetadata(BaseModel):
    project_name: str = PROJECT_NAME
    version: str = API_VERSION
    summary: str = info.get_summary()
    kernel_info: str


def _get_kernel_info():
    result = subprocess.run(
        ["pip", "show", "iec62209"], capture_output=True, check=True
    )
    return result.stdout.decode()


try:
    _KERNEL_INFO = _get_kernel_info()
except Exception:
    _KERNEL_INFO = "UNKNOWN"


@router.get("/meta", response_model=ServiceMetadata)
async def get_meta():
    """service metadata"""
    return ServiceMetadata(kernel_info=_KERNEL_INFO)

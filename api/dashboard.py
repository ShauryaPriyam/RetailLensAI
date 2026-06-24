from fastapi import APIRouter

from services.dashboard_service import (
    get_dashboard
)

router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"]
)


@router.get("")
def dashboard():
    return get_dashboard()
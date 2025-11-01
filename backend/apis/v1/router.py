from fastapi import APIRouter
from backend.apis.v1.endpoints import analysis

api_router = APIRouter()

api_router.include_router(analysis.router, prefix="/analysis", tags=["CV Analysis"])
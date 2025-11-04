from fastapi import APIRouter

from backend.apis.v1.endpoints import analysis
from backend.apis.v1.endpoints import interview 



api_router = APIRouter()



api_router.include_router(analysis.router, prefix="/analysis", tags=["CV Analysis"])
api_router.include_router(interview.router, prefix="/interview", tags=["Interview Simulation"])
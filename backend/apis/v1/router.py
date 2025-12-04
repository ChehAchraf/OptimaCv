from fastapi import APIRouter

from backend.apis.v1.endpoints import analysis, builder, interview



api_router = APIRouter()



api_router.include_router(analysis.router, prefix="/analysis", tags=["CV Analysis"])
api_router.include_router(builder.router, prefix="/builder", tags=["CV Builder"])
api_router.include_router(interview.router, prefix="/interview", tags=["AI Interview"])

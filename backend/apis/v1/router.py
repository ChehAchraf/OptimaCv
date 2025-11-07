from fastapi import APIRouter
from backend.apis.v1.endpoints import analysis, optimization, ollama_endpoint

api_router = APIRouter()

api_router.include_router(analysis.router, prefix="/analysis", tags=["CV Analysis"])
api_router.include_router(optimization.router, prefix="/optimization", tags=["Content Optimization"])
api_router.include_router(ollama_endpoint.router, prefix="/ollama", tags=["Ollama"])
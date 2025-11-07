from fastapi import APIRouter, HTTPException
from backend.schemas.optimization_schemas import OptimizationRequest, OptimizationResponse
from backend.services.optimization_service import OptimizationService

router = APIRouter()
optimization_service = OptimizationService()

@router.post("/optimize-content", response_model=OptimizationResponse)
async def optimize_content(request: OptimizationRequest):
    """
    Optimize experience or project description based on job offer requirements
    """
    try:
        result = await optimization_service.optimize_content(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to optimize content: {str(e)}")
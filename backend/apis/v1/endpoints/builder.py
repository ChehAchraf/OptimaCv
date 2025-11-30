from fastapi import APIRouter, HTTPException, Body
from backend.schemas.cv_builder import OptimizationRequest, OptimizationResponse
from backend.services.optimization_service import optimization_service

router = APIRouter()

@router.post("/optimize", response_model=OptimizationResponse)
async def optimize_content(request: OptimizationRequest):
    """
    Optimize a piece of text (experience, summary, etc.) using AI.
    """
    if not request.text or len(request.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Text is too short to optimize.")

    result = await optimization_service.optimize_text(
        text=request.text,
        context=request.context,
        job_title=request.job_title
    )

    return OptimizationResponse(
        original_text=request.text,
        optimized_text=result.get("optimized_text", request.text),
        improvements=result.get("improvements", [])
    )

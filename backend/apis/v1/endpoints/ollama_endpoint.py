from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.services.ai_service import ai_service

router = APIRouter()

class OllamaOptimizationRequest(BaseModel):
    prompt: str


class OllamaOptimizationResponse(BaseModel):
    optimizedText: str


@router.post("/optimize-ollama", response_model=OllamaOptimizationResponse)
async def handle_optimize_ollama(request: OllamaOptimizationRequest):
    """
    Proxy endpoint for direct prompt-based optimization.

    Accepts a `prompt` string (already formatted by the frontend) and returns
    the raw text response produced by the configured AI provider. This is a
    low-level utility used by the frontend when it wants to run the crafted
    prompt against the AI service (Ollama/Gemini) and receive the optimized
    text for insertion into the resume.
    """
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")
    try:
        # Use the generic query method from the AI service
        optimized_text = await ai_service.query(request.prompt)
        return {"optimizedText": optimized_text}
    except Exception as e:
        print(f"--- 🔴 Error during Ollama optimization 🔴 ---")
        print(f"Error Details: {repr(e)}")
        raise HTTPException(status_code=500, detail=f"Error during optimization: {repr(e)}")

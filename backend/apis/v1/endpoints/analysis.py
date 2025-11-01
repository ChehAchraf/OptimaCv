import asyncio
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from backend.services.pdf_service import pdf_service
from backend.services.gemini_service import gemini_service
from typing import Optional, List

from backend.schemas.analysis_schemas import (
    CVOnlyResponse, 
    CVvsJDResponse,
    VisualAnalysisResponse,
    FullAnalysisResponse, 
    VisualFeedback   ,
    FullRankingResponse   ,
    RankedAnalysisItem
)

router = APIRouter()


@router.post(
    "/analyze-cv-only/",
    response_model=CVOnlyResponse,
    tags=["CV Analysis (Simple)"]
)
async def handle_analyze_cv_only(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please send only a valid PDF")
    try:
        pdf_bytes = await file.read()
        cv_text = pdf_service.parse_text(pdf_bytes)
        analysis_data = await gemini_service.analyze_cv_only(cv_text) 
        return {
            "filename": file.filename,
            "analysis_source": "Gemini Flash Latest",
            "analysis": analysis_data
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"--- 🔴 Error 🔴 ---"); print(f"Error Details: {repr(e)}")
        raise HTTPException(status_code=500, detail=f"Something Wrong: {repr(e)}")


@router.post(
    "/analyze-cv-vs-jd/",
    response_model=CVvsJDResponse,
    tags=["CV Analysis (Simple)"]
)
async def handle_analyze_cv_vs_jd(file: UploadFile = File(...), job_description: str = Form(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Please upload a PDF file.")
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")
    try:
        pdf_bytes = await file.read()
        cv_text = pdf_service.parse_text(pdf_bytes)
        analysis_data = await gemini_service.analyze_cv_vs_jd(cv_text, job_description)
        return {
            "filename": file.filename,
            "analysis_source": "Gemini Pro Latest",
            "analysis_vs_jd": analysis_data
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"--- 🔴 Error 🔴 ---"); print(f"Error Details: {repr(e)}")
        raise HTTPException(status_code=500, detail=f"Error : {repr(e)}")


@router.post(
    "/analyze-cv-visual/",
    response_model=VisualAnalysisResponse,
    tags=["CV Analysis (Simple)"]
)
async def handle_analyze_cv_visual(file: UploadFile = File(...)):
    allowed_types = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type.")
    try:
        image_bytes = await file.read()
        visual_feedback = await gemini_service.analyze_cv_visuals(image_bytes)
        return {"filename": file.filename, "feedback": visual_feedback}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"--- 🔴 Error 🔴 ---"); print(f"Error Details: {repr(e)}")
        raise HTTPException(status_code=500, detail=f"Error : {repr(e)}")


@router.post(
    "/analyze-full-cv/",
    response_model=FullAnalysisResponse, 
    tags=["CV Analysis (Full)"]
)
async def handle_full_analysis(
    cv_pdf: UploadFile = File(..., description="Le CV du candidat au format PDF."),
    job_description: str = Form(..., description="La description de poste (JD)."),
    cv_image: Optional[UploadFile] = File(None, description="Une image (PNG/JPG) du CV pour analyse visuelle (Optionnel).")
):
    if cv_pdf.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Le fichier CV doit être un PDF.")
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="La description de poste ne peut pas être vide.")

    try:
        cv_pdf_bytes = await cv_pdf.read()
        cv_text = pdf_service.parse_text(cv_pdf_bytes)
        
 
        text_analysis_result = None
        try:
            text_analysis_result = await gemini_service.analyze_cv_vs_jd(cv_text, job_description)
        except Exception as e:
            print(f"--- 🔴 Error Anylsing text 🔴 ---")
            print(f"Error Details: {repr(e)}")
            raise HTTPException(status_code=500, detail=f"Erreur analyse texte: {e}")

        visual_analysis_result = None
        image_filename = None
        if cv_image and cv_image.filename:
            image_filename = cv_image.filename
            allowed_types = ["image/jpeg", "image/png", "image/webp"]
            
            if cv_image.content_type not in allowed_types:
                raise HTTPException(status_code=400, detail="L'image doit être PNG, JPG, or WebP.")
            
            image_bytes = await cv_image.read()
            
            try:
                visual_analysis_result = await gemini_service.analyze_cv_visuals(image_bytes)
            except Exception as e:
                print(f"Alerte: L'analyse visuelle a échoué: {repr(e)}")
                visual_analysis_result = None 

        return FullAnalysisResponse(
            filename_pdf=cv_pdf.filename,
            filename_image=image_filename,
            analysis_vs_jd=text_analysis_result,
            visual_analysis=visual_analysis_result
        )

    except ValueError as e: 
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"--- 🔴 خطأ فـ analyze-full-cv 🔴 ---")
        print(f"Error Details: {repr(e)}")
        raise HTTPException(status_code=500, detail=f"حدث خطأ: {repr(e)}")
    

@router.post(
    "/companies/rank-candidates/",
    response_model=FullRankingResponse, 
    tags=["Company Tools (B2B)"] 
)
async def handle_rank_candidates(
    job_description: str = Form(..., description="La description de poste (JD)."),
    cv_pdfs: List[UploadFile] = File(..., description="Liste des CVs (PDFs) à analyser.")
):
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="La description de poste ne peut pas être vide.")
    
    results_list = [] 
    

    for cv_pdf in cv_pdfs:
        if cv_pdf.content_type != "application/pdf":
            print(f"Skipping non-PDF file: {cv_pdf.filename}")
            continue

        try:
            pdf_bytes = await cv_pdf.read()
            cv_text = pdf_service.parse_text(pdf_bytes)
            
            analysis_data = await gemini_service.analyze_cv_vs_jd(cv_text, job_description)
            
            results_list.append(
                RankedAnalysisItem(
                    filename=cv_pdf.filename,
                    analysis=analysis_data
                )
            )

        except Exception as e:
            print(f"--- 🔴 Failed to process CV: {cv_pdf.filename} 🔴 ---")
            print(f"Error: {repr(e)}")
    

    if not results_list:
        raise HTTPException(status_code=400, detail="No valid PDFs were processed.")

    sorted_results = sorted(
        results_list,
        key=lambda item: item.analysis.match_score if item.analysis and item.analysis.match_score is not None else 0,
        reverse=True
    )

    return FullRankingResponse(
        total_processed=len(sorted_results),
        ranked_results=sorted_results
    )



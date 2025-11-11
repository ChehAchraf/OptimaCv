import asyncio
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from backend.services.pdf_service import pdf_service
from backend.services.ai_service import ai_service
from typing import Optional, List

from backend.schemas.analysis_schemas import (
    CVOnlyResponse, 
    CVvsJDResponse,
    VisualAnalysisResponse,
    FullAnalysisResponse, 
    FullRankingResponse   ,
    RankedAnalysisItem
    , CVGenerateRequest, GeneratedCVResponse, CVDataSchema
)

router = APIRouter()

# Endpoints in this module perform CV analysis tasks:
# - `handle_analyze_cv_only` accepts a PDF and returns parsed CV fields.
# - `handle_analyze_cv_vs_jd` compares a CV PDF against a job description.
# - `handle_analyze_cv_visual` analyzes visual aspects of an uploaded image.
# - `handle_full_analysis` combines textual and optional visual analysis for a CV + JD.
# - `handle_rank_candidates` processes multiple CV PDFs and ranks them against a JD.
#
# Each endpoint validates inputs, delegates to the `pdf_service` and `ai_service`,
# and returns structured responses defined in `backend.schemas.analysis_schemas`.


# decorator
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
        analysis_data = await ai_service.analyze_cv_only(cv_text) 
        return {
            "filename": file.filename,
            "analysis_source": f"AI Service ({ai_service.provider.title()})",
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
        analysis_data = await ai_service.analyze_cv_vs_jd(cv_text, job_description)
        return {
            "filename": file.filename,
            "analysis_source": f"AI Service ({ai_service.provider.title()})",
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
        visual_feedback = await ai_service.analyze_cv_visuals(image_bytes)
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
            text_analysis_result = await ai_service.analyze_cv_vs_jd(cv_text, job_description)
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
                visual_analysis_result = await ai_service.analyze_cv_visuals(image_bytes)
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
            
            analysis_data = await ai_service.analyze_cv_vs_jd(cv_text, job_description)
            
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



@router.post(
    "/generate-from-info/",
    response_model=GeneratedCVResponse,
    tags=["CV Generation"]
)
async def handle_generate_from_info(request: CVGenerateRequest):
    """Generate an organized CV structure from user-provided JSON info. Optionally tailor it to a job description.
    The endpoint will call the configured AI service to analyze and organize the provided structured data.
    """
    try:
        cv_data: CVDataSchema = request.cv_data

        # Build a plain-text representation of the provided CV data for the AI
        parts = []
        pi = cv_data.personalInfo
        parts.append(f"Name: {pi.fullName}")
        parts.append(f"Email: {pi.email}")
        if pi.phoneNumber:
            parts.append(f"Phone: {pi.phoneNumber}")
        if pi.linkedin:
            parts.append(f"LinkedIn: {pi.linkedin}")
        if pi.github:
            parts.append(f"GitHub: {pi.github}")

        if cv_data.education:
            parts.append("Education:\n")
            for e in cv_data.education:
                parts.append(f"{e.school} | {e.degree or ''} | {e.startDate or ''} - {e.endDate or ''}")

        if cv_data.experience:
            parts.append("Experience:\n")
            for ex in cv_data.experience:
                parts.append(f"{ex.company} | {ex.role or ''} | {ex.startDate or ''} - {ex.endDate or ''}\n{ex.description or ''}")

        if cv_data.projects:
            parts.append("Projects:\n")
            for p in cv_data.projects:
                parts.append(f"{p.name} | {p.url or ''}\n{p.description or ''}")

        if cv_data.skills:
            skills_text = ', '.join(cv_data.skills.hard or [])
            parts.append(f"Skills: {skills_text}")

        cv_text = "\n".join(parts)

        # First, ask AI to analyze the constructed CV text into a structured CV
        try:
            basic_analysis = await ai_service.analyze_cv_only(cv_text)
        except Exception as e:
            basic_analysis = {}

        # If job description provided, get tailored analysis
        ai_summary = None
        strengths = []
        weaknesses = []
        if request.job_description:
            try:
                tailored = await ai_service.analyze_cv_vs_jd(cv_text, request.job_description)
                ai_summary = tailored.get('summary') if isinstance(tailored, dict) else None
                strengths = tailored.get('strengths', []) if isinstance(tailored, dict) else []
                weaknesses = tailored.get('weaknesses', []) if isinstance(tailored, dict) else []
            except Exception as e:
                # Non-fatal — proceed with whatever basic_analysis returned
                ai_summary = None

        # Merge AI output into CVDataSchema-compatible structure
        organized = {
            "personalInfo": {
                "fullName": basic_analysis.get('full_name') or cv_data.personalInfo.fullName,
                "email": basic_analysis.get('email') or cv_data.personalInfo.email,
                "phoneNumber": basic_analysis.get('phone') or cv_data.personalInfo.phoneNumber,
                "linkedin": cv_data.personalInfo.linkedin,
                "github": cv_data.personalInfo.github,
            },
            "education": [],
            "experience": [],
            "projects": cv_data.projects or [],
            "skills": {
                "hard": basic_analysis.get('skills') or cv_data.skills.hard,
                "soft": cv_data.skills.soft or []
            }
        }

        for edu in basic_analysis.get('education', []) if isinstance(basic_analysis.get('education', []), list) else []:
            organized['education'].append({
                'school': edu.get('institution') or '',
                'degree': edu.get('degree') or '',
                'startDate': edu.get('duration') or '',
                'endDate': ''
            })

        for exp in basic_analysis.get('experience', []) if isinstance(basic_analysis.get('experience', []), list) else []:
            organized['experience'].append({
                'company': exp.get('company') or '',
                'role': exp.get('title') or '',
                'startDate': exp.get('duration') or '',
                'endDate': '',
                'description': exp.get('details') or ''
            })

        # Ensure lists exist
        organized['education'] = organized['education'] or []
        organized['experience'] = organized['experience'] or []

        return GeneratedCVResponse(
            organized_data=organized,
            ai_summary=ai_summary,
            strengths=strengths,
            weaknesses=weaknesses
        )

    except Exception as e:
        print(f"--- 🔴 Error in generate-from-info: {repr(e)} 🔴 ---")
        raise HTTPException(status_code=500, detail=f"Failed to generate CV: {repr(e)}")

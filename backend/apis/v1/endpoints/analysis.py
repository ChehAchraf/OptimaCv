import asyncio

from fastapi import APIRouter, File, UploadFile, Form, HTTPException

from backend.services.pdf_service import pdf_service

from backend.services.gemini_service import gemini_service

from typing import Optional, List

from backend.services.notification_service import notify_esp32



from backend.schemas.analysis_schemas import (

    CVOnlyResponse, 

    CVvsJDResponse,

    VisualAnalysisResponse,

    FullAnalysisResponse, 

    VisualFeedback   ,

    FullRankingResponse   ,

    RankedAnalysisItem,

    CVBuildInput,      

    CVBuildResponse,

    ProfileSummaryInput,

    ProfileSummaryResponse

)




def get_sort_key(item: RankedAnalysisItem) -> int:
    if item.recruiter_analysis and item.recruiter_analysis.match_percentage is not None:
        return item.recruiter_analysis.match_percentage
    
    # Fallback to legacy
    if item.analysis and item.analysis.match_score is not None:
        return item.analysis.match_score
        
    return 0



router = APIRouter()





@router.post(

    "/analyze-cv-only/",

    response_model=CVOnlyResponse,

    tags=["CV Analysis (Simple)"]

)

async def safe_validate_pdf(file: UploadFile):
    """
    Validates PDF file by checking magic bytes and content type.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid Content-Type. Expected application/pdf.")
    
    # Read first 4 bytes to check magic number
    await file.seek(0)
    magic_bytes = await file.read(4)
    await file.seek(0)  # Reset cursor
    
    if magic_bytes != b'%PDF':
        raise HTTPException(status_code=400, detail="Invalid file format. File is not a valid PDF.")

@router.post(

    "/analyze-cv-only/",

    response_model=CVOnlyResponse,

    tags=["CV Analysis (Simple)"]

)

async def handle_analyze_cv_only(file: UploadFile = File(...)):

    await safe_validate_pdf(file)

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

    except IOError as e:
        raise HTTPException(status_code=400, detail=f"File I/O Error: {str(e)}")

    except Exception as e:

        print(f"--- 🔴 Error 🔴 ---"); print(f"Error Details: {repr(e)}")

        raise HTTPException(status_code=500, detail=f"Something Wrong: {repr(e)}")





@router.post(

    "/analyze-cv-vs-jd/",

    response_model=CVvsJDResponse,

    tags=["CV Analysis (Simple)"]

)

async def handle_analyze_cv_vs_jd(file: UploadFile = File(...), job_description: str = Form(...)):

    await safe_validate_pdf(file)

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

    except IOError as e:
        raise HTTPException(status_code=400, detail=f"File I/O Error: {str(e)}")

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

    job_description: Optional[str] = Form(None, description="La description de poste (JD)."),

    cv_image: Optional[UploadFile] = File(None, description="Une image (PNG/JPG) du CV pour analyse visuelle (Optionnel).")


):

    await safe_validate_pdf(cv_pdf)

    try:

        cv_pdf_bytes = await cv_pdf.read()

        cv_text = pdf_service.parse_text(cv_pdf_bytes)

        text_analysis_result = None

        try:
            # Use the new Coach Analysis
            text_analysis_result = await gemini_service.analyze_cv_with_coach(cv_text, job_description)

        except ValueError as e:
            print(f"--- ⚠️ Service Warning ⚠️ ---")
            print(f"Detail: {e}")
            raise HTTPException(status_code=503, detail=str(e))

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

                                                
                                                   

        if text_analysis_result:
            score = text_analysis_result.get("overall_score") # Update key from match_score to overall_score                       
            notify_esp32("success", score=score if score else 0)
        else:
            notify_esp32("error")
                                       
        
        return FullAnalysisResponse(
            filename_pdf=cv_pdf.filename,
            filename_image=image_filename,
            cv_coach_analysis=text_analysis_result, # Use the new field
            analysis_vs_jd=None, # Clear the old field to avoid confusion
            visual_analysis=visual_analysis_result
        )



    except ValueError as e: 

        raise HTTPException(status_code=400, detail=str(e))
    
    except IOError as e:
        raise HTTPException(status_code=400, detail=f"File I/O Error: {str(e)}")

    except Exception as e:

        print(f"--- 🔴 error in analyze-full-cv 🔴 ---")

        print(f"Error Details: {repr(e)}")

        raise HTTPException(status_code=500, detail=f"Error: {repr(e)}")

    



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
    errors = []
    
    notify_esp32("busy")

    try:
        for cv_pdf in cv_pdfs:
            # Safe validation within loop
            try:
                await safe_validate_pdf(cv_pdf)
            except HTTPException:
                print(f"Skipping Invalid PDF: {cv_pdf.filename}")
                continue

            try:
                pdf_bytes = await cv_pdf.read()
                cv_text = pdf_service.parse_text(pdf_bytes)
                # Use new Recruiter Analysis
                analysis_data = await gemini_service.analyze_cv_for_recruiter(cv_text, job_description)
                
                results_list.append(
                    RankedAnalysisItem(
                        filename=cv_pdf.filename,
                        recruiter_analysis=analysis_data
                    )
                )

            except Exception as e:
                print(f"--- 🔴 Failed to process CV: {cv_pdf.filename} 🔴 ---")
                print(f"Error: {repr(e)}")
                errors.append(str(e))

        if not results_list:
            notify_esp32("error")
            
            # Check for quota exhaustion in errors
            if any("Quota Exceeded" in err or "429" in err for err in errors):
                raise HTTPException(
                    status_code=503, 
                    detail="Service temporarily unavailable: AI Model Quota Exceeded. Please try again later."
                )
            
            error_msg = f"No valid PDFs were processed. Errors: {'; '.join(errors[:3])}"
            raise HTTPException(status_code=400, detail=error_msg)

        sorted_results = sorted(
            results_list,
            key=get_sort_key,
            reverse=True
        )

        top_score = get_sort_key(sorted_results[0])
        notify_esp32("success", score=top_score)

        return FullRankingResponse(
            total_processed=len(sorted_results),
            ranked_results=sorted_results
        )

    except HTTPException:
        raise
    
    except IOError as e:
         raise HTTPException(status_code=400, detail=f"File I/O Error: {str(e)}")

    except Exception as e:
        print(f"--- 🔴 CRITICAL FAILURE in rank-candidates: {repr(e)} 🔴 ---")
        notify_esp32("error")                                      
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {repr(e)}")



@router.post(

    "/generator/build-cv/",

    response_model=CVBuildResponse, 

    tags=["CV Generator (B2C)"]               

)

async def handle_build_cv(

    cv_data: CVBuildInput                                 

):

    try:

                                                

        generated_data = await gemini_service.generate_cv_from_data(cv_data.model_dump())



                                                

                                                                          

        return generated_data



    except Exception as e:
        print(f"--- 🔴 error in CV Builder 🔴 ---")
        print(f"Error Details: {repr(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {repr(e)}")

@router.post(
    "/generate-profile-summary/",
    response_model=ProfileSummaryResponse,
    tags=["AI Tools"]
)
async def handle_generate_profile_summary(data: ProfileSummaryInput):
    try:
        summary_text = await gemini_service.generate_profile_summary(data.model_dump())
        return ProfileSummaryResponse(summary=summary_text)
    except Exception as e:
        print(f"Error generating summary: {e}")
        raise HTTPException(status_code=500, detail=str(e))

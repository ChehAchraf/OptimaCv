import uuid, json
from fastapi import APIRouter, UploadFile, File, Form, WebSocket, WebSocketDisconnect, HTTPException
from backend.services.interview_service import interview_service
from backend.schemas.interview_schemas import InterviewInitResponse, WSClientMessage, WSServerMessage, InterviewReport

router = APIRouter()

@router.post("/session/create", response_model=InterviewInitResponse, tags=["Interview Simulation"])
async def create_interview_session(cv_pdf: UploadFile = File(...), job_description: str = Form(...)):
    if cv_pdf.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="CV must be a PDF.")
    pdf_bytes = await cv_pdf.read()
    session_id = str(uuid.uuid4())
    initial_questions = await interview_service.create_session(session_id, pdf_bytes, job_description)
    return {"session_id": session_id, "initial_questions": initial_questions}

@router.websocket("/session/{session_id}/ws")
async def interview_ws(websocket: WebSocket, session_id: str):
    await websocket.accept()
    s = interview_service.sessions.get(session_id)
    if not s:
        await websocket.send_text(json.dumps({"type": "info", "text": "Invalid session."}))
        await websocket.close()
        return
    # send first question if any
    for q in (s["asked"][:1] or ["Tell me about yourself."]):
        await websocket.send_text(json.dumps({"type": "question", "text": q}))

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                msg = WSClientMessage(**json.loads(raw))
            except Exception:
                continue

            if msg.type == "transcript" and msg.text:
                s["transcript"].append({"text": msg.text, "ts": msg.timestamp_ms or 0})
                s["history"].append({"role": "candidate", "text": msg.text})
                # After each answer, ask a follow-up
                question = await interview_service.next_question(session_id)
                s["history"].append({"role": "interviewer", "text": question})
                await websocket.send_text(json.dumps({"type": "question", "text": question, "followup": True}))

            elif msg.type == "metrics" and msg.payload:
                s["metrics"].append(msg.payload)

            elif msg.type == "control" and msg.action in {"finish"}:
                await websocket.send_text(json.dumps({"type": "info", "text": "Finishing..."}))
                await websocket.close()
                break
    except WebSocketDisconnect:
        pass

@router.post("/session/{session_id}/finalize", response_model=InterviewReport, tags=["Interview Simulation"])
async def finalize_interview(session_id: str):
    data = await interview_service.finalize(session_id)
    if not data:
        raise HTTPException(status_code=404, detail="Session not found.")
    return data
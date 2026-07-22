import os
import shutil
import tempfile
from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.concurrency import run_in_threadpool

from backend.app.auth.deps import get_current_user
from backend.app.schemas.codebase import (
    UploadResponse, AskRequest, AskResponse,
    VivaQuestionsResponse, VivaAnswersResponse,
)
from backend.app.core.codebase_registry import (
    create_session, touch_and_check_quota, get_session_readonly, delete_session,
    SessionNotFound, SessionExpired, DailyLimitExceeded, SESSION_TTL, DAILY_REQUEST_LIMIT,
)

from backend.main import build_codebase, generate_viva_questions, generate_viva_answers
from backend.retrieval.ASK_CodeBase import ask_codebase

router = APIRouter(prefix="/codebase", tags=["codebase"])
UPLOAD_DIR = os.path.join(tempfile.gettempdir(), "codeutil_uploads")


@router.post("/upload", response_model=UploadResponse)
async def upload_codebase(
    files: list[UploadFile] = File(...),
    current_user: str = Depends(get_current_user),
):
    user_id = current_user  # get_current_user returns the email string, already a usable id
    user_dir = os.path.join(UPLOAD_DIR, user_id)
    os.makedirs(user_dir, exist_ok=True)

    saved_paths = []
    for f in files:
        if not f.filename or not f.filename.endswith(".py"):
            raise HTTPException(400, f"Only .py files supported, got {f.filename}")

        dest = os.path.join(user_dir, f.filename)
        with open(dest, "wb") as out:
            shutil.copyfileobj(f.file, out)
        await f.close()
        saved_paths.append(dest)

    if not saved_paths:
        raise HTTPException(400, "No files uploaded")

    engine = await run_in_threadpool(build_codebase, saved_paths)
    create_session(user_id, engine)

    return UploadResponse(
        status="done",
        files_indexed=len(saved_paths),
        message=f"Indexed {len(saved_paths)} files, {len(engine['all_chunks'])} functions extracted. "
                f"Session active for {int(SESSION_TTL.total_seconds() // 3600)}h, "
                f"{DAILY_REQUEST_LIMIT} messages/day.",
    )


def _resolve_session(user_id: str):
    try:
        return touch_and_check_quota(user_id)
    except SessionNotFound:
        raise HTTPException(404, "No active codebase session. Upload files first at /codebase/upload.")
    except SessionExpired:
        raise HTTPException(401, "Your session has expired due to inactivity. Please re-upload your codebase.")
    except DailyLimitExceeded as e:
        raise HTTPException(
            429,
            f"Daily limit reached ({e.used}/{DAILY_REQUEST_LIMIT} messages used today). Resets at UTC midnight.",
        )


@router.post("/ask", response_model=AskResponse)
async def ask(payload: AskRequest, current_user: str = Depends(get_current_user)):
    session = _resolve_session(current_user)
    answer = await run_in_threadpool(
        ask_codebase, payload.query, session.faiss_store, session.bm25_store
    )
    return AskResponse(answer=answer)


@router.post("/viva/questions", response_model=VivaQuestionsResponse)
async def viva_questions(current_user: str = Depends(get_current_user)):
    """Generate and return viva questions only. Caches them on the session
    so /codebase/viva/answers can pick them up without regenerating."""
    session = _resolve_session(current_user)
    questions = await run_in_threadpool(generate_viva_questions, session.all_chunks)

    # Cache on the session for the follow-up /viva/answers call.
    # If SessionData uses __slots__/is a frozen dataclass without this field,
    # this will raise AttributeError — add `viva_questions: dict | None = None`
    # to that class definition.
    session.viva_questions = questions

    return VivaQuestionsResponse(questions=questions)


@router.post("/viva/answers", response_model=VivaAnswersResponse)
async def viva_answers(current_user: str = Depends(get_current_user)):
    """Return answers for the most recently generated viva questions.
    Requires /codebase/viva/questions to have been called first in this session."""
    session = _resolve_session(current_user)
    questions = getattr(session, "viva_questions", None)

    if not questions:
        raise HTTPException(
            400,
            "No viva questions found for this session. Call /codebase/viva/questions first.",
        )

    answers = await run_in_threadpool(
        generate_viva_answers, questions, session.faiss_store, session.bm25_store
    )
    return VivaAnswersResponse(answers=answers)


@router.get("/status")
async def status(current_user: str = Depends(get_current_user)):
    session = get_session_readonly(current_user)
    if session is None:
        return {"active": False}

    now = datetime.utcnow()
    used_today = session.request_count if session.request_date == now.date() else 0
    return {
        "active": True,
        "files_indexed_functions": len(session.all_chunks),
        "expires_in_seconds": int((session.last_active + SESSION_TTL - now).total_seconds()),
        "requests_used_today": used_today,
        "requests_remaining_today": DAILY_REQUEST_LIMIT - used_today,
    }


@router.delete("/session")
async def end_session(current_user: str = Depends(get_current_user)):
    delete_session(current_user)
    return {"status": "session ended"}
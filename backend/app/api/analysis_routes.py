from typing import Annotated, Any

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from starlette.concurrency import run_in_threadpool

from app.core.database import get_db
from app.core.security import CurrentUser
from app.models.analysis import AnalysisResult
from app.schemas.analysis_schema import (
    AnalysisHistoryResponse,
    AnalysisResponse,
)
from app.services.ai_feedback_service import generate_feedback
from app.services.ats_service import calculate_ats_score
from app.services.parser_service import ResumeParsingError, parse_resume
from app.services.similarity_service import calculate_semantic_similarity
from app.services.skill_extractor import extract_skills
from app.services.text_cleaner import clean_text
from app.utils.file_utils import read_upload

router = APIRouter(prefix="/analysis", tags=["Analysis"])
DbSession = Annotated[Session, Depends(get_db)]


def _run_analysis(
    content: bytes,
    extension: str,
    job_description: str,
    feedback_language: str = "en",
) -> dict[str, Any]:
    resume_text = parse_resume(content, extension)
    cleaned_job_description = clean_text(job_description)
    if len(cleaned_job_description) < 40:
        raise ResumeParsingError("The job description is too short to analyze.")

    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(cleaned_job_description)
    resume_skill_set = set(resume_skills)
    job_skill_set = set(job_skills)
    matched_skills = sorted(resume_skill_set & job_skill_set, key=str.casefold)
    missing_skills = sorted(job_skill_set - resume_skill_set, key=str.casefold)
    extra_skills = sorted(resume_skill_set - job_skill_set, key=str.casefold)

    skill_match_score = (
        round(len(matched_skills) / len(job_skills) * 100, 2) if job_skills else 0.0
    )
    semantic_score = calculate_semantic_similarity(
        resume_text,
        cleaned_job_description,
    )
    ats_score, ats_breakdown = calculate_ats_score(
        resume_text,
        cleaned_job_description,
        skill_match_score,
        semantic_score,
    )
    feedback = generate_feedback(
        resume_text,
        cleaned_job_description,
        matched_skills,
        missing_skills,
        ats_score,
        feedback_language,
    )
    return {
        "job_description": cleaned_job_description,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "extra_resume_skills": extra_skills,
        "skill_match_score": skill_match_score,
        "semantic_similarity_score": semantic_score,
        "ats_score": ats_score,
        "ats_breakdown": ats_breakdown,
        "ai_feedback": feedback,
    }


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    current_user: CurrentUser,
    db: DbSession,
    resume_file: Annotated[UploadFile, File(...)],
    job_description: Annotated[str, Form(min_length=40, max_length=30000)],
    feedback_language: Annotated[str, Form(pattern="^(en|tr)$")] = "en",
) -> AnalysisResult:
    filename, content, extension = await read_upload(resume_file)

    try:
        payload = await run_in_threadpool(
            _run_analysis,
            content,
            extension,
            job_description,
            feedback_language,
        )
    except ResumeParsingError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    try:
        analysis = AnalysisResult(
            user_id=current_user.id,
            resume_filename=filename,
            **payload,
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return analysis
    except Exception:
        db.rollback()
        raise


@router.get("/history", response_model=AnalysisHistoryResponse)
def analysis_history(
    current_user: CurrentUser,
    db: DbSession,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
) -> AnalysisHistoryResponse:
    total = db.scalar(
        select(func.count(AnalysisResult.id)).where(
            AnalysisResult.user_id == current_user.id
        )
    ) or 0
    items = db.scalars(
        select(AnalysisResult)
        .where(AnalysisResult.user_id == current_user.id)
        .order_by(AnalysisResult.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()
    return AnalysisHistoryResponse(items=list(items), total=total)


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def analysis_detail(
    analysis_id: int,
    current_user: CurrentUser,
    db: DbSession,
) -> AnalysisResult:
    analysis = db.scalar(
        select(AnalysisResult).where(
            AnalysisResult.id == analysis_id,
            AnalysisResult.user_id == current_user.id,
        )
    )
    if analysis is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found.",
        )
    return analysis

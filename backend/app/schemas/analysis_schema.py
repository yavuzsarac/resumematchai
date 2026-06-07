from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class FeedbackResponse(BaseModel):
    summary_feedback: str
    missing_keywords: list[str]
    bullet_point_suggestions: list[str]
    action_items: list[str]
    recommended_resume_summary: str


class AnalysisResponse(BaseModel):
    id: int
    user_id: int
    resume_filename: str
    job_description: str
    resume_skills: list[str]
    job_skills: list[str]
    matched_skills: list[str]
    missing_skills: list[str]
    extra_resume_skills: list[str]
    skill_match_score: float = Field(ge=0, le=100)
    semantic_similarity_score: float = Field(ge=0, le=100)
    ats_score: float = Field(ge=0, le=100)
    ats_breakdown: dict[str, Any]
    ai_feedback: FeedbackResponse
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnalysisHistoryItem(BaseModel):
    id: int
    resume_filename: str
    ats_score: float
    skill_match_score: float
    semantic_similarity_score: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AnalysisHistoryResponse(BaseModel):
    items: list[AnalysisHistoryItem]
    total: int

from datetime import datetime, timezone
from typing import Any, TYPE_CHECKING

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.user import User


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    resume_filename: Mapped[str] = mapped_column(String(255))
    job_description: Mapped[str] = mapped_column(Text)
    resume_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    job_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    matched_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    missing_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    extra_resume_skills: Mapped[list[str]] = mapped_column(JSON, default=list)
    skill_match_score: Mapped[float] = mapped_column(Float)
    semantic_similarity_score: Mapped[float] = mapped_column(Float)
    ats_score: Mapped[float] = mapped_column(Float)
    ats_breakdown: Mapped[dict[str, Any]] = mapped_column(JSON)
    ai_feedback: Mapped[dict[str, Any]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        index=True,
        nullable=False,
    )

    user: Mapped["User"] = relationship(back_populates="analyses")


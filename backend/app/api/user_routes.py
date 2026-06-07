from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import CurrentUser
from app.models.analysis import AnalysisResult
from app.models.user import User
from app.schemas.user_schema import UserResponse, UserStatsResponse

router = APIRouter(prefix="/user", tags=["User"])
DbSession = Annotated[Session, Depends(get_db)]


@router.get("/profile", response_model=UserResponse)
def profile(current_user: CurrentUser) -> User:
    return current_user


@router.get("/stats", response_model=UserStatsResponse)
def stats(current_user: CurrentUser, db: DbSession) -> UserStatsResponse:
    total = db.scalar(
        select(func.count(AnalysisResult.id)).where(
            AnalysisResult.user_id == current_user.id
        )
    ) or 0
    return UserStatsResponse(total_completed_analyses=total)

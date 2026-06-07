from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import (
    CurrentUser,
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.schemas.auth_schema import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.user_schema import UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])
DbSession = Annotated[Session, Depends(get_db)]


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: DbSession) -> TokenResponse:
    normalized_email = payload.email.lower()
    if db.scalar(select(User).where(User.email == normalized_email)):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        name=payload.name.strip(),
        email=normalized_email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(
        access_token=create_access_token(user.id),
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: DbSession) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return TokenResponse(
        access_token=create_access_token(user.id),
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def me(current_user: CurrentUser) -> User:
    return current_user


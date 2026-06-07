from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserStatsResponse(BaseModel):
    total_completed_analyses: int = Field(ge=0)

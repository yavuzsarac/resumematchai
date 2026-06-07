from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api import analysis_routes, auth_routes, user_routes
from app.core.config import settings
from app.core.database import Base, engine, get_db
from app import models  # noqa: F401


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="AI-powered resume and job-description matching API.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix=settings.api_v1_prefix)
app.include_router(user_routes.router, prefix=settings.api_v1_prefix)
app.include_router(analysis_routes.router, prefix=settings.api_v1_prefix)


@app.get("/health", tags=["System"])
def health_check(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok", "service": settings.app_name}

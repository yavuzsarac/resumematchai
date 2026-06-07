from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}


def safe_filename(filename: str | None) -> str:
    cleaned = Path(filename or "resume").name.strip()
    return cleaned or "resume"


async def read_upload(upload: UploadFile) -> tuple[str, bytes, str]:
    filename = safe_filename(upload.filename)
    extension = Path(filename).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Please upload a PDF, DOCX, or TXT file.",
        )

    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    content = await upload.read(max_bytes + 1)
    await upload.close()

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded resume is empty.",
        )
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Resume file must be smaller than {settings.max_upload_size_mb} MB.",
        )
    return filename, content, extension


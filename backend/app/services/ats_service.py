import re
from typing import Any

STOPWORDS = {
    "about",
    "after",
    "also",
    "and",
    "are",
    "but",
    "for",
    "from",
    "have",
    "into",
    "our",
    "that",
    "the",
    "their",
    "this",
    "using",
    "will",
    "with",
    "you",
    "your",
}


def _clamp(score: float) -> float:
    return round(max(0.0, min(score, 100.0)), 2)


def _keyword_overlap(resume_text: str, job_description: str) -> float:
    words = re.compile(r"[a-zA-Z][a-zA-Z0-9+#.]{2,}")
    resume_words = {word.lower() for word in words.findall(resume_text)}
    job_words = {
        word.lower()
        for word in words.findall(job_description)
        if word.lower() not in STOPWORDS
    }
    if not job_words:
        return 0.0
    return _clamp(len(resume_words & job_words) / len(job_words) * 100)


def _formatting_quality(resume_text: str) -> float:
    score = 25.0
    lower_text = resume_text.lower()
    section_names = ("experience", "education", "skills", "summary", "projects")
    section_count = sum(section in lower_text for section in section_names)
    score += min(section_count * 10, 40)

    lines = [line.strip() for line in resume_text.splitlines() if line.strip()]
    bullet_count = sum(
        line.startswith(("-", "*", "•", "▪", "–")) for line in lines
    )
    if bullet_count >= 3:
        score += 20
    if 250 <= len(resume_text.split()) <= 1200:
        score += 15
    return _clamp(score)


def _contact_information_score(resume_text: str) -> float:
    email_found = bool(
        re.search(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", resume_text, re.I)
    )
    phone_found = bool(
        re.search(r"(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}", resume_text)
    )
    link_found = bool(
        re.search(r"(?:linkedin\.com|github\.com|https?://|www\.)", resume_text, re.I)
    )
    return float(email_found * 40 + phone_found * 40 + link_found * 20)


def calculate_ats_score(
    resume_text: str,
    job_description: str,
    skill_match_score: float,
    semantic_similarity_score: float,
) -> tuple[float, dict[str, Any]]:
    keyword_score = _keyword_overlap(resume_text, job_description)
    formatting_score = _formatting_quality(resume_text)
    contact_score = _contact_information_score(resume_text)

    components = {
        "skill_match": {
            "score": _clamp(skill_match_score),
            "weight": 0.40,
            "explanation": "Share of required technical skills found in the resume.",
        },
        "keyword_overlap": {
            "score": keyword_score,
            "weight": 0.25,
            "explanation": "Overlap between meaningful job-description keywords and resume text.",
        },
        "semantic_similarity": {
            "score": _clamp(semantic_similarity_score),
            "weight": 0.15,
            "explanation": "Overall contextual similarity between the resume and the role.",
        },
        "formatting_quality": {
            "score": formatting_score,
            "weight": 0.10,
            "explanation": "Checks readable length, common sections, and bullet-based structure.",
        },
        "contact_information": {
            "score": contact_score,
            "weight": 0.10,
            "explanation": "Checks for email, phone number, and a professional profile or website.",
        },
    }

    final_score = 0.0
    for component in components.values():
        contribution = component["score"] * component["weight"]
        component["weighted_contribution"] = round(contribution, 2)
        final_score += contribution

    return _clamp(final_score), components

